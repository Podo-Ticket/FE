import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';

import TopNav from '../../components/nav/TopNav.tsx';
import PlaySessionPicker from '../../components/nav/PlaySessionPicker.tsx';
import SearchFilterBar from '../../components/nav/SearchFilterBar.tsx';
import CustomerListItem from '../../components/info/CustomerListItem.tsx';
import FooterNav from '../../components/nav/FooterNav.tsx'

import { fadeIn } from '../../styles/animation/DefaultAnimation.ts';
import { UserWithApproval, approveOnsite, Schedule, fetchOnsiteUserList, fetchSchedules } from '../../api/admin/OnsiteManageApi';

interface OnsiteApprovalRequest {
    userIds: number[];
    scheduleId: number;
    check: boolean;
}

const OnsiteManage = () => {
    const navigate = useNavigate();

    const [isRefreshed, setIsRefreshed] = useState<boolean>(false);
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [selectedSession, setSelectedSession] = useState<string>("");
    // 공연 회차 선택 핸들러
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
                    // 데이터가 있는 경우 첫 번째 회차 선택
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

    // 현장 예매자 리스트 데이터 가져오기
    const [data, setData] = useState<UserWithApproval[]>([]);
    useEffect(() => {
        if (!selectedSession) return;

        localStorage.setItem("currentScheduleId", selectedSession);
        console.log("Saved to localStorage:", selectedSession);

        const loadUserList = async () => {
            try {
                const data = await fetchOnsiteUserList(Number(selectedSession)); // 사용자 리스트 가져오기
                setData(data.users);
            } catch (error) {
                console.error("Error loading user list:", error);
            }
        };

        loadUserList();
    }, [selectedSession, isRefreshed]);
    // 현장 예매자 발권 승인, 거절 처리
    const handleApproveClick = async (request: OnsiteApprovalRequest) => {
        try {
            // 승인 요청 API 호출
            const { userIds, scheduleId, check } = request; // request 객체에서 데이터 추출

            const response = await approveOnsite(userIds, scheduleId, check);

            if (response.accept) {
                console.log("Approval request sent successfully.");
            } else {
                alert(response.error);
            }
        } catch (error: any) {
            alert(error.message);
        }
    };
    // 현장 예매자 일괄 승인/삭제 처리
    const handleGroupApproveClick = async (isApprove: boolean) => {
        const request: OnsiteApprovalRequest = {
            userIds: checkedItems, // 단일 사용자 ID를 배열로 전달
            scheduleId: Number(selectedSession), // 예시로 사용되는 공연 일정 ID
            check: isApprove, // 승인 여부
        };

        try {
            const result = await handleApproveClick(request); // 결과 저장

            setIsManaging(false);
            setCheckedItems([]);
            toggleExpand();
            triggerRefresh();

        } catch (error: any) {
            console.error("Error during group approval:", error.message);
        }
    }

    const [isExpanded, setIsExpanded] = useState(false);
    const [isManaging, setIsManaging] = useState(false);
    const [checkedItems, setCheckedItems] = useState<number[]>([]);
    const toggleExpand = () => setIsExpanded(!isExpanded);
    const handleManageClick = () => {
        setIsManaging(!isManaging); // 상태 토글
        toggleExpand();
    };
    // 체크 박스 클릭 시 토글 기능 처리
    const handleCheckClick = (id: number) => {
        setCheckedItems((prev) => {
            // 해당 ID가 이미 있는지 확인
            const isAlreadyChecked = prev.includes(id);

            if (isAlreadyChecked) {
                // 이미 체크된 경우: 제거
                const updatedItems = prev.filter((item) => item !== id);
                console.log("Updated checkedItems after removing:", updatedItems);
                return updatedItems;
            } else {
                // 체크되지 않은 경우: 추가
                const updatedItems = [...prev, id];
                console.log("Updated checkedItems after adding:", updatedItems);
                return updatedItems;
            }
        });
    };

    // Navigation 중앙, 우측부 처리
    const center = { text: "현장 예매 관리", }
    const [righter, setRighter] = useState({ text: "선택", clickFunc: handleManageClick });
    useEffect(() => {
        isManaging ? setRighter({ text: "취소", clickFunc: handleManageClick }) : setRighter({ text: "선택", clickFunc: handleManageClick });
    }, [isManaging]);

    // 유저 리스트 데이터 필터 정의
    const filteredData = data
        .filter(item => {
            // 상태 필터링
            if (filter === '전체') return true; // 전체일 경우 필터링 없이 다 보여줌
            return item.approve === (filter === '수락 완료'); // '수락 완료'일 경우 true, 미 수락일 경우 false
        })
        .filter(item => {
            // 검색 필터링 (이름 또는 전화번호)
            const lowerCaseSearch = search.toLowerCase();
            return item.user.name?.toLowerCase().includes(lowerCaseSearch) || item.user.phone_number?.includes(lowerCaseSearch);
        })
        .sort((a, b) => {
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
    const handleFilterClick = (newFilter) => setFilter(newFilter);

    // 전체 데이터에서 발권 완료 및 미발권 건수 계산
    const totalCount = data.length;
    const acceptCount = data.filter(item => item.approve === true).length;
    const unacceptCount = data.filter(item => item.approve === false).length;

    return (
        <ViewContainer>
            <TopNav lefter={null} center={center} righter={righter} isUnderlined={true} />

            <PlaySessionPicker
                schedules={schedules}
                selectedSession={selectedSession}
                onContentChange={handleSessionChange}
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
                    onBtnClick={undefined}
                    isOnsite={true}
                    canControll={true}
                    isExpanded={isExpanded}
                    checkedItems={checkedItems}
                    onApprovalRequest={handleApproveClick}
                    onCheckClick={handleCheckClick}
                />
            </ListContainer>


            <FooterNav isGroupAllow={isManaging} groupAllowCnt={checkedItems.length} isApproveClick={() => handleGroupApproveClick(true)} isDeleteClick={() => handleGroupApproveClick(false)} />
        </ViewContainer >
    );
};

export default OnsiteManage;

const ViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

`;

const ListContainer = styled.div`
animation: ${fadeIn} 0.3s ease-in-out;
`;