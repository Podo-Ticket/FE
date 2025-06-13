import React, {useState, useEffect} from 'react';
import {useLocation, Link} from 'react-router-dom';
import styled from 'styled-components';

import Home from '@assets/images/admin/grey_home.png';
import ActHome from '@assets/images/admin/purple_home.png';
import Reserved from '@assets/images/admin/grey_checked_list.png';
import ActReserved from '@assets/images/admin/purple_checked_list.png';
import Onsite from '@assets/images/admin/grey_plus_list.png';
import ActOnsite from '@assets/images/admin/purple_plus_list.png';
import Setting from '@assets/images/admin/grey_setting.png';
import ActSetting from '@assets/images/admin/purple_setting.png';

import RedCirclePng from '@assets/images/admin/redCircle.png';
import {pxToVh, pxToPercent} from '../../../utils/unitConverter.ts';
import {UserWithApproval, fetchOnsiteUserList} from '../../../api/admin/OnsiteManageApi';
import {usePath} from '../../../utils/PathContext.tsx';

const pathToIndex = (path: string) => {
  if (path.startsWith('/home')) return 0;
  if (path.startsWith('/reserved')) return 1;
  if (path.startsWith('/onsite')) return 2;
  if (path.startsWith('/setting')) return 3;
  return 0;
};

interface FooterNavProps {
  isGroupAllow?: boolean;
  groupAllowCnt?: number;
  isApproveClick?: (isApprove: boolean) => void;
  isDeleteClick?: (isApprove: boolean) => void;
}

const FotterNav: React.FC<FooterNavProps> = ({
  isGroupAllow = false,
  groupAllowCnt = 0,
  isApproveClick,
  isDeleteClick,
}) => {
  const location = useLocation();
  const {prevPath, setPrevPath} = usePath();
  const [, setPreveIndex] = useState(pathToIndex(location.pathname));
  const prevIndex = pathToIndex(prevPath);
  const [activeIndex] = useState(pathToIndex(location.pathname));
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [hasPendingApproval, setHasPendingApproval] = useState(false);
  const [, setData] = useState<UserWithApproval[]>([]);
  const [barX, setBarX] = useState(prevIndex * 100);

  useEffect(() => {
    const currentIndex = pathToIndex(location.pathname);
    const prevesIndex = pathToIndex(prevPath);
    if (currentIndex > prevesIndex) setDirection('right');
    else if (currentIndex < prevesIndex) setDirection('left');

    setPrevPath(location.pathname);
    setPreveIndex(prevesIndex);
    requestAnimationFrame(() => {
      setBarX(currentIndex * 100);
    });
  }, [location.pathname]);

  useEffect(() => {
    const loadUserList = async () => {
      const scheduleId = localStorage.getItem('scheduleId');
      if (!scheduleId) return;

      try {
        const response = await fetchOnsiteUserList(Number(scheduleId));
        setData(response.users);
        setHasPendingApproval(response.users.some(item => !item.approve));
      } catch (error) {
        console.error('Error loading user list:', error);
      }
    };

    loadUserList();
  }, [location.pathname]);

  return (
    <Nav className='Podo-Ticket-Body-B7' isGroupAllow={isGroupAllow}>
      {!isGroupAllow ? (
        <>
          <NavItem className={activeIndex === 0 ? 'active' : ''}>
            <NavLink to='/home'>
              <IconHome src={activeIndex === 0 ? ActHome : Home} />
              <p>홈</p>
            </NavLink>
          </NavItem>
          <NavItem className={activeIndex === 1 ? 'active' : ''}>
            <NavLink to='/reserved'>
              <IconReserved src={activeIndex === 1 ? ActReserved : Reserved} />
              <p>발권 명단 관리</p>
            </NavLink>
          </NavItem>
          <NavItem className={activeIndex === 2 ? 'active' : ''}>
            <NavLink to='/onsite'>
              <IconOnsite src={activeIndex === 2 ? ActOnsite : Onsite} />
              {hasPendingApproval && <RedCircle src={RedCirclePng} />}
              <p>현장 예매 관리</p>
            </NavLink>
          </NavItem>
          <NavItem className={activeIndex === 3 ? 'active' : ''}>
            <NavLink to='/setting'>
              <IconSetting src={activeIndex === 3 ? ActSetting : Setting} />
              <p>설정</p>
            </NavLink>
          </NavItem>
          <ActiveBar x={barX ?? 0} direction={direction} hasTransition={barX !== null} />
        </>
      ) : (
        <>
          <AllowItem
            className='Podo-Ticket-Headline-H4'
            isActive={groupAllowCnt !== 0}
            onClick={() => isApproveClick?.(true)}
            disabled={groupAllowCnt === 0}
          >
            수락
          </AllowItem>
          <DeleteItem
            className='Podo-Ticket-Headline-H4'
            isActive={groupAllowCnt !== 0}
            onClick={() => isDeleteClick?.(false)}
            disabled={groupAllowCnt === 0}
          >
            삭제
          </DeleteItem>
        </>
      )}
    </Nav>
  );
};

export default FotterNav;

const Nav = styled.nav<{isGroupAllow: boolean}>`
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: ${({isGroupAllow}) =>
    !isGroupAllow ? `${pxToPercent(86, 661)}` : `${pxToPercent(60, 661)}`};
  background: var(--ect-white);
  border-top: 1px solid var(--grey-3);
  box-shadow: 0px 0px 9px 6px rgba(0, 0, 0, 0.03);
  border-radius: 20px 20px 0 0;
  z-index: 1000;
`;

const NavItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: var(--grey-5);
  text-align: center;
  &.active {
    color: var(--purple-4);
  }
  transition: color 0.3s ease-in-out;
  user-select: none;
`;

const NavLink = styled(Link)`
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: center;
  text-decoration: none;
  color: inherit;
  width: ${pxToPercent(75, 98.25)};
  height: ${pxToPercent(59, 86)};
  p {
    margin: ${pxToVh(5)} 0;
  }
`;

const IconHome = styled.img`
  height: ${pxToPercent(24, 59)};
  margin: ${pxToVh(5)} 0;
`;
const IconReserved = styled.img`
  height: ${pxToPercent(24, 59)};
  margin: ${pxToVh(5)} 0;
`;
const IconOnsite = styled.img`
  height: ${pxToPercent(24, 59)};
  margin: ${pxToVh(5)} 0;
`;
const IconSetting = styled.img`
  height: ${pxToPercent(24, 59)};
  margin: ${pxToVh(5)} 0;
`;

const AllowItem = styled.button<{isActive: boolean}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80%;
  height: 100%;
  border: none;
  background: var(--grey-1);
  border-right: 1px solid var(--grey-3);
  border-radius: 20px 0 0 0;
  text-align: center;
  color: ${({isActive}) => (isActive ? 'var(--purple-4)' : 'var(--purple-8)')};
  transition: color 0.3s ease-in-out;
  user-select: none;
`;

const DeleteItem = styled.button<{isActive: boolean}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80%;
  height: 100%;
  border: none;
  background: var(--grey-1);
  border-radius: 0 20px 0 0;
  text-align: center;
  color: ${({isActive}) => (isActive ? 'var(--grey-7)' : 'var(--grey-4)')};
  transition: color 0.3s ease-in-out;
  user-select: none;
`;

const RedCircle = styled.img`
  position: absolute;
  height: ${pxToPercent(7, 59)};
  top: 0%;
  right: 20%;
`;

const ActiveBar = styled.div<{
  x: number;
  direction: 'left' | 'right';
  hasTransition: boolean;
}>`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 25%;
  height: 4px;
  background-color: var(--purple-4);
  transform: translateX(${({x}) => `${x}%`});
  transition: ${({hasTransition, direction}) =>
    hasTransition ? `transform 0.3s ${direction === 'right' ? 'ease-out' : 'ease-in'}` : 'none'};
  will-change: transform;
`;
