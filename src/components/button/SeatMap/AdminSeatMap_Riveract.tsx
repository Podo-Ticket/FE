import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';

import SingleSeat from '../SingleSeat';

import stage from '../../../assets/images/stage.png'
import nameImage from '../../../assets/images/admin/grey_person.png'
import phoneImage from '../../../assets/images/admin/grey_home_phone.png'
import headCountImage from '../../../assets/images/admin/grey_sofa.png'
import availableSeatImage from '../../../assets/images/admin/lightgrey_block.png'
import reservedSeatImage from '../../../assets/images/admin/grey_block.png'
import lockImage from '../../../assets/images/admin/purple_lock.png'
import {
  HUMANITIES_SMALL_THEATER as theater
} from "../../../constants/venue/SeoulNationalUniv";

import { fetchAdminSeats, fetchSeatAudience } from '../../../api/admin/RealtimeSeatsApi';

// 좌석 정보 인터페이스
interface Seat {
  row: string; // 행
  number: number; // 열 번호
}

// 예매자 정보 인터페이스
interface ReservedAudienceInfo {
  name: string; // 예매자 이름
  phoneNumber: string; // 예매자 전화번호
  headCount: number; // 예매 인원 수
  seats: Seat[]; // 좌석 배열
}

interface SeatMapProps {
  isRealTime: boolean; // true: 실시간 모드, false: 좌석 잠금 모드
  manageMode: boolean; // true: 잠금 모드, false: 잠금 해제 모드
  isRefreshed: boolean; // 새로고침 트리거

  scheduleId: number | null; // 스케줄 ID
  disabled: boolean; // 좌석 선택 비활성화 여부
  bookingInfo?: { seats: { row: string; number: number }[] }; // 예약 정보 (옵션)

  onLockedSeatsChange?: (newLockedSeats: string[]) => void;
  onUnlockedSeatsChange?: (newUnlockedSeats: string[]) => void;
  onCurrentLockedSeatsInfoChange?: (currentLockedSeatsInfo: { id: string; row: string; number: number }[]) => void;
}

const SeatMap: React.FC<SeatMapProps> = ({ disabled, scheduleId, isRealTime, manageMode, isRefreshed, bookingInfo,
  onLockedSeatsChange, onUnlockedSeatsChange, onCurrentLockedSeatsInfoChange, }) => {

  const seatMapRef = useRef(null);
  const [lockedSeatsInfo, setLockedSeatsInfo] = useState([]);
  const [bookedSeatsInfo, setbookedSeatsInfo] = useState([]);

  const [unclickableSeats, setUnclickableSeats] = useState<string[]>([]);
  const [reservedSeats, setReservedSeats] = useState<string[]>([]);
  const [lockedSeats, setLockedSeats] = useState<string[]>([]);
  const [remainingSeatsCount, setRemainingSeatsCount] = useState<number>(0);

  const [reservedAudienceInfo, setReservedAudienceInfo] = useState<ReservedAudienceInfo>();
  const [showAudienceInfo, setShowAudienceInfo] = useState<Boolean>(false);
  const [selectedAudienceSeats, setSelectedAudienceSeats] = useState<string[]>([]); // 관객 정보 가시화 좌석

  const [newLockedSeats, setNewLockedSeats] = useState<string[]>([]);
  const [newUnlockedSeats, setNewUnlockedSeats] = useState<string[]>([]);
  const [currentLockedSeatsInfo, setCurrentLockedSeatsInfo] = useState<{ id: string; row: string; number: number }[]>([]);

  // 좌석 정보 가져오기
  const loadSeatMapSeats = async (isRealTime: boolean) => {
    if (!scheduleId) {
      console.error("scheduleId가 없습니다.");
      return;
    }

    try {
      const data = await fetchAdminSeats(scheduleId);
      setRemainingSeatsCount(data.availableSeats); // 여석 수 동기화

      // 선택 불가 좌석 배열 생성
      const unclickable = data.seats.map(seat => `${seat.row}${seat.number}`);
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

  // 관리자 좌석 정보 가져오기 (지연 실행으로 null값 피하기)
  useEffect(() => {
    const timer = setTimeout(() => {
      setNewLockedSeats([]);
      setNewUnlockedSeats([]);
      loadSeatMapSeats(true); // 실시간 좌석 정보 가져오기
    }, 100); // 100ms의 지연 후 실행
    return () => clearTimeout(timer); // cleanup
  }, [scheduleId, isRefreshed]); // scheduleId와 isRealTime이 변경될 때마다 실행

  ////////////////////////////////////
  //* 실시간 좌석 현황 클릭 처리 함수 부분 *//
  ////////////////////////////////////

  // 선택된 관객 정보가 없으면 배열 초기화
  useEffect(() => {
    if (!reservedAudienceInfo) {
      setSelectedAudienceSeats([]);
      setShowAudienceInfo(false);
    }
  }, [reservedAudienceInfo]);

  // reservedAudienceInfo에서 userSeats를 가져와서 SelectedAudienceSeats에 추가
  useEffect(() => {
    if (reservedAudienceInfo) {
      const userSeats = reservedAudienceInfo.seats.map(seat => `${seat.row}${seat.number}`);
      setSelectedAudienceSeats(userSeats); // userSeats를 일시적으로 선택된 좌석으로 설정
    }
  }, [reservedAudienceInfo]);

  // 실시간 좌석 현황에서 예약된 좌석 클릭 이벤트 처리
  const handleReservedSeatClick = async (seatId: string) => {
    try {
      const response = await fetchSeatAudience(Number(scheduleId), seatId);

      const userInfo = response.user;
      const userSeats = response.seats;

      setReservedAudienceInfo({
        name: userInfo.name,
        phoneNumber: userInfo.phone_number,
        headCount: userInfo.head_count,
        seats: userSeats,
      });

      if (reservedAudienceInfo) setSelectedAudienceSeats(reservedAudienceInfo.seats.map(seat => `${seat.row}${seat.number}`));

      setShowAudienceInfo(true);
    } catch (error) {
      console.error("Error fetching booking info:", error);
      setReservedAudienceInfo(null);
      setShowAudienceInfo(false);
    }
  };

  ////////////////////////////////////////
  //* 좌석 잠금 & 잠금 해제 클릭 처리 함수 부분 *//
  ////////////////////////////////////////

  // 상태가 변경될 때 부모 컴포넌트로 전달
  useEffect(() => {
    if (!isRealTime) { onLockedSeatsChange(newLockedSeats); }
  }, [newLockedSeats, onLockedSeatsChange]);

  useEffect(() => {
    if (!isRealTime) { onUnlockedSeatsChange(newUnlockedSeats); }
  }, [newUnlockedSeats, onUnlockedSeatsChange]);

  useEffect(() => {
    if (!isRealTime) { onCurrentLockedSeatsInfoChange(currentLockedSeatsInfo); }
  }, [currentLockedSeatsInfo, onCurrentLockedSeatsInfoChange]);

  // 좌석 클릭 처리 함수
  const handleSeatClick = (seatId) => {
    if (disabled) return;

    // 좌석 잠금 또는 해제 모드의 경우 좌석 클릭 시
    if (!isRealTime) {
      if (manageMode) {
        // newLockedSeats 배열에서 seatId가 이미 존재하는지 확인
        if (newLockedSeats.includes(seatId)) {
          // 이미 존재하면 제거
          setNewLockedSeats(prev => prev.filter(id => id !== seatId));
        } else {
          // 존재하지 않으면 추가
          setNewLockedSeats(prev => [...prev, seatId]);
        }
      } else {
        // newUnlockedSeats 배열에서 seatId가 이미 존재하는지 확인
        if (newUnlockedSeats.includes(seatId)) {
          // 이미 존재하면 제거
          setNewUnlockedSeats(prev => prev.filter(id => id !== seatId));
        } else {
          // 존재하지 않으면 추가
          setNewUnlockedSeats(prev => [...prev, seatId]);
        }
      }
      setCurrentLockedSeatsInfo(lockedSeatsInfo);
    }
    // 실시간 좌석 예매된 좌석 클릭 시
    else {
      const bookedSeatIndex = bookedSeatsInfo.findIndex(seat => `${seat.row}${seat.number}` === seatId);

      if (bookedSeatIndex !== -1) {
        console.log("bookedSeatIndex: ", bookedSeatIndex);
        const reservedSeatInfo = bookedSeatsInfo[bookedSeatIndex];    // 선택된 좌석의 고객 정보를 가져옴
        console.log("bookedSeatInfo: ", reservedSeatInfo);
        const reservedSeatId = reservedSeatInfo.id;   // 선택된 좌석의 고객의 ID 정보를 가져옴
        handleReservedSeatClick(reservedSeatId);

        // 좌석 클릭 시 해당 좌석을 temporarySelectedSeats에 추가
        const userSeats = bookingInfo ? bookingInfo.seats.map(seat => `${seat.row}${seat.number}`) : [];
        setSelectedAudienceSeats(userSeats); // userSeats를 일시적으로 선택된 좌석으로 설정
        return;
      }
      else {
        setReservedAudienceInfo(null);
      }
    }

  };

  return (
    <SeatMapContainer>

      {isRealTime && (
        showAudienceInfo ? (
          <AudienceInfoContainer>
            <AudienceInfoItem>
              <AudienceInfoIcon src={nameImage} />
              <AudienceInfoCategory>예매자</AudienceInfoCategory>
              <AudienceInfoDescription>{reservedAudienceInfo?.name}</AudienceInfoDescription>
            </AudienceInfoItem>

            <AudienceInfoDivider />

            <AudienceInfoItem>
              <AudienceInfoIcon src={phoneImage} />
              <AudienceInfoCategory>연락처</AudienceInfoCategory>
              <AudienceInfoDescription>{reservedAudienceInfo?.phoneNumber}</AudienceInfoDescription>
            </AudienceInfoItem>

            <AudienceInfoDivider />

            <AudienceInfoItem>
              <AudienceInfoIcon src={headCountImage} />
              <AudienceInfoCategory>좌석 수</AudienceInfoCategory>
              <AudienceInfoDescription>{reservedAudienceInfo?.headCount}</AudienceInfoDescription>
            </AudienceInfoItem>
          </AudienceInfoContainer>
        ) : null
      )}

      <StageContainer>
        <img src={stage} />
        <StageText className='Podo-Ticket-Headline-H4'>무대</StageText>
      </StageContainer>

      <SeatMapContent ref={seatMapRef}>
        <SeatRow>
          {Object.keys(theater).map((row) => (
            < SeatColumn key={row} seatCount={theater[row].length} >
              {theater[row].map((seat) => {
                const seatId = `${row}${seat}`;
                const isReserved = reservedSeats.includes(seatId);
                const isLocked = lockedSeats.includes(seatId);
                const isShowSelectedAudience = selectedAudienceSeats.includes(seatId);
                const isLocking = newLockedSeats.includes(seatId)
                const isUnlocking = newUnlockedSeats.includes(seatId)

                // 클릭 가능 여부를 isRealTime, manageMode, 배열 상태에 따라 설정
                const isAvailable = isRealTime ? true
                  : manageMode ? !unclickableSeats.includes(seatId) : isLocked;

                return (
                  <SingleSeat
                    key={seatId}
                    isAdmin={true}
                    content={`${row}${seat}`}
                    onClick={() => handleSeatClick(seatId)}
                    isAvailable={isAvailable}
                    isSelectedAudience={isShowSelectedAudience}
                    isReserved={isReserved}
                    isLocked={isLocked}
                    isLocking={isLocking}
                    isUnlocking={isUnlocking}
                  />
                );
              })}
            </SeatColumn>
          ))}
        </SeatRow>

        <SeatInfoContainer isRealTime={isRealTime}>
          <SeatCategoryContainer>
            <SeatCategory>
              <SeatImage src={availableSeatImage} />
              <SeatDescription>발권 가능</SeatDescription>
            </SeatCategory>

            <SeatCategory>
              <SeatImage src={reservedSeatImage} />
              <SeatDescription>발권 완료</SeatDescription>
            </SeatCategory>

            <SeatCategory>
              <SeatImage src={lockImage} />
              <SeatDescription>잠금 좌석</SeatDescription>
            </SeatCategory>
          </SeatCategoryContainer>

          <RemainingSeat>여석 {remainingSeatsCount}석</RemainingSeat>
        </SeatInfoContainer>
      </SeatMapContent>

    </SeatMapContainer >
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
padding-bottom: 50px;

overflow: scroll;
`;

const StageContainer = styled.div`
position: relative;
display: flex;
justify-content: center;
align-items: center;

width: 100%;

transform: translate(28%, 0);

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

const AudienceInfoContainer = styled.div`
position: absolute;
left: 5%;
top: 12%;

display: flex;
justify-content: space-between;
align-items: center;

width: 90%;
height: 80px;
border-radius: 20px 20px 0px 0px;
border: 1px solid var(--grey-3);
border-bottom: none;
background: var(--ect-white);

padding: 5px 55px;

`;

const AudienceInfoItem = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;

gap: 3px;
`;

const AudienceInfoIcon = styled.img`
width: 26px;
height: 26px;
`;

const AudienceInfoCategory = styled.div.attrs({ className: 'Podo-Ticket-Body-B11' })`
color: var(--grey-7);
`;

const AudienceInfoDescription = styled.div.attrs({ className: 'Podo-Ticket-Body-B12' })`
color: var(--purple-4);
`;

const AudienceInfoDivider = styled.div`
width: 0.5px;
height: 65%;

background: var(--grey-3);
`;

const SeatInfoContainer = styled.div<{ isRealTime: boolean }>`
position: absolute;
top: ${({ isRealTime }) => isRealTime ? '88' : '81'}%;

display: flex;
flex-direction: row;

width: 80%;
`;

const SeatCategoryContainer = styled.div`
display: flex;
flex-grow: 1;

gap: 12px;
`;

const SeatCategory = styled.div`
display: flex;
justify-content: center;
align-items: center;

gap: 5px;
`;

const SeatImage = styled.img`
width: 14px;
height: 14px;
`;

const SeatDescription = styled.div.attrs({ className: 'Podo-Ticket-Body-B11' })`
color: var(--grey-7)
`;

const RemainingSeat = styled.div.attrs({ className: 'Podo-Ticket-Body-B9' })`
border-radius: 20px;
border: 1px solid var(--purple-7);
background: var(--lightpurple-2);

padding: 0 10px;

color: var(--purple-4);
`; 
