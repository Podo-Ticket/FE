import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import {useNavigate} from 'react-router-dom';
import socket from '../../api/socket';

import TopNav from '@components/layout/headers/TopNav.tsx';
import CustomerListItem from '@components/common/informations/CustomerListItem.tsx';
import FooterNav from '@components/layout/footers/FooterNav.tsx';

import backIcon from '@assets/icons/ic_arrow_left.svg';

import {fadeIn} from '../../styles/animation/DefaultAnimation.ts';
import {
  UserWithApproval,
  approveOnsite,
  Schedule,
  fetchOnsiteUserList,
  fetchSchedules,
} from '../../api/admin/OnsiteManageApi';
import PlaySessionPicker from '@/components/layout/headers/PlaySessionPicker.tsx';

interface OnsiteApprovalRequest {
  userIds: number[];
  scheduleId: number;
  check: boolean;
}

const OnsiteManage = () => {
  const navigate = useNavigate();

  const [isRefreshed, setIsRefreshed] = useState<boolean>(false);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedSession, setSelectedSession] = useState<string>('');
  // 공연 회차 선택 핸들러
  const handleSessionChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
    setSelectedSession(event.target.value);
  useEffect(() => {
    // 공연 회차 데이터 가져오기 처리
    const loadSchedules = async () => {
      try {
        const data = await fetchSchedules(); // 공연 회차 데이터 가져오기
        setSchedules(data);

        // 로컬스토리지에서 currentScheduleId 가져오기
        const currentScheduleId = localStorage.getItem('currentScheduleId');

        if (currentScheduleId) {
          // 로컬스토리지에 저장된 ID가 유효한 경우
          setSelectedSession(currentScheduleId);
        } else {
          // 데이터가 있는 경우 첫 번째 회차 선택
          setSelectedSession(data[0].id.toString());
        }
      } catch (error) {}
    };

    loadSchedules();
  }, []);
  const triggerRefresh = () => setIsRefreshed(prev => !prev);

  const lefter = {
    icon: backIcon,
    iconWidth: 13,
    iconHeight: 20,
    text: '',
    clickFunc: () => {
      navigate(-1);
    },
  };

  const [isOnsiteArrived, setIsOnsiteArrived] = useState(false);
  useEffect(() => {
    const handleOnsiteReservation = () => {
      setIsOnsiteArrived(true);
      console.log('onsite reservation');
    };

    socket.on('admin:onsite-reservation', handleOnsiteReservation);

    return () => {
      socket.off('admin:onsite-reservation', handleOnsiteReservation);
    };
  }, []);
  // 현장 예매자 리스트 데이터 가져오기
  const [data, setData] = useState<UserWithApproval[]>([]);
  useEffect(() => {
    if (!selectedSession) return;

    localStorage.setItem('currentScheduleId', selectedSession);

    const loadUserList = async () => {
      try {
        const data = await fetchOnsiteUserList(Number(selectedSession));
        setData(data.users);
      } catch (error) {}
    };

    loadUserList();
  }, [selectedSession, isRefreshed, isOnsiteArrived]);

  // 현장 예매자 발권 승인, 거절 처리
  const handleApproveClick = async (request: OnsiteApprovalRequest) => {
    try {
      // 승인 요청 API 호출
      const {userIds, scheduleId, check} = request; // request 객체에서 데이터 추출

      const response = await approveOnsite(userIds, scheduleId, check);

      if (response.accept) {
        triggerRefresh(); // accepted
      } else {
        triggerRefresh(); // rejected
      }
    } catch (error: any) {
      alert(error.message);
    }
  };
  // 현장 예매자 일괄 승인/삭제 처리
  const handleGroupApproveClick = async () => {
    // const request: OnsiteApprovalRequest = {
    //     userIds: checkedItems, // 단일 사용자 ID를 배열로 전달
    //     scheduleId: Number(selectedSession), // 예시로 사용되는 공연 일정 ID
    //     check: isApprove, // 승인 여부
    // };

    try {
      // const result = await handleApproveClick(request); // 결과 저장

      setIsManaging(false);
      setCheckedItems([]);
      toggleExpand();
      triggerRefresh();
    } catch (error: any) {}
  };

  const [isExpanded, setIsExpanded] = useState(false);
  const [isManaging, setIsManaging] = useState(false);
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const toggleExpand = () => setIsExpanded(!isExpanded);
  const handleManageClick = () => {
    setIsManaging(!isManaging);
    toggleExpand();
  };

  const handleCheckClick = (id: number) => {
    setCheckedItems(prev => {
      const isAlreadyChecked = prev.includes(id);

      if (isAlreadyChecked) {
        const updatedItems = prev.filter(item => item !== id);
        return updatedItems;
      } else {
        const updatedItems = [...prev, id];
        return updatedItems;
      }
    });
  };

  // Navigation 중앙, 우측부 처리
  const center = {text: '현장 예매 관리'};
  const [righter, setRighter] = useState({
    text: '선택',
    clickFunc: handleManageClick,
  });
  useEffect(() => {
    isManaging
      ? setRighter({text: '취소', clickFunc: handleManageClick})
      : setRighter({text: '선택', clickFunc: handleManageClick});
  }, [isManaging]);

  // 유저 리스트 데이터 필터 정의
  const filteredData = data.sort((a, b) => {
    // 1순위: "미 수락" 항목을 최상단으로
    if (a.approve === false && b.approve !== false) return -1; // a가 미 수락이면 a를 먼저
    if (b.approve === false && a.approve !== false) return 1; // b가 미 수락이면 b를 먼저

    // 2순위: 이름의 가나다 순 정렬
    const nameA = a.user.name.charCodeAt(0);
    const nameB = b.user.name.charCodeAt(0);
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;

    // 3순위: ID의 오름차순 정렬
    return a.user.id - b.user.id; // ID로 오름차순 정렬
  });

  return (
    <ViewContainer>
      <TopNav lefter={lefter} center={center} righter={righter} isUnderlined={false} />

      <FilterContainer>
        <PlaySessionPicker
          schedules={schedules}
          selectedSession={selectedSession}
          onContentChange={handleSessionChange}
          isRounded={true}
        />
      </FilterContainer>

      {filteredData && filteredData.length > 0 ? (
        <ListContainer>
          <CustomerListItem
            data={filteredData}
            scheduleId={Number(selectedSession)}
            onBtnClick={undefined}
            isOnsite={true}
            canControll={true}
            isExpanded={isExpanded}
            checkedItems={checkedItems}
            onApprovalRequest={handleApproveClick}
            onCheckClick={handleCheckClick}
          />
        </ListContainer>
      ) : (
        <EmptyPlaceholder className='Podo-Ticket-Body-B5'>
          현장 예매 요청이 없습니다.
        </EmptyPlaceholder>
      )}

      {isManaging ? (
        <FooterNav
          isGroupAllow={true}
          groupAllowCnt={checkedItems.length}
          isApproveClick={() => handleGroupApproveClick()}
          isDeleteClick={() => handleGroupApproveClick()}
        />
      ) : undefined}
    </ViewContainer>
  );
};

export default OnsiteManage;

const ViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const FilterContainer = styled.div`
  padding: 0 10px;
`;

const ListContainer = styled.div`
  max-height: calc(100vh - 250px);
  overflow-y: auto;

  padding-bottom: 50px;

  animation: ${fadeIn} 0.3s ease-in-out;
`;

const EmptyPlaceholder = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 80vh;

  color: var(--grey-6);
`;
