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

import { Schedule, fetchSchedules, Seat, lockSeats, unlockSeats, LockSeatsResponses, checkReservedSeats, CheckingLockSeatsRequest, ReservedSeat } from '../../api/admin/ManageLockingSeatsApi';

/* 각 극장에 맞는 SeatMap component로 설정 필요 */
import AdminSeatMap from '../../components/button/SeatMap/AdminSeatMap_Riveract';
import NoticeReservedSeatModal from '../../components/modal/NoticeReservedSeatModal';
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
    const [showMultipleWarningAcceptModal, setShowMultipleWarningAcceptModal] = useState<boolean>(false);
    const singleAcceptTitle = manage === "lock" ? "해당 회차 좌석을 잠그시겠습니까?" : "선택한 좌석의 해당 회차만 잠금 해제하시겠습니까?";
    const singleAcceptSubTitle = manage === "lock" ? "좌석을 잠그면 발권이 불가합니다." : "";
    const multipleAcceptTitle = manage === "lock" ? "전체 회차 좌석을 잠그시겠습니까?" : "선택한 좌석의 전체 회차를 잠금 해제하시겠습니까?";
    const multipleAcceptSubTitle = manage === "lock" ? "좌석을 잠그면 발권이 불가합니다." : "";

    // Top navigation 요소 정의
    const navItem = {
        icon: backIcon,
        iconWidth: 9, // 아이콘 너비 (px 단위)
        iconHeight: 16, // 아이콘 높이 (px 단위)
        text: navCenterTitle,
        clickFunc: () => { navigate(-1); }
    }

    const righter = {
        icon: refreshIcon,
        iconWidth: 17, // 아이콘 너비 (px 단위)
        iconHeight: 17, // 아이콘 높이 (px 단위)
        clickFunc: triggerRefresh
    }

    const [newLockedSeats, setNewLockedSeats] = useState<string[]>([]);
    const [newUnlockedSeats, setNewUnlockedSeats] = useState<string[]>([]);
    const [currentLockedSeatsInfo, setCurrentLockedSeatsInfo] = useState<{ id: string; row: string; number: number }[]>([]);
    const [reservedList, setReservedList] = useState<ReservedSeat[]>([]);

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

        // 좌석 데이터를 변환
        const lockedSeats: Seat[] = newLockedSeats.map((seat) => {
            const row = seat.slice(0, 1); // 좌석 ID의 첫 글자를 행으로 설정
            const column = parseInt(seat.slice(1)); // 나머지 부분을 숫자로 변환하여 열로 설정

            return { row, number: column }; // 객체 형식으로 변환
        });

        const encodedSeats = encodeURIComponent(JSON.stringify(lockedSeats));

        try {
            // 좌석 잠금 API 호출
            const response = await lockSeats({
                scheduleId: [Number(selectedSession)],
                seats: encodedSeats,
            });

            // 응답 처리
            if (response.success) {
                console.log("좌석 잠금 성공");

                setNewLockedSeats([]); // 상태 초기화
                triggerRefresh(); // 새로고침 트리거
                setShowSingleAcceptModal(false); // 모달 닫기
            } else {
                console.error("좌석 잠금 실패");
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

        // 좌석 데이터를 변환
        const unlockedSeats: Seat[] = newUnlockedSeats.map((seat) => {
            const row = seat.slice(0, 1); // 좌석 ID의 첫 글자를 행으로 설정
            const column = parseInt(seat.slice(1)); // 나머지 부분을 숫자로 변환하여 열로 설정

            return { row, number: column }; // 객체 형식으로 변환
        });

        const encodedSeats = encodeURIComponent(JSON.stringify(unlockedSeats));

        try {
            const success = await unlockSeats({
                scheduleId: Number(selectedSession),
                seats: encodedSeats,
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

    // 전체 회차 동시 잠금 함수
    const handleLockSeatsForAllSchedules = async () => {
        if (newLockedSeats.length === 0) {
            return;
        }

        // 좌석 데이터를 변환
        const lockedSeats: Seat[] = newLockedSeats.map((seat) => {
            const row = seat.slice(0, 1); // 좌석 ID의 첫 글자를 행으로 설정
            const column = parseInt(seat.slice(1)); // 나머지 부분을 숫자로 변환하여 열로 설정

            return { row, number: column }; // 객체 형식으로 변환
        });

        const encodedSeats = encodeURIComponent(JSON.stringify(lockedSeats));

        try {
            // 모든 회차에 대해 좌석 잠금 요청을 병렬로 처리
            const lockPromises = schedules.map((schedule) =>
                lockSeats({ scheduleId: [schedule.id], seats: encodedSeats })
            );

            const results: LockSeatsResponses = await Promise.all(lockPromises); // 모든 요청 완료 대기

            console.log("전체 응답 확인: ", results);
            // 각 요청의 결과를 순회하며 로그 출력
            results.forEach((result, index) => {
                console.log(`Schedule ID: ${schedules[index].id}`);
                console.log("Response:", result);

                if (result.success) {
                    if (!result.reservedList) {
                        console.log("예약된 좌석이 없습니다.");
                    } else {
                        console.log("이미 예약된 좌석 목록:", result.reservedList);
                    }
                } else {
                    console.error("좌석 잠금 실패");
                }
            });

            // 성공 여부 확인
            if (results.every((res) => res.success)) {
                console.log("전체 회차 좌석 잠금 성공");
                setNewLockedSeats([]); // 상태 초기화
                triggerRefresh(); // 새로고침 트리거
                setShowMultipleAcceptModal(false); // 모달 닫기
                setShowMultipleWarningAcceptModal(false);
            } else {
                console.error("일부 회차에서 좌석 잠금 실패");
            }
        } catch (error) {
            console.error("전체 회차 좌석 잠금 오류:", error);
        }
    };

    // 전체 회차 동시 잠금 해제 함수
    const handleUnlockSeatsForAllSchedules = async () => {
        if (newUnlockedSeats.length === 0) {
            return;
        }

        // 좌석 데이터를 변환
        const unlockedSeats: Seat[] = newUnlockedSeats.map((seat) => {
            const row = seat.slice(0, 1); // 좌석 ID의 첫 글자를 행으로 설정
            const column = parseInt(seat.slice(1)); // 나머지 부분을 숫자로 변환하여 열로 설정

            return { row, number: column }; // 객체 형식으로 변환
        });

        const encodedSeats = encodeURIComponent(JSON.stringify(unlockedSeats));

        try {
            // 모든 회차에 대해 좌석 잠금 해제 요청을 병렬로 처리
            const unlockPromises = schedules.map((schedule) => {
                console.log("current seatIds: ", schedule.id); // 디버그용 로그
                return unlockSeats({ scheduleId: schedule.id, seats: encodedSeats });
            });

            const results = await Promise.all(unlockPromises); // 모든 요청 완료 대기

            console.log("results: ", results);

            // 성공 여부 확인
            if (results.every((res) => res.success)) {
                console.log("전체 회차 좌석 잠금 해제 성공");
                setNewUnlockedSeats([]); // 상태 초기화
                triggerRefresh(); // 새로고침 트리거
                setShowMultipleAcceptModal(false); // 모달 닫기
                setShowMultipleWarningAcceptModal(false);
            } else {
                console.error("일부 회차에서 좌석 잠금 해제 실패");
            }
        } catch (error) {
            console.error("전체 회차 좌석 잠금 해제 오류:", error);
        }
    };

    // 전체 회차 잠금 시 모달 컨트롤 처리
    const handleMultipleManagelBtn = async () => {
        try {
            // 좌석 데이터를 변환
            const lockedSeats: Seat[] = newLockedSeats.map((seat) => {
                const row = seat.slice(0, 1); // 좌석 ID의 첫 글자를 행으로 설정
                const column = parseInt(seat.slice(1)); // 나머지 부분을 숫자로 변환하여 열로 설정

                return { row, number: column }; // 객체 형식으로 변환
            });

            const encodedSeats = encodeURIComponent(JSON.stringify(lockedSeats));

            console.log("selectedSession: ", selectedSession);
            console.log("encodedSeats: ", encodedSeats);

            const ids = schedules.map((schedule) => schedule.id);

            const request: CheckingLockSeatsRequest = {
                scheduleId: ids, // 공연 ID
                seats: encodedSeats,
            };

            const result = await checkReservedSeats(request);
            console.log("예약된 좌석 확인 결과:", result);

            if (result.success) {
                if (result.reservedList.length === 0) {
                    console.log("예약된 좌석이 없습니다.");
                    setShowMultipleAcceptModal(true); // 일반 모달 표시
                }
                else {
                    console.log("이미 예약된 좌석 목록:", result.reservedList);
                    setReservedList(result.reservedList); // 예약된 좌석 목록 저장
                    setShowMultipleWarningAcceptModal(true); // 경고 모달 표시
                }
            }

        } catch (error) {
            console.error("좌석 확인 중 오류 발생:", error);
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
                    isRounded={true}
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
                        onClick={manage === "lock" ? handleMultipleManagelBtn : () => { setShowMultipleAcceptModal(true) }}
                        isAvailable={manage === "lock" ? newLockedSeats.length !== 0 : newUnlockedSeats.length !== 0}
                    />
                </ButtonContainer>

            </SelectSeatsContentContainer>

            <NoticeModal
                showNoticeModal={showEntryModal}
                title={entryModalTitle}
                description={entryModalSubtitle}
                buttonContent="확인"
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
                onAcceptFunc={manage === "lock" ? handleLockSeatsForAllSchedules : handleUnlockSeatsForAllSchedules}
                onUnacceptFunc={() => { setShowMultipleAcceptModal(false) }}
            />

            <NoticeReservedSeatModal
                showNoticeReservedSeatModal={showMultipleWarningAcceptModal}
                reservedList={reservedList}
                onAcceptFunc={handleLockSeatsForAllSchedules}
                onUnacceptFunc={() => { setShowMultipleWarningAcceptModal(false) }}
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
height: 65vh;

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