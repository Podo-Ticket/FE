import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';

import TopNav from '../../components/nav/TopNav';
import PlaySessionPicker from '../../components/nav/PlaySessionPicker';
import NoticeModal from '../../components/modal/NoticeModal';
import SingleManagelBtn from '../../components/button/SmallBtn';
import MultipleManagelBtn from '../../components/button/SmallBtn';

import backIcon from '../../assets/images/admin/grey_left_arrow.png'
import refreshIcon from '../../assets/images/refresh2_icon.png'

import { Schedule, fetchSchedules } from '../../api/admin/ManageLockingSeatsApi';

/* 각 극장에 맞는 SeatMap component로 설정 필요 */
import AdminSeatMap from '../../components/button/SeatMap/AdminSeatMap_Riveract';


// import AdminSeatMap from '../../components/button/SeatMap/AdminSeatMap_Kwangwoon';

const ManageLockingSeats = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);

    // Top navigation 요소 정의
    const navItem = {
        icon: backIcon,
        text: "좌석 잠금",
        clickFunc: () => { navigate(-1); }
    }

    const righter = {
        icon: refreshIcon,
        clickFunc: () => { }
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

    const manage = params.get("manage"); // "lock" 또는 "unlock"
    const [showEntryModal, setShowEntryModal] = useState<boolean>(true);
    const entryModalTitle = manage === "lock" ? "잠글 좌석을 선택해주세요" : "잠금 해제할 좌석을 선택해주세요";
    const entryModalSubtitle = manage === "lock" ? "좌석을 잠그면 발권이 불가합니다" : "잠금을 해제하면 발권이 가능합니다";
    const singleButtonTitle = manage === "lock" ? "해당 회차 잠금" : "해당 회차 잠금 해제";
    const multipleButtonTitle = manage === "lock" ? "전체 회차 잠금" : "전체 회차 잠금 해제";

    // 좌석 잠금 함수
    const handleLockSeats = async (newLockedSeats: string[]) => {
        if (newLockedSeats.length === 0) {
            return;
        }

        console.log("newLockedSeats(api) : ", newLockedSeats);

        const lockedSeats = newLockedSeats.map(seat => {
            const row = seat.slice(0, 2); // 좌석 ID의 첫 두 문자를 행으로 설정
            const column = parseInt(seat.slice(2)); // 나머지 부분을 숫자로 변환하여 column으로 설정

            return { "row": row, "number": column }; // 객체 형식으로 변환
        });

        const encodedSeats = encodeURIComponent(JSON.stringify(lockedSeats));

        try {
            const response = await axios.post(`${SERVER_URL}/seat/lock`, {
                scheduleId: selectedSession,
                seats: encodedSeats, // 좌석 인코딩
            }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.data.success) {
                // 잠금된 좌석을 lockedSeats에 추가
                setNewLockedSeats((prev) => [...prev, ...selectedSeats]);
                setSelectedSeats([]); // 선택된 좌석 초기화
                window.location.reload(); // 페이지 새로 고침
            }
        } catch (error) {
            console.error("좌석 잠금 오류:", error);
            if (error.response && error.response.data.error) {
            } else {
            }
        }
    };

    // 좌석 잠금 해제 함수
    const handleUnlockSeats = async (currentLockedSeatsInfo: string[], newUnlockedSeats: string[]) => {
        if (newUnlockedSeats.length === 0) {
            return;
        }

        // currentLockedSeatsInfo에서 row와 number를 합쳐서 새로운 배열을 생성
        const createLockedSeatIdentifiers = () => {
            return currentLockedSeatsInfo.map(seatInfo => ({
                id: seatInfo.id, // ID를 저장
                identifier: `${seatInfo.row}${seatInfo.number}` // row와 number를 합친 값
            }));
        };

        // unlockedSeats와 비교하여 잠금 해제된 좌석 찾기
        const findUnlockedSeats = () => {
            const lockedSeatIdentifiers = createLockedSeatIdentifiers();

            // newUnlockedSeats와 비교하여 ID를 추출
            const matchedUnlockedSeats = lockedSeatIdentifiers.filter(lockedSeat =>
                newUnlockedSeats.includes(lockedSeat.identifier)
            ).map(lockedSeat => lockedSeat.id); // ID만 추출

            console.log("잠금 해제된 좌석 ID:", matchedUnlockedSeats);
            return matchedUnlockedSeats;
        };

        // 호출 예시
        const matchedSeats = findUnlockedSeats();

        console.log("matchedSeats:", matchedSeats);



        try {
            const response = await axios.delete(`${SERVER_URL}/seat/unlock`, {
                data: {
                    scheduleId: selectedSession,
                    seatIds: matchedSeats, // 잠금 해제할 좌석 ID
                },
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.data.success) {
                // 잠금 해제된 좌석을 lockedSeats에서 제거
                setNewLockedSeats((prev) => prev.filter(seat => !newLockedSeats.includes(seat)));
                window.location.reload(); // 페이지 새로 고침
            }
        } catch (error) {
            console.error("좌석 잠금 해제 오류:", error);
            if (error.response && error.response.data.error) {
            } else {
            }
        }
    };

    return (
        <ViewContainer>
            <TopNav lefter={navItem} center={navItem} righter={righter} isGrey={true} />

            <SelectSeatsContentContainer>

                <PlaySessionPicker
                    schedules={schedules}
                    selectedSession={selectedSession}
                    onContentChange={handleSessionChange}
                />

                <SeatMapContainer>
                    <AdminSeatMap
                        isRealTime={false}
                        scheduleId={Number(selectedSession)}
                        headCount={0}
                        disabled={false}
                        showErrorModal={false}
                    />
                </SeatMapContainer>

                <ButtonContainer>
                    <SingleManagelBtn
                        content={singleButtonTitle}
                        onClick={undefined}
                        isAvailable={true}
                        isGray={true}
                    />

                    <MultipleManagelBtn
                        content={multipleButtonTitle}
                        onClick={undefined}
                        isAvailable={true}
                    />

                </ButtonContainer>

            </SelectSeatsContentContainer>

            <NoticeModal
                showNoticeModal={showEntryModal}
                title={entryModalTitle}
                description={entryModalSubtitle}
                onAcceptFunc={() => { setShowEntryModal(false) }}
            />

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

const ButtonContainer = styled.div`
display: flex;
justify-content: center;
align-items: center;

gap: 10px;
`;