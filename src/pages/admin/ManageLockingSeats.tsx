import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';

import TopNav from '../../components/nav/TopNav';
import PlaySessionPicker from '../../components/nav/PlaySessionPicker';

import backIcon from '../../assets/images/admin/grey_left_arrow.png'

import { Schedule, fetchSchedules } from '../../api/admin/ManageLockingSeatsApi';

/* 각 극장에 맞는 SeatMap component로 설정 필요 */
import RiveractAdminSeatMap from '../../components/button/SeatMap/AdminSeatMap_Riveract';
// import KwangwoonSeatMap from '../../components/button/SeatMap/AdminSeatMap_Kwangwoon';

const ManageLockingSeats = () => {
    const navigate = useNavigate();

    // Top navigation 요소 정의
    const navItem = {
        icon: backIcon,
        width: 1,
        height: 1,
        text: "좌석 잠금",
        clickFunc: () => { navigate(-1); }
    }

    // 공연 회차 선택 관리
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
    useEffect(() => {
        if (!selectedSession) return;
        localStorage.setItem("currentScheduleId", selectedSession);
    }, [selectedSession]);

    const [selectedSeats, setSelectedSeats] = useState([]);
    const [newLockedSeats, setNewLockedSeats] = useState([]);
    const [newUnlockedSeats, setNewUnlockedSeats] = useState([]);

    return (
        <ViewContainer>
            <TopNav lefter={navItem} center={navItem} righter={null} />

            <SelectSeatsContentContainer>

                <PlaySessionPicker
                    schedules={schedules}
                    selectedSession={selectedSession}
                    onContentChange={handleSessionChange}
                />

                <SeatMapContainer>
                    <RiveractAdminSeatMap
                        isRealTime={false}
                        scheduleId={5}
                        headCount={0}
                        disabled={false}
                        currentSelectedSeats={selectedSeats}
                        setCurrentSelectedSeats={setSelectedSeats}
                        newLockedSeats={newLockedSeats}
                        newUnlockedSeats={newUnlockedSeats}
                        showErrorModal={false}
                    />
                </SeatMapContainer>

            </SelectSeatsContentContainer>

        </ViewContainer >
    );
};

export default ManageLockingSeats;

const ViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

`;

const SelectSeatsContentContainer = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;

background: var(--background-1);

gap: 15px;
padding: 0 20px;
`;

const SeatMapContainer = styled.div`
display: flex;
justify-content: center;
align-items: center;

width: 100%;
height: 73vh;

border-radius: 10px;
border: 1px solid var(--grey-3);
background: var(--ect-white);
box-shadow: 0px 0px 5px 3px rgba(0, 0, 0, 0.02);

`;