import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import {useNavigate, useLocation} from 'react-router-dom';

import TopNav from '@components/layout/headers/TopNav';
import PlaySessionPicker from '@components/layout/headers/PlaySessionPicker';
import AdminSeatInfo from '@components/common/informations/AdminSeatInfo';
import NoticeModal from '@components/common//modals/NoticeModal';
import SingleManagelBtn from '@components/common/buttons/SmallBtn';
import MultipleManagelBtn from '@components/common/buttons/SmallBtn';
import SingleAcceptModal from '@components/common/modals/DefaultModal';
import MultipleAcceptModal from '@components/common/modals/DefaultModal';
import NoticeReservedSeatModal from '@components/pages/admin/manageLockingSeats/NoticeReservedSeatModal';

import backIcon from '../../assets/images/admin/grey_left_arrow.png';
import refreshIcon from '../../assets/images/refresh2_icon.png';

import {
  Schedule,
  fetchSchedules,
  Seat,
  lockSeats,
  unlockSeats,
  LockSeatsResponses,
  checkReservedSeats,
  CheckingLockSeatsRequest,
  ReservedSeat,
} from '../../api/admin/ManageLockingSeatsApi';

import AdminSeatMap from '@components/pages/admin/seatsComponent/AdminSeatMap_SAPY_Grayhall';
// import AdminSeatMap from '@components/pages/admin/seatsComponent/AdminSeatMap_SeongbukVillageTheater';
// import AdminSeatMap from "@components/pages/admin/seatsComponent/AdminSeatMap_Riveract";
// import AdminSeatMap from '@components/pages/admin/seatsComponent/AdminSeatMap_Kwangwoon';

const ManageLockingSeats = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const [remainingSeats, setRemainingSeats] = useState<number>(0);

  // 공연 회차 선택 관리
  const [isRefreshed, setIsRefreshed] = useState<boolean>(false);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedSession, setSelectedSession] = useState<string>('');
  const handleSessionChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
    setSelectedSession(event.target.value);
  useEffect(() => {
    // 공연 회차 데이터 가져오기 처리
    const loadSchedules = async () => {
      try {
        const data = await fetchSchedules();
        setSchedules(data);

        const currentScheduleId = localStorage.getItem('currentScheduleId');

        if (currentScheduleId) {
          setSelectedSession(currentScheduleId);
        } else {
          setSelectedSession(data[0].id.toString());
        }
      } catch (error) {}
    };

    loadSchedules();
  }, []);
  useEffect(() => {
    if (!selectedSession) return;
    localStorage.setItem('currentScheduleId', selectedSession);
  }, [selectedSession]);
  const triggerRefresh = () => setIsRefreshed(prev => !prev);

  const manage = params.get('manage'); // "lock" 또는 "unlock"
  const navCenterTitle = manage === 'lock' ? '좌석 잠금' : '좌석 잠금 해제';
  const [showEntryModal, setShowEntryModal] = useState<boolean>(true);
  const entryModalTitle =
    manage === 'lock' ? '잠글 좌석을 선택해주세요' : '잠금 해제할 좌석을 선택해주세요';
  const entryModalSubtitle =
    manage === 'lock' ? '좌석을 잠그면 발권이 불가합니다' : '잠금을 해제하면 발권이 가능합니다';
  const singleButtonTitle = manage === 'lock' ? '해당 회차 잠금' : '해당 회차 잠금 해제';
  const multipleButtonTitle = manage === 'lock' ? '전체 회차 잠금' : '전체 회차 잠금 해제';

  const [showSingleAcceptModal, setShowSingleAcceptModal] = useState<boolean>(false);
  const [showMultipleAcceptModal, setShowMultipleAcceptModal] = useState<boolean>(false);
  const [showMultipleWarningAcceptModal, setShowMultipleWarningAcceptModal] =
    useState<boolean>(false);
  const singleAcceptTitle =
    manage === 'lock'
      ? '해당 회차 좌석을 잠그시겠습니까?'
      : '선택한 좌석의 해당 회차만 잠금 해제하시겠습니까?';
  const singleAcceptSubTitle = manage === 'lock' ? '좌석을 잠그면 발권이 불가합니다.' : '';
  const multipleAcceptTitle =
    manage === 'lock'
      ? '전체 회차 좌석을 잠그시겠습니까?'
      : '선택한 좌석의 전체 회차를 잠금 해제하시겠습니까?';
  const multipleAcceptSubTitle = manage === 'lock' ? '좌석을 잠그면 발권이 불가합니다.' : '';

  // Top navigation 요소 정의
  const navItem = {
    icon: backIcon,
    iconWidth: 13, // 아이콘 너비 (px 단위)
    iconHeight: 20, // 아이콘 높이 (px 단위)
    text: navCenterTitle,
    clickFunc: () => {
      navigate(-1);
    },
  };

  const righter = {
    icon: refreshIcon,
    iconWidth: 17, // 아이콘 너비 (px 단위)
    iconHeight: 17, // 아이콘 높이 (px 단위)
    clickFunc: triggerRefresh,
  };

  const [newLockedSeats, setNewLockedSeats] = useState<string[]>([]);
  const [newUnlockedSeats, setNewUnlockedSeats] = useState<string[]>([]);
  const [, setCurrentLockedSeatsInfo] = useState<{id: string; row: string; number: number}[]>([]);
  const [reservedList, setReservedList] = useState<ReservedSeat[]>([]);

  const handleLockSeats = async () => {
    if (newLockedSeats.length === 0) {
      return;
    }

    const lockedSeats: Seat[] = newLockedSeats.map(seat => {
      const row = seat.slice(0, 1);
      const column = parseInt(seat.slice(1));
      return {row, number: column};
    });

    const encodedSeats = encodeURIComponent(JSON.stringify(lockedSeats));

    try {
      const response = await lockSeats({
        scheduleId: [Number(selectedSession)],
        seats: encodedSeats,
      });

      if (response.success) {
        setNewLockedSeats([]);
        triggerRefresh();
        setShowSingleAcceptModal(false);
      } else {
      }
    } catch (error) {}
  };

  // 좌석 잠금 해제 함수
  const handleUnlockSeats = async () => {
    if (newUnlockedSeats.length === 0) {
      return;
    }

    // 좌석 데이터를 변환
    const unlockedSeats: Seat[] = newUnlockedSeats.map(seat => {
      const row = seat.slice(0, 1); // 좌석 ID의 첫 글자를 행으로 설정
      const column = parseInt(seat.slice(1)); // 나머지 부분을 숫자로 변환하여 열로 설정

      return {row, number: column}; // 객체 형식으로 변환
    });

    const encodedSeats = encodeURIComponent(JSON.stringify(unlockedSeats));

    try {
      const success = await unlockSeats({
        scheduleId: Number(selectedSession),
        seats: encodedSeats,
      });

      if (success) {
        setNewLockedSeats(prev => prev.filter(seat => !newUnlockedSeats.includes(seat)));
        triggerRefresh();
        setShowSingleAcceptModal(false);
      }
    } catch (error) {}
  };

  // 전체 회차 동시 잠금 함수
  const handleLockSeatsForAllSchedules = async () => {
    if (newLockedSeats.length === 0) {
      return;
    }

    const lockedSeats: Seat[] = newLockedSeats.map(seat => {
      const row = seat.slice(0, 1);
      const column = parseInt(seat.slice(1));

      return {row, number: column};
    });

    const encodedSeats = encodeURIComponent(JSON.stringify(lockedSeats));

    // 모든 회차에 대해 좌석 잠금 요청을 병렬로 처리
    try {
      const lockPromises = schedules.map(schedule =>
        lockSeats({scheduleId: [schedule.id], seats: encodedSeats}),
      );

      const results: LockSeatsResponses = await Promise.all(lockPromises); // 모든 요청 완료 대기

      // 성공 여부 확인
      if (results.every(res => res.success)) {
        setNewLockedSeats([]); // 상태 초기화
        triggerRefresh(); // 새로고침 트리거
        setShowMultipleAcceptModal(false); // 모달 닫기
        setShowMultipleWarningAcceptModal(false);
      } else {
      }
    } catch (error) {}
  };

  // 전체 회차 동시 잠금 해제 함수
  const handleUnlockSeatsForAllSchedules = async () => {
    if (newUnlockedSeats.length === 0) {
      return;
    }

    const unlockedSeats: Seat[] = newUnlockedSeats.map(seat => {
      const row = seat.slice(0, 1);
      const column = parseInt(seat.slice(1));

      return {row, number: column};
    });

    const encodedSeats = encodeURIComponent(JSON.stringify(unlockedSeats));

    // 모든 회차에 대해 좌석 잠금 해제 요청을 병렬로 처리
    try {
      const unlockPromises = schedules.map(schedule => {
        return unlockSeats({scheduleId: schedule.id, seats: encodedSeats});
      });

      const results = await Promise.all(unlockPromises); // 모든 요청 완료 대기

      if (results.every(res => res.success)) {
        setNewUnlockedSeats([]);
        triggerRefresh();
        setShowMultipleAcceptModal(false);
        setShowMultipleWarningAcceptModal(false);
      } else {
      }
    } catch (error) {}
  };

  // 전체 회차 잠금 시 모달 컨트롤 처리
  const handleMultipleManagelBtn = async () => {
    try {
      const lockedSeats: Seat[] = newLockedSeats.map(seat => {
        const row = seat.slice(0, 1);
        const column = parseInt(seat.slice(1));

        return {row, number: column};
      });

      const encodedSeats = encodeURIComponent(JSON.stringify(lockedSeats));
      const ids = schedules.map(schedule => schedule.id);

      const request: CheckingLockSeatsRequest = {
        scheduleId: ids, // 공연 ID
        seats: encodedSeats,
      };

      const result = await checkReservedSeats(request);

      if (result.success) {
        if (result.reservedList.length === 0) {
          setShowMultipleAcceptModal(true); // 일반 모달 표시
        } else {
          setReservedList(result.reservedList); // 예약된 좌석 목록 저장
          setShowMultipleWarningAcceptModal(true); // 경고 모달 표시
        }
      }
    } catch (error) {}
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
            manageMode={manage === 'lock' ? true : false}
            scheduleId={Number(selectedSession)}
            disabled={false}
            onLockedSeatsChange={setNewLockedSeats}
            onUnlockedSeatsChange={setNewUnlockedSeats}
            onCurrentLockedSeatsInfoChange={setCurrentLockedSeatsInfo}
            setRemainingSeats={setRemainingSeats}
          />

          <AdminSeatInfo isRealTime={false} remainingSeatsCount={remainingSeats} />
        </SeatMapContainer>

        <ButtonContainer>
          <SingleManagelBtn
            content={singleButtonTitle}
            onClick={() => {
              setShowSingleAcceptModal(true);
            }}
            isAvailable={
              manage === 'lock' ? newLockedSeats.length !== 0 : newUnlockedSeats.length !== 0
            }
            isGray={true}
          />

          <MultipleManagelBtn
            content={multipleButtonTitle}
            onClick={
              manage === 'lock'
                ? handleMultipleManagelBtn
                : () => {
                    setShowMultipleAcceptModal(true);
                  }
            }
            isAvailable={
              manage === 'lock' ? newLockedSeats.length !== 0 : newUnlockedSeats.length !== 0
            }
          />
        </ButtonContainer>
      </SelectSeatsContentContainer>

      <NoticeModal
        showNoticeModal={showEntryModal}
        title={entryModalTitle}
        description={entryModalSubtitle}
        buttonContent='확인'
        onAcceptFunc={() => {
          setShowEntryModal(false);
        }}
      />

      <SingleAcceptModal
        showDefaultModal={showSingleAcceptModal}
        title={singleAcceptTitle}
        description={singleAcceptSubTitle}
        onAcceptFunc={manage === 'lock' ? handleLockSeats : handleUnlockSeats}
        onUnacceptFunc={() => {
          setShowSingleAcceptModal(false);
        }}
      />

      <MultipleAcceptModal
        showDefaultModal={showMultipleAcceptModal}
        title={multipleAcceptTitle}
        description={multipleAcceptSubTitle}
        onAcceptFunc={
          manage === 'lock' ? handleLockSeatsForAllSchedules : handleUnlockSeatsForAllSchedules
        }
        onUnacceptFunc={() => {
          setShowMultipleAcceptModal(false);
        }}
      />

      <NoticeReservedSeatModal
        showNoticeReservedSeatModal={showMultipleWarningAcceptModal}
        reservedList={reservedList}
        onAcceptFunc={handleLockSeatsForAllSchedules}
        onUnacceptFunc={() => {
          setShowMultipleWarningAcceptModal(false);
        }}
      />
    </ViewContainer>
  );
};

export default ManageLockingSeats;

const ViewContainer = styled.div`
  display: flex;
  flex-direction: column;

  height: 100svh;
  width: 100vw;
  padding-top: 0.6svh;

  background: var(--background-1);
`;

const SelectSeatsContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 87.3%;
  padding: 0 20px;
`;

const SeatMapContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 72%;

  margin-bottom: 2.7%;
  margin-top: 2.2%;
  border-radius: 10px;
  border: 1px solid var(--grey-3);
  background: var(--ect-white);
  box-shadow: 0px 0px 5px 3px rgba(0, 0, 0, 0.02);
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  gap: 2.54vw;
  width: 100%;
`;
