import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';

import TopNav from '../../components/nav/TopNav';
import PlaySessionPicker from '../../components/nav/PlaySessionPicker';
import NoticeModal from '../../components/modal/NoticeModal';
import SingleManagelBtn from '../../components/button/SmallBtn';
import MultipleManagelBtn from '../../components/button/SmallBtn';
import SingleAcceptModal from '../../components/modal/DefaultModal';
import MultipleAcceptModal from '../../components/modal/DefaultModal';

import backIcon from '../../assets/images/admin/grey_left_arrow.png'
import refreshIcon from '../../assets/images/refresh2_icon.png'

import { Schedule, fetchSchedules, Seat, lockSeats, unlockSeats } from '../../api/admin/ManageLockingSeatsApi';

/* 각 극장에 맞는 SeatMap component로 설정 필요 */
import AdminSeatMap from '../../components/button/SeatMap/AdminSeatMap_Riveract';
// import AdminSeatMap from '../../components/button/SeatMap/AdminSeatMap_Kwangwoon';

const ManageLockingSeats = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);

    // 공연 회차 선택 관리
    const [isRefreshed, setIsRefreshed] = useState<boolean>(false);     // 새로고침 트리거 state
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
    const triggerRefresh = () => setIsRefreshed((prev) => !prev);

    const manage = params.get("manage"); // "lock" 또는 "unlock"
    const navCenterTitle = manage === "lock" ? "좌석 잠금" : "좌석 잠금 해제";
    const [showEntryModal, setShowEntryModal] = useState<boolean>(true);
    const entryModalTitle = manage === "lock" ? "잠글 좌석을 선택해주세요" : "잠금 해제할 좌석을 선택해주세요";
    const entryModalSubtitle = manage === "lock" ? "좌석을 잠그면 발권이 불가합니다" : "잠금을 해제하면 발권이 가능합니다";
    const singleButtonTitle = manage === "lock" ? "해당 회차 잠금" : "해당 회차 잠금 해제";
    const multipleButtonTitle = manage === "lock" ? "전체 회차 잠금" : "전체 회차 잠금 해제";

    const [showSingleAcceptModal, setShowSingleAcceptModal] = useState<boolean>(false);
    const [showMultipleAcceptModal, setShowMultipleAcceptModal] = useState<boolean>(false);
    const singleAcceptTitle = manage === "lock" ? "해당 회차 좌석을 잠그시겠습니까?" : "선택한 좌석의 해당 회차만 잠금 해제하시겠습니까?";
    const singleAcceptSubTitle = manage === "lock" ? "좌석을 잠그면 발권이 불가합니다." : "";
    const multipleAcceptTitle = manage === "lock" ? "전체 회차 좌석을 잠그시겠습니까?" : "선택한 좌석의 전체 회차를 잠금 해제하시겠습니까?";
    const multipleAcceptSubTitle = manage === "lock" ? "좌석을 잠그면 발권이 불가합니다." : "";

    // Top navigation 요소 정의
    const navItem = {
        icon: backIcon,
        text: navCenterTitle,
        clickFunc: () => { navigate(-1); }
    }

    const righter = {
        icon: refreshIcon,
        clickFunc: triggerRefresh
    }

    const [newLockedSeats, setNewLockedSeats] = useState<string[]>([]);
    const [newUnlockedSeats, setNewUnlockedSeats] = useState<string[]>([]);
    const [currentLockedSeatsInfo, setCurrentLockedSeatsInfo] = useState<{ id: string; row: string; number: number }[]>([]);

    useEffect(() => {
        console.log("newLockedSeats : ", newLockedSeats);
        //console.log("newUnlockedSeats : ", newUnlockedSeats);
        //console.log("lockedSeatsInfo : ", lockedSeatsInfo);
    }, [newLockedSeats]);

    useEffect(() => {
        //console.log("newLockedSeats : ", newLockedSeats);
        console.log("newUnlockedSeats : ", newUnlockedSeats);
        //console.log("lockedSeatsInfo : ", lockedSeatsInfo);
    }, [newUnlockedSeats]);

    useEffect(() => {
        //console.log("newLockedSeats : ", newLockedSeats);
        //console.log("newUnlockedSeats : ", newUnlockedSeats);
        console.log("currentLockedSeatsInfo : ", currentLockedSeatsInfo);
    }, [currentLockedSeatsInfo]);

    // 좌석 잠금 함수
    const handleLockSeats = async () => {
        if (newLockedSeats.length === 0) {
            return;
        }

        console.log("newLockedSeats(api):", newLockedSeats);

        // 좌석 데이터를 변환
        const lockedSeats: Seat[] = newLockedSeats.map((seat) => {
            const row = seat.slice(0, 1); // 좌석 ID의 첫 글자를 행으로 설정
            const column = parseInt(seat.slice(1)); // 나머지 부분을 숫자로 변환하여 열로 설정

            return { row, number: column }; // 객체 형식으로 변환
        });

        console.log("newLockedSeats(api)_converted:", lockedSeats);

        const encodedSeats = encodeURIComponent(JSON.stringify(lockedSeats));

        try {
            const success = await lockSeats({ scheduleId: Number(selectedSession), seats: encodedSeats });
            if (success) {
                setNewLockedSeats([]);
                triggerRefresh();
                setShowSingleAcceptModal(false)
            }
        } catch (error) {
            console.error("좌석 잠금 오류:", error);
        }
    };

    // 좌석 잠금 해제 함수
    const handleUnlockSeats = async () => {
        if (newUnlockedSeats.length === 0) {
            return;
        }

        // currentLockedSeatsInfo에서 row와 number를 합쳐서 새로운 배열 생성
        const createLockedSeatIdentifiers = () => {
            return currentLockedSeatsInfo.map((seatInfo) => ({
                id: seatInfo.id,
                identifier: `${seatInfo.row}${seatInfo.number}`, // row와 number를 합친 값
            }));
        };

        // unlockedSeats와 비교하여 잠금 해제된 좌석 찾기
        const findUnlockedSeatIds = () => {
            const lockedSeatIdentifiers = createLockedSeatIdentifiers();

            // newUnlockedSeats와 비교하여 ID를 추출
            return lockedSeatIdentifiers
                .filter((lockedSeat) => newUnlockedSeats.includes(lockedSeat.identifier))
                .map((lockedSeat) => lockedSeat.id); // ID만 추출
        };

        const matchedSeatIds = findUnlockedSeatIds();

        try {
            const success = await unlockSeats({
                scheduleId: Number(selectedSession),
                seatIds: matchedSeatIds,
            });

            if (success) {
                setNewLockedSeats((prev) =>
                    prev.filter((seat) => !newUnlockedSeats.includes(seat))
                );
                triggerRefresh();
                setShowSingleAcceptModal(false)
            }
        } catch (error) {
            console.error("좌석 잠금 해제 오류:", error);
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
                        isRefreshed={isRefreshed}
                        isRealTime={false}
                        manageMode={manage === "lock" ? true : false}

                        scheduleId={Number(selectedSession)}
                        disabled={false}

                        onLockedSeatsChange={setNewLockedSeats}
                        onUnlockedSeatsChange={setNewUnlockedSeats}
                        onCurrentLockedSeatsInfoChange={setCurrentLockedSeatsInfo}
                    />
                </SeatMapContainer>

                <ButtonContainer>
                    <SingleManagelBtn
                        content={singleButtonTitle}
                        onClick={() => { setShowSingleAcceptModal(true) }}
                        isAvailable={manage === "lock" ? newLockedSeats.length !== 0 : newUnlockedSeats.length !== 0}
                        isGray={true}
                    />

                    <MultipleManagelBtn
                        content={multipleButtonTitle}
                        onClick={() => { setShowMultipleAcceptModal(true) }}
                        isAvailable={manage === "lock" ? newLockedSeats.length !== 0 : newUnlockedSeats.length !== 0}
                    />
                </ButtonContainer>

            </SelectSeatsContentContainer>

            <NoticeModal
                showNoticeModal={showEntryModal}
                title={entryModalTitle}
                description={entryModalSubtitle}
                onAcceptFunc={() => { setShowEntryModal(false) }}
            />

            <SingleAcceptModal
                showDefaultModal={showSingleAcceptModal}
                title={singleAcceptTitle}
                description={singleAcceptSubTitle}
                onAcceptFunc={manage === "lock" ? handleLockSeats : handleUnlockSeats}
                onUnacceptFunc={() => { setShowSingleAcceptModal(false) }}
            />

            <MultipleAcceptModal
                showDefaultModal={showMultipleAcceptModal}
                title={multipleAcceptTitle}
                description={multipleAcceptSubTitle}
                onAcceptFunc={null}
                onUnacceptFunc={() => { setShowMultipleAcceptModal(false) }}
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