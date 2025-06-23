import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import {useNavigate} from 'react-router-dom';

import FooterNav from '@components/layout/footers/FooterNav.tsx';
import PlaySessionPicker from '@components/layout/headers/PlaySessionPicker.tsx';
import SearchFilterBar from '@components/layout/headers/SearchFilterBar.tsx';
import CustomerListItem from '@components/common/informations/CustomerListItem.tsx';
import TopNav from '@components/layout/headers/TopNav.tsx';

import insertCustomer from '@assets/icons/ic_plus_user.svg';
import onsiteAlarmIcon from '@assets/icons/ic_ticket_add.svg';
import directIcon from '@assets/icons/ic_arrow_right.svg';

import {fadeIn} from '../../styles/animation/DefaultAnimation.ts';
import {
  User,
  fetchReservedUserList,
  Schedule,
  fetchSchedules,
} from '../../api/admin/ReservedManageApi.ts';

const ReservedManage = () => {
  const navigate = useNavigate();

  const [isRefreshed] = useState<boolean>(false);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedSession, setSelectedSession] = useState<string>('');
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
          // 로컬스토리지가 비어있는 경우 첫 번째 회차 선택
          setSelectedSession(data[0].id.toString());
        }
      } catch (error) {}
    };

    loadSchedules();
  }, []);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('전체');
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSearchButtonClick = () => setSearch(''); // 검색어 초기화

  const handleClearSearch = () => {
    setSearch('');
  };
  // 예매자 리스트 데이터 가져오기
  const [data, setData] = useState<User[]>([]);
  useEffect(() => {
    if (!selectedSession) return;

    localStorage.setItem('currentScheduleId', selectedSession);

    const loadUserList = async () => {
      try {
        const data = await fetchReservedUserList(selectedSession); // 사용자 리스트 가져오기

        setData(data.users);
      } catch (error) {}
    };

    loadUserList();
  }, [selectedSession, isRefreshed]);

  // Top navigation 요소 정의
  const rightItem = {
    icon: insertCustomer,
    iconWidth: 22,
    iconHeight: 19,
    clickFunc: () => navigate('add'),
  };

  const centerItem = {
    text: '명단 관리',
  };

  const [isOnsiteExist, setIsOnsiteExist] = useState(true);
  const filteredData = data
    .filter(item => {
      // 상태 필터링
      if (filter === '전체') return true;
      return item.state === (filter === '수락 완료');
    })
    .filter(item => {
      // 검색 필터링 (이름 또는 전화번호)
      const lowerCaseSearch = search.toLowerCase();
      return (
        item.name?.toLowerCase().includes(lowerCaseSearch) ||
        item.phone_number?.includes(lowerCaseSearch)
      );
    })
    .sort((a, b) => {
      if (a.state === false && b.state !== false) return -1;
      if (b.state === false && a.state !== false) return 1;
      const nameA = a.name.charCodeAt(0);
      const nameB = b.name.charCodeAt(0);
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return a.id - b.id;
    });

  // 전체 데이터에서 발권 완료 및 미발권 건수 계산
  const totalCount = data.length;
  const acceptCount = data.filter(item => item.state === true).length;
  const unacceptCount = data.filter(item => item.state === false).length;
  const handleFilterClick = (newFilter: React.SetStateAction<string>) => {
    setFilter(newFilter);
  };

  const handleListItemlick = (item: {scheduleId: string; id: any}) => {
    item.scheduleId = selectedSession;
    navigate('/reserved/check', {
      state: {
        scheduleId: selectedSession, // 현재 선택된 공연 회차 ID
        userId: item.id, // 선택한 사용자 ID
      },
    });
  };

  return (
    <ViewContainer>
      <TopNav lefter={undefined} center={centerItem} righter={rightItem} isUnderlined={false} />

      <FilterContainer>
        <OnsiteAlarm
          enabled={isOnsiteExist}
          onClick={
            isOnsiteExist
              ? () => {
                  navigate('/onsite');
                }
              : undefined
          }
        >
          <LeftAlarmContent>
            <OnsiteIcon src={onsiteAlarmIcon} />
            {isOnsiteExist ? '현장 예매 요청' : '현장 예매 요청이 없습니다!'}
            {isOnsiteExist ? <NewIcon>NEW</NewIcon> : undefined}
          </LeftAlarmContent>

          {isOnsiteExist ? (
            <>
              <OnsiteDirect>바로가기</OnsiteDirect>
              <img src={directIcon} />
            </>
          ) : undefined}
        </OnsiteAlarm>

        <PlaySessionPicker
          schedules={schedules}
          selectedSession={selectedSession}
          onContentChange={handleSessionChange}
          isRounded={true}
        />
        <SearchFilterBar
          search={search}
          handleSearch={handleSearch}
          handleSearchButtonClick={handleSearchButtonClick}
          handleClearSearch={handleClearSearch}
          filter={filter}
          totalCount={totalCount}
          acceptCount={acceptCount}
          unacceptCount={unacceptCount}
          handleFilterClick={handleFilterClick}
          isReserved={true}
        />
      </FilterContainer>

      <ListContainer>
        <CustomerListItem
          data={filteredData}
          isOnsite={false}
          onBtnClick={handleListItemlick}
          canControll={false}
        />
      </ListContainer>

      <FooterNav />
    </ViewContainer>
  );
};

export default ReservedManage;

const ViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;

  padding: 0 10px;
`;

const OnsiteAlarm = styled.div<{enabled: boolean}>`
  display: flex;
  align-items: center;

  border-radius: 10px;

  background: ${({enabled}) => (enabled ? 'var(--purple-4)' : 'var(--grey-5)')};
  padding: 10px 18px;
  margin-bottom: 20px;
`;

const LeftAlarmContent = styled.div.attrs({className: 'Podo-Ticket-Headline-5'})`
  display: flex;
  align-items: center;
  flex-grow: 1;

  gap: 10px;

  color: var(--ect-white);
`;

const OnsiteIcon = styled.img`
  width: 16px;
  height: 16px;
`;

const NewIcon = styled.div.attrs({className: 'Podo-Ticket-Body-B12'})`
  border-radius: 30px;

  padding: 3px 5px;
  background: var(--ect-white);
  height: 100%;

  color: var(--purple-4);
`;

const OnsiteDirect = styled.div.attrs({className: 'Podo-Ticket-Body-B11'})`
  margin-right: 5px;

  color: var(--grey-3);
`;

const ListContainer = styled.div`
  max-height: calc(100vh - 250px);
  overflow-y: auto;

  padding-bottom: 50px;

  animation: ${fadeIn} 0.3s ease-in-out;
`;
