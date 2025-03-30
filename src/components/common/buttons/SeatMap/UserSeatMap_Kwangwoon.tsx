import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';

import SingleSeat from '../SingleSeat';

import stage from '../../../assets/images/stage.png'
import {
  SAEBIT_LARGE_LECTURE_ROOM_LEFTSIDE as RowsLeft,
  SAEBIT_LARGE_LECTURE_ROOM_RIGHTSIDE as RowsRight
} from "../../../constants/venue/KwangwoonUniv";

import { fetchSeats } from '../../../api/user/SelectSeatsApi';

interface SeatMapProps {
  isRealTime: boolean; // 실시간 모드 여부
  scheduleId: number | null; // 스케줄 ID
  headCount: number; // 선택 가능한 좌석 수 제한
  currentSelectedSeats: string[]; // 선택된 좌석 배열
  setCurrentSelectedSeats: React.Dispatch<React.SetStateAction<string[]>>; // 선택된 좌석 업데이트 함수
  showErrorModal: React.Dispatch<React.SetStateAction<boolean>>; // 이미 선택된 좌석 경고 모달 상태 업데이트 함수
  disabled: boolean; // 좌석 선택 비활성화 여부
  onSeatClick?: (seatId: string) => void; // 좌석 클릭 핸들러 (옵션)
  bookingInfo?: { seats: { row: string; number: number }[] }; // 예약 정보 (옵션)
  onSeatEdit?: boolean; // 좌석 수정 모드 여부 (옵션)
  newLockedSeats: string[]; // 새로 잠긴 좌석 배열
  setNewLockedSeats: React.Dispatch<React.SetStateAction<string[]>>; // 새로 잠긴 좌석 상태 업데이트 함수
  newUnlockedSeats: string[]; // 새로 잠금 해제된 좌석 배열
  setNewUnlockedSeats: React.Dispatch<React.SetStateAction<string[]>>; // 새로 잠금 해제된 좌석 상태 업데이트 함수
  setCurrentLockedSeatsInfo: React.Dispatch<React.SetStateAction<any>>; // 현재 잠긴 좌석 정보 업데이트 함수
  setIsLockAvailable: React.Dispatch<React.SetStateAction<boolean>>; // 잠금 가능 여부 업데이트 함수
  setIsUnlockAvailable: React.Dispatch<React.SetStateAction<boolean>>; // 잠금 해제 가능 여부 업데이트 함수
}

const SeatMap: React.FC<SeatMapProps> = ({ currentSelectedSeats, setCurrentSelectedSeats,

  showErrorModal,
  disabled, scheduleId, headCount, isRealTime, bookingInfo, onSeatEdit
  , newLockedSeats, setNewLockedSeats, newUnlockedSeats, setNewUnlockedSeats, setCurrentLockedSeatsInfo
  , setIsLockAvailable, setIsUnlockAvailable }) => {

  const seatMapRef = useRef(null);
  const [lockedSeatsInfo, setLockedSeatsInfo] = useState<any>([]);
  const [bookedSeatsInfo, setbookedSeatsInfo] = useState<any>([]);

  const [unclickableSeats, setUnclickableSeats] = useState<string[]>([]);
  const [reservedSeats, setReservedSeats] = useState<string[]>([]);
  const [temporarySelectedSeats, setTemporarySelectedSeats] = useState<string[]>([]); // 일시적으로 선택된 좌석
  const [lockedSeats, setLockedSeats] = useState<string[]>([]); // 잠금된 좌석 배열 추가


  // 좌석 정보 가져오기
  const loadSeatMapSeats = async (isRealTime: boolean) => {
    if (!scheduleId) {
      console.error("scheduleId가 없습니다.");
      return;
    }

    try {
      // const endpoint = isRealTime ? `${SERVER_URL}/seat/realTime` : `${SERVER_URL}/seat`;
      const data = await fetchSeats(0 | Number(localStorage.getItem("scheduleId")));

      // 선택 불가 좌석 배열 생성
      const unclickable = data.seats.map((seat: { row: string; number: number; }) => `${seat.row}${seat.number}`);
      console.log("unclickable: ", unclickable);

      // 예매된 좌석 Id 배열 생성
      const reserved = data.seats
        .filter((seat: { lock: boolean; }) => seat.lock === false) // (lock == false) === 예매된 좌석
        .map((seat: { row: string; number: number; }) => `${seat.row}${seat.number}`);

      // 잠금된 좌석 Id 배열 생성
      const locked = data.seats
        .filter((seat: { lock: boolean; }) => seat.lock == true) // (lock == true) === 잠금된 좌석
        .map((seat: { row: string; number: number; }) => `${seat.row}${seat.number}`);

      const bookedSeatInfo = data.seats.filter((seat: { lock: boolean; }) => seat.lock === false);
      const lockedSeatInfo = data.seats.filter((seat: { lock: boolean; }) => seat.lock === true);

      setUnclickableSeats(unclickable); // 선택 불가 좌석
      setReservedSeats(reserved); // 예매된 좌석
      setLockedSeats(locked); // 잠금된 좌석

      setbookedSeatsInfo(bookedSeatInfo);
      setLockedSeatsInfo(lockedSeatInfo);

      // 로그를 한 번만 출력하도록 조건 추가
      if (isRealTime) {
        console.log("예약된 좌석 (실시간):", reservedSeats);
        console.log("블락된 좌석 (실시간):", lockedSeats);
        console.log("예약+블락된 좌석 (실시간):", unclickableSeats);
      } else {
        console.log("예약+블락된 좌석:", unclickableSeats);
        console.log("예약된 좌석:", reservedSeats);
        console.log("블락된 좌석:", lockedSeats);
      }
    } catch (error) {
      console.error("Error fetching seats:", error);
    }
  };

  // 일반 좌석 정보 가져오기
  useEffect(() => {
    if (!isRealTime) {
      loadSeatMapSeats(false); // 일반 좌석 정보 가져오기
    }
  }, [scheduleId, isRealTime]);

  // 실시간 좌석 정보 가져오기 (지연 실행으로 null값 피하기)
  useEffect(() => {
    if (isRealTime) {
      const timer = setTimeout(() => {
        loadSeatMapSeats(true); // 실시간 좌석 정보 가져오기
      }, 100); // 100ms의 지연 후 실행
      return () => clearTimeout(timer); // cleanup
    }
  }, [isRealTime, scheduleId]); // scheduleId와 isRealTime이 변경될 때마다 실행

  useEffect(() => {
    if (!bookingInfo) {
      setTemporarySelectedSeats([]);
    }
  }, [bookingInfo]);

  // bookingInfo에서 userSeats를 가져와서 temporarySelectedSeats에 추가
  useEffect(() => {
    if (bookingInfo) {
      const userSeats = bookingInfo.seats.map(seat => `${seat.row}${seat.number}`);
      setTemporarySelectedSeats(userSeats); // userSeats를 일시적으로 선택된 좌석으로 설정
    }
  }, [bookingInfo]);

  // temporarySelectedSeats 값이 변경될 때 로그 출력
  useEffect(() => {
    console.log("temporarySelectedSeats:", temporarySelectedSeats);
  }, [temporarySelectedSeats]);

  const handleSeatClick = (seatId: string) => {
    if (disabled) return;

    // 좌석 클릭 시 예매 정보 API 호출
    if (isRealTime) {

      if (onSeatEdit) {
        // newLockedSeats가 빈 배열인 경우에도 처리
        if (!newLockedSeats || newLockedSeats.length === 0) {
          setNewLockedSeats([seatId]); // 새로 선택한 좌석을 추가
          setNewUnlockedSeats([seatId]); // 새로 선택한 좌석을 unlocked에 추가

          // 좌석 상태에 따라 lock/unlock 가능 상태 설정
          if (lockedSeats.includes(seatId)) {
            setIsUnlockAvailable(true); // 최초 선택한 좌석이 lockedSeats에 속하면 unlock 가능
            setIsLockAvailable(false);
          } else {
            setIsLockAvailable(true); // 최초 선택한 좌석이 lockedSeats에 속하지 않으면 lock 가능
            setIsUnlockAvailable(false);
          }
        } else {
          const firstLockedSeat = newLockedSeats[0];
          console.log("newLockedSeats[0] : ", firstLockedSeat);

          // 같은 좌석을 두 번 클릭한 경우
          if (newLockedSeats.includes(seatId)) {
            // lockedSeats에서 제거
            if (newLockedSeats.length === 1) {
              // 원소가 1개일 경우 배열 초기화
              setNewLockedSeats([]);
              setNewUnlockedSeats([]);
              setIsLockAvailable(false);
              setIsUnlockAvailable(false);
            } else {
              setNewLockedSeats(prev => prev.filter(id => id !== seatId));
            }
          } else if (newUnlockedSeats.includes(seatId)) {
            // unlockedSeats에서 제거
            if (newUnlockedSeats.length === 1) {
              // 원소가 1개일 경우 배열 초기화
              setNewLockedSeats([]);
              setNewUnlockedSeats([]);
              setIsLockAvailable(false);
              setIsUnlockAvailable(false);
            } else {
              setNewUnlockedSeats(prev => prev.filter(id => id !== seatId));
            }
          } else {
            // 첫 번째 좌석이 locked인지 확인
            if (lockedSeats.includes(firstLockedSeat)) {
              // Locked seats만 선택 가능 --> lock 해제 logic
              if (lockedSeats.includes(seatId)) {
                // 새로 선택한 좌석을 unlocked에 추가
                setNewUnlockedSeats(prev => [...prev, seatId]);
                setIsUnlockAvailable(true);
                setIsLockAvailable(false);
              }
            } else {
              // locking logic
              // lockedSeats에 새로 선택한 좌석 추가
              if (!lockedSeats.includes(seatId)) {
                setNewLockedSeats(prev => [...prev, seatId]); // 기존 값에 추가
                setIsLockAvailable(true);
                setIsUnlockAvailable(false);
              }
            }
          }
        }

        console.log("newLockedSeats : ", newLockedSeats);
        console.log("newUnlockedSeats : ", newUnlockedSeats);
        console.log("lockedSeatsInfo : ", lockedSeatsInfo);

        setCurrentLockedSeatsInfo(lockedSeatsInfo);
        console.log(lockedSeatsInfo);
      } else {

        console.log("bookedSeatsInfo : ", bookedSeatsInfo);

        const bookedSeatIndex = bookedSeatsInfo.findIndex((seat: { row: string; number: number; }) => `${seat.row}${seat.number}` === seatId);
        console.log("bookedSeatIndex : ", bookedSeatIndex);
        console.log("bookedSeatIndex : ", bookedSeatIndex);

        if (bookedSeatIndex !== -1) {
          // const bookedSeatInfo = bookedSeatsInfo[bookedSeatIndex];
          // const bookedSeatId = bookedSeatInfo.id;
          // onSeatClick(bookedSeatId);

          // 좌석 클릭 시 해당 좌석을 temporarySelectedSeats에 추가
          const userSeats = bookingInfo ? bookingInfo.seats.map(seat => `${seat.row}${seat.number}`) : [];
          setTemporarySelectedSeats(userSeats); // userSeats를 일시적으로 선택된 좌석으로 설정
          return;
        }
      }
    } else {
      // 일반 좌석 선택 로직
      console.log(seatId);

      if (unclickableSeats.includes(seatId)) {
        showErrorModal(true);
      } else if (currentSelectedSeats.includes(seatId)) {
        // 이미 선택된 좌석을 클릭하면 선택 취소
        setCurrentSelectedSeats(currentSelectedSeats.filter(id => id !== seatId));
        setTemporarySelectedSeats([]); // 선택 해제 시 원래 색으로 복원
      } else if (currentSelectedSeats.length < headCount) {
        // headCount에 따라 좌석 선택 제한
        setCurrentSelectedSeats([...currentSelectedSeats, seatId]);
        setTemporarySelectedSeats([]); // 이전 선택된 좌석의 색 복원
      }
    }
  };

  const handleUserSeatClick = (row: string, seat: number) => {
    const seatId = `${row}${seat}`; // 좌석 ID 생성
    console.log("쨘쨘:", unclickableSeats);
    if (unclickableSeats.includes(seatId)) {
      showErrorModal(true);
      console.log("쨘");
    } else if (currentSelectedSeats.includes(seatId)) {
      // 이미 선택된 좌석을 클릭하면 선택 취소
      setCurrentSelectedSeats(currentSelectedSeats.filter(id => id !== seatId));
      setTemporarySelectedSeats([]); // 선택 해제 시 원래 색으로 복원
    } else if (currentSelectedSeats.length < headCount) {
      // headCount에 따라 좌석 선택 제한
      setCurrentSelectedSeats([...currentSelectedSeats, seatId]);
      setTemporarySelectedSeats([]); // 이전 선택된 좌석의 색 복원
    }
  }

  return (
    <SeatMapContainer>
      <StageContainer>
        <img src={stage} />
        <StageText className='Podo-Ticket-Headline-H4'>무대</StageText>
      </StageContainer>

      <SeatMapContent ref={seatMapRef}>
        {/* Left section seats */}
        <SeatRow>
          {Object.keys(RowsLeft).map((row) => (
            < SeatColumn key={row} seatCount={RowsLeft[row].length} >
              {RowsLeft[row].map((seat) => {
                const seatId = `${row}${seat}`;
                const isReserved = reservedSeats.includes(seatId);
                const isLocked = lockedSeats.includes(seatId);

                return (
                  <SingleSeat
                    key={seatId}
                    isAdmin={false}
                    content={`나 ${seat}`}
                    onClick={
                      isRealTime
                        ? () => handleSeatClick(seatId)
                        : () => handleUserSeatClick(row, seat)
                    }
                    isAvailable={!disabled && !(onSeatEdit && isReserved) || true}
                    isSelected={currentSelectedSeats.includes(seatId)}
                    isReserved={isReserved}
                    isLocked={isLocked}
                  />
                );
              })}
            </SeatColumn>
          ))}
        </SeatRow>

        {/* Right section seats */}
        <SeatRow className="seat-row">
          {Object.keys(RowsRight).map(row => (
            < SeatColumn key={row} seatCount={RowsRight[row].length} >
              {RowsRight[row].map((seat) => {
                const seatId = `${row}${seat}`;
                const isReserved = reservedSeats.includes(seatId);
                const isLocked = lockedSeats.includes(seatId);

                return (
                  <SingleSeat
                    key={seatId}
                    isAdmin={false}
                    content={`다 ${seat}`}
                    onClick={
                      isRealTime
                        ? () => handleSeatClick(seatId)
                        : () => handleUserSeatClick(row, seat)
                    }
                    isAvailable={!disabled && !(onSeatEdit && isReserved)}
                    isSelected={currentSelectedSeats.includes(seatId)}
                    isReserved={isReserved}
                    isLocked={isLocked}
                  />
                );
              })}
            </SeatColumn>
          ))}
        </SeatRow>
      </SeatMapContent>

    </SeatMapContainer>
  );
};

export default SeatMap;

const SeatMapContainer = styled.div`
display: flex;
flex-direction: column;
justify-content: center;

width: 100%;
height: 100%;

gap: 15px;
padding: 15px;

overflow: scroll;
`;

const StageContainer = styled.div`
position: relative;
display: flex;
justify-content: center;
align-items: center;

width: 100%;

transform: translate(225px, 0);

img {
display: block;
width: 397px;
height: auto;
}
`;

const StageText = styled.span`
position: absolute;
top: 10%;

color: var(--grey-4);
`;

const SeatMapContent = styled.div`
display: flex;

gap: 5px;
`;

const SeatRow = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;

gap: 2.5px;
`;

const SeatColumn = styled.div<{ seatCount: number }>`
display: flex;

width: ${({ seatCount }) => `${seatCount * 35}px`};

gap: 2.5px;
`;