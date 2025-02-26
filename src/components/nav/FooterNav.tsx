import React from "react";
import { useLocation, Link } from "react-router-dom";
import styled from "styled-components";

import Home from "../../assets/images/admin/grey_home.png";
import ActHome from "../../assets/images/admin/purple_home.png";
import Reserved from "../../assets/images/admin/grey_checked_list.png";
import ActReserved from "../../assets/images/admin/purple_checked_list.png";
import Onsite from "../../assets/images/admin/grey_plus_list.png";
import ActOnsite from "../../assets/images/admin/purple_plus_list.png";
import Setting from "../../assets/images/admin/grey_setting.png"
import ActSetting from "../../assets/images/admin/purple_setting.png"

interface FooterNavProps {
}

const FotterNav: React.FC<FooterNavProps> = () => {
  const location = useLocation(); // 현재 경로를 가져옴

  return (
    <Nav className="Podo-Ticket-Body-B7">

      <>
        <NavItem className={location.pathname.startsWith("/home") ? "active" : ""}>
          <NavLink to="/home">
            <IconHome src={location.pathname.startsWith("/home") ? ActHome : Home} />
            <p>홈</p>
          </NavLink>
        </NavItem>
        <NavItem
          className={location.pathname.startsWith("/reserved") ? "active" : ""}
        >
          <NavLink to="/reserved">
            <IconReserved
              src={location.pathname.startsWith("/reserved") ? ActReserved : Reserved}
            />
            <p>발권 명단 관리</p>
          </NavLink>
        </NavItem>
        <NavItem className={location.pathname.startsWith("/onsite") ? "active" : ""}>
          <NavLink to="/onsite">
            <IconOnsite
              src={location.pathname.startsWith("/onsite") ? ActOnsite : Onsite}
            />
            <p>현장 예매 관리</p>
          </NavLink>
        </NavItem>
        <NavItem className={location.pathname.startsWith("/setting") ? "active" : ""}>
          <NavLink to="/setting">
            <IconSetting
              src={location.pathname.startsWith("/setting") ? ActSetting : Setting}
            />
            <p>설정</p>
          </NavLink>
        </NavItem>
      </>



    </Nav>
  );
};

export default FotterNav;

const Nav = styled.nav`
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;

  height: 86px;
  background: var(--ect-white);
  border: none;
  border-top: 1px solid var(--grey-3);
  box-shadow: 0px 0px 9px 6px rgba(0, 0, 0, 0.03);
  border-radius: 20px 20px 0px 0px;

  z-index: 1000;
`;

const NavItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 80%;
  height: 100%;

  color: var(--grey-5);
  text-align: center;

  &.active {
    color: var(--purple-4); /* 활성화된 텍스트 색상 */
  }

  transition: color 0.3s ease-in-out;

  user-select: none; /* 텍스트 선택 방지 */
  -webkit-user-select: none; /* Safari에서 드래그 방지 */
  -moz-user-select: none; /* Firefox에서 드래그 방지 */
  -ms-user-select: none;
`;

const NavLink = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: inherit;
  width: inherit;
  height: inherit;

  & > p {
    margin: 0;
    padding: 0;
  }
  p {
    margin-bottom: 32px;
  }
`;

const IconHome = styled.img`
  width: 24px;
  height: 24px;

  margin-top: 17px;
  margin-bottom: 5px;
`;

const IconReserved = styled.img`
  width: 25px;
  height: 23px;

  margin-top: 18px;
  margin-bottom: 5px;
`;

const IconOnsite = styled.img`
  width: 20px;
  height: 19px;

  margin-top: 20px;
  margin-bottom: 7px;
`;

const IconSetting = styled.img`
  width: 22px;
  height: 22px;

  margin-top: 18px;
  margin-bottom: 6px;
`;