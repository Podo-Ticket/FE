import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';

import FooterNav from '../../components/nav/FooterNav.tsx'
import PlaySessionPicker from '../../components/nav/PlaySessionPicker.tsx';
import SearchFilterBar from '../../components/nav/SearchFilterBar.tsx';
import CustomerListItem from '../../components/info/CustomerListItem.tsx';
import TopNav from '../../components/nav/TopNav.tsx';

import insertCustomer from '../../assets/images/admin/plus_user.png'

import { fadeIn } from '../../styles/animation/DefaultAnimation.ts';
import { User, fetchReservedUserList, Schedule, fetchSchedules } from '../../api/admin/ReservedManageApi.ts';

const ReservedManage = () => {
    const navigate = useNavigate();

    const [isRefreshed, setIsRefreshed] = useState<boolean>(false);
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [selectedSession, setSelectedSession] = useState<string>("");
    const handleSessionChange = (event: React.ChangeEvent<HTMLSelectElement>) => setSelectedSession(event.target.value);
    useEffect(() => {       // 공연 회차 데이터 가져오기 처리
        const loadSchedules = async () => {
            try {
                const data = await fetchSchedules(); // 공연 회차 데이터 가져오기
                setSchedules(data);

                // 로컬스토리지에서 currentScheduleId 가져오기
                const currentScheduleId = localStorage.getItem("currentScheduleId");

                if (currentScheduleId) {
                    // 로컬스토리지에 저장된 ID가 유효한 경우
                    setSelectedSession(currentScheduleId);
                } else {
                    // 로컬스토리지가 비어있는 경우 첫 번째 회차 선택
                    setSelectedSession(data[0].id.toString());
                }
            } catch (error) {
                console.error("Error loading schedules:", error);
            }
        };

        loadSchedules();
    }, []);
    const triggerRefresh = () => setIsRefreshed((prev) => !prev);

    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('전체');
    const handleSearch = (e) => setSearch(e.target.value);
    const handleSearchButtonClick = () => setSearch(''); // 검색어 초기화

    // 예매자 리스트 데이터 가져오기
    const [data, setData] = useState<User[]>([]);
    useEffect(() => {
        if (!selectedSession) return;

        localStorage.setItem("currentScheduleId", selectedSession);
        console.log("Saved to localStorage:", selectedSession);

        const loadUserList = async () => {
            try {
                const data = await fetchReservedUserList(selectedSession); // 사용자 리스트 가져오기

                console.log("users: ", data);
                setData(data.users);
            } catch (error) {
                console.error("Error loading user list:", error);
            }
        };

        loadUserList();
    }, [selectedSession, isRefreshed]);

    // Top navigation 요소 정의
    const navItem = {
        icon: insertCustomer,
        iconWidth: 22,
        iconHeight: 19,
        text: "예매 명단 관리",
        clickFunc: undefined
    }

    // 필터에 따라 데이터를 필터링 및 정렬
    const filteredData = data
        .filter(item => {
            // 상태 필터링
            if (filter === '전체') return true; // 전체일 경우 필터링 없이 다 보여줌
            return item.state === (filter === '수락 완료'); // '수락 완료'일 경우 true, 미 수락일 경우 false
        })
        .filter(item => {
            // 검색 필터링 (이름 또는 전화번호)
            const lowerCaseSearch = search.toLowerCase();
            return item.name?.toLowerCase().includes(lowerCaseSearch) || item.phone_number?.includes(lowerCaseSearch);
        })
        .sort((a, b) => {
            // 1순위: "미 수락" 항목을 최상단으로
            if (a.state === false && b.state !== false) return -1; // a가 미 수락이면 a를 먼저
            if (b.state === false && a.state !== false) return 1; // b가 미 수락이면 b를 먼저

            // 2순위: 이름의 가나다 순 정렬
            const nameA = a.name.charCodeAt(0);
            const nameB = b.name.charCodeAt(0);
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;

            // 3순위: ID의 오름차순 정렬
            return a.id - b.id; // ID로 오름차순 정렬
        });

    // 전체 데이터에서 발권 완료 및 미발권 건수 계산
    const totalCount = data.length;
    const acceptCount = data.filter(item => item.state === true).length;
    const unacceptCount = data.filter(item => item.state === false).length;
    const handleFilterClick = (newFilter) => {
        setFilter(newFilter);
    };

    const handleListItemlick = (item) => {
        item.scheduleId = selectedSession;
        navigate('/delete', { state: { item } }); // 상태로 해당 항목 전달
    };

    return (
        <ViewContainer>
            <TopNav lefter={null} center={navItem} righter={navItem} isUnderlined={true} />

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
                filter={filter}
                totalCount={totalCount}
                acceptCount={acceptCount}
                unacceptCount={unacceptCount}
                handleFilterClick={handleFilterClick}
            />

            <ListContainer>
                <CustomerListItem
                    data={filteredData}
                    isOnsite={false}
                    onBtnClick={handleListItemlick}
                    canControll={false}
                />
            </ListContainer>

            <FooterNav />
        </ViewContainer >
    );
};

export default ReservedManage;

const ViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ListContainer = styled.div`
animation: ${fadeIn} 0.3s ease-in-out;
`;