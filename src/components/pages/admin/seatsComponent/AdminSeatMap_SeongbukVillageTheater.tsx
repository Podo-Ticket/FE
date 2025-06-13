import React, {useRef, useEffect, useState} from 'react';
import {TransformWrapper, TransformComponent} from 'react-zoom-pan-pinch';
import styled from 'styled-components';

import SingleSeat from '@components/common/buttons/SingleSeat';
import AudienceInfo from '@components/pages/admin/realtimeSeats/AudienceInfo';

import stage from '@assets/images/stage.png';
import {
  SEONGBUK_VILLAGE_THEATER_BOTTOM as theater_bottom,
  SEONGBUK_VILLAGE_THEATER_LEFTSIDE as theater_left,
  SEONGBUK_VILLAGE_THEATER_RIGHTSIDE as theater_right,
} from '@/constants/venue/SeongbukVillageTheater';

import {fetchAdminSeats, fetchSeatAudience} from '@/api/admin/RealtimeSeatsApi';

// 좌석 정보 인터페이스
interface Seat {
  id: any;
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

interface Seat {
  row: string; // 좌석의 행 (예: '나1')
  number: number; // 좌석의 번호 (예: '6')
}

interface SeatMapProps {
  isRealTime: boolean; // true: 실시간 모드, false: 좌석 잠금 모드
  manageMode: boolean; // true: 잠금 모드, false: 잠금 해제 모드
  isRefreshed: boolean; // 새로고침 트리거

  scheduleId: number | null; // 스케줄 ID
  disabled: boolean; // 좌석 선택 비활성화 여부
  bookingInfo?: {seats: {row: string; number: number}[]}; // 예약 정보 (옵션)

  onLockedSeatsChange?: (newLockedSeats: string[]) => void;
  onUnlockedSeatsChange?: (newUnlockedSeats: string[]) => void;
  onCurrentLockedSeatsInfoChange?: (
    currentLockedSeatsInfo: {id: string; row: string; number: number}[],
  ) => void;
  setAudienceInfo?: (newState: any) => void;
  setRemainingSeats?: (newState: any) => void;
}

const SeatMap: React.FC<SeatMapProps> = ({
  disabled,
  scheduleId,
  isRealTime,
  manageMode,
  isRefreshed,
  bookingInfo,
  onLockedSeatsChange,
  onUnlockedSeatsChange,
  onCurrentLockedSeatsInfoChange,
  setAudienceInfo,
  setRemainingSeats,
}) => {
  const seatMapRef = useRef<HTMLDivElement>(null);
  const [seatMapWidth, setSeatMapWidth] = useState(0);

  useEffect(() => {
    if (seatMapRef.current) {
      const width = seatMapRef.current.getBoundingClientRect().width;
      setSeatMapWidth(width);
    }
  }, []);

  const [lockedSeatsInfo, setLockedSeatsInfo] = useState([]);
  const [bookedSeatsInfo, setbookedSeatsInfo] = useState<Seat[]>([]);

  const [unclickableSeats, setUnclickableSeats] = useState<string[]>([]);
  const [reservedSeats, setReservedSeats] = useState<string[]>([]);
  const [lockedSeats, setLockedSeats] = useState<string[]>([]);
  const [, setRemainingSeatsCount] = useState<number>(0);

  const [reservedAudienceInfo, setReservedAudienceInfo] = useState<ReservedAudienceInfo>();
  const [showAudienceInfo, setShowAudienceInfo] = useState<Boolean>(false);
  const [selectedAudienceSeats, setSelectedAudienceSeats] = useState<string[]>([]); // 관객 정보 가시화 좌석

  const [newLockedSeats, setNewLockedSeats] = useState<string[]>([]);
  const [newUnlockedSeats, setNewUnlockedSeats] = useState<string[]>([]);
  const [currentLockedSeatsInfo, setCurrentLockedSeatsInfo] = useState<
    {id: string; row: string; number: number}[]
  >([]);

  // 좌석 정보 가져오기
  const loadSeatMapSeats = async () => {
    if (!scheduleId) {
      return;
    }

    try {
      const data = await fetchAdminSeats(scheduleId);
      setRemainingSeatsCount(data.availableSeats); // 여석 수 동기화
      if (setRemainingSeats !== undefined) setRemainingSeats(data.availableSeats);
      const unclickable = data.seats.map(
        (seat: {row: string; number: number}) => `${seat.row}${seat.number}`,
      );

      // 예매된 좌석 Id 배열 생성
      const reserved = data.seats
        .filter((seat: {lock: boolean}) => seat.lock === false) // (lock == false) === 예매된 좌석
        .map((seat: {row: string; number: number}) => `${seat.row}${seat.number}`);

      // 잠금된 좌석 Id 배열 생성
      const locked = data.seats
        .filter((seat: {lock: boolean}) => seat.lock == true) // (lock == true) === 잠금된 좌석
        .map((seat: {row: string; number: number}) => `${seat.row}${seat.number}`);

      const bookedSeatInfo = data.seats.filter((seat: {lock: boolean}) => seat.lock === false);
      const lockedSeatInfo = data.seats.filter((seat: {lock: boolean}) => seat.lock === true);

      setUnclickableSeats(unclickable); // 선택 불가 좌석
      setReservedSeats(reserved); // 예매된 좌석
      setLockedSeats(locked); // 잠금된 좌석

      setbookedSeatsInfo(bookedSeatInfo);
      setLockedSeatsInfo(lockedSeatInfo);
    } catch (error) {}
  };

  // 관리자 좌석 정보 가져오기 (지연 실행으로 null값 피하기)
  useEffect(() => {
    const timer = setTimeout(() => {
      setNewLockedSeats([]);
      setNewUnlockedSeats([]);
      loadSeatMapSeats();
      setSelectedAudienceSeats([]);
      setShowAudienceInfo(false);
    }, 100); //
    return () => clearTimeout(timer);
  }, [scheduleId, isRefreshed]);

  ////////////////////////////////////
  //* 실시간 좌석 현황 클릭 처리 함수 부분 *//
  ////////////////////////////////////

  // 선택된 관객 정보가 없으면 배열 초기화
  useEffect(() => {
    if (!reservedAudienceInfo) {
      setSelectedAudienceSeats([]);
      setShowAudienceInfo(false);
      if (setAudienceInfo !== undefined) setAudienceInfo(undefined);
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

      if (reservedAudienceInfo)
        setSelectedAudienceSeats(
          reservedAudienceInfo.seats.map(seat => `${seat.row}${seat.number}`),
        );

      if (setAudienceInfo !== undefined) {
        setAudienceInfo({
          name: userInfo.name,
          phoneNumber: userInfo.phone_number,
          headCount: userInfo.head_count,
        });
      }

      setShowAudienceInfo(true);
    } catch (error) {
      setReservedAudienceInfo(undefined);
      if (setAudienceInfo !== undefined) setAudienceInfo(undefined);
      setShowAudienceInfo(false);
    }
  };

  ////////////////////////////////////////
  //* 좌석 잠금 & 잠금 해제 클릭 처리 함수 부분 *//
  ////////////////////////////////////////

  // 상태가 변경될 때 부모 컴포넌트로 전달
  useEffect(() => {
    if (!isRealTime && newLockedSeats && onLockedSeatsChange) {
      onLockedSeatsChange(newLockedSeats);
    }
  }, [newLockedSeats, onLockedSeatsChange]);

  useEffect(() => {
    if (!isRealTime && newUnlockedSeats && onUnlockedSeatsChange) {
      onUnlockedSeatsChange(newUnlockedSeats);
    }
  }, [newUnlockedSeats, onUnlockedSeatsChange]);

  useEffect(() => {
    if (!isRealTime && currentLockedSeatsInfo && onCurrentLockedSeatsInfoChange) {
      onCurrentLockedSeatsInfoChange(currentLockedSeatsInfo);
    }
  }, [currentLockedSeatsInfo, onCurrentLockedSeatsInfoChange]);

  // 좌석 클릭 처리 함수
  const handleSeatClick = (seatId: string) => {
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
      const bookedSeatIndex = bookedSeatsInfo.findIndex(
        (seat: {row: string; number: number}) => `${seat.row}${seat.number}` === seatId,
      );

      if (bookedSeatIndex !== -1) {
        const reservedSeatInfo = bookedSeatsInfo[bookedSeatIndex];
        const reservedSeatId = reservedSeatInfo.id;
        handleReservedSeatClick(reservedSeatId);
        const userSeats = bookingInfo
          ? bookingInfo.seats.map(seat => `${seat.row}${seat.number}`)
          : [];
        setSelectedAudienceSeats(userSeats);
        return;
      } else {
        setReservedAudienceInfo(undefined);
      }
    }
  };

  return (
    <TransformWrapper
      initialScale={1} // 초기 확대 비율
      minScale={1} // 최소 축소 비율
      maxScale={5} // 최대 확대 비율
      doubleClick={{disabled: true}} // 더블 클릭 확대 비활성화
      wheel={{step: 0.1}} // 마우스 휠 줌 속도( step: 0.1) (마우스 휠 줌 비활성화 -  disabled: true  )
      pinch={{step: 5}} // 핀치 줌 감도
      centerZoomedOut // 줌아웃 시 중앙 정렬
    >
      <TransformComponent>
        <SeatMapContainer>
          {isRealTime &&
            (showAudienceInfo ? (
              <AudienceInfoWrapper>
                <AudienceInfo
                  name={reservedAudienceInfo?.name}
                  phoneNumber={reservedAudienceInfo?.phoneNumber}
                  headCount={reservedAudienceInfo?.headCount}
                />
              </AudienceInfoWrapper>
            ) : null)}

          <StageContainer seatMapWidth={seatMapWidth}>
            <StageImage stage={stage}>
              <StageText className='Podo-Ticket-Headline-H4'>무대</StageText>
            </StageImage>
          </StageContainer>

          <SeatMapContent ref={seatMapRef}>
            <SeatMapTopSide>
              <SeatRow>
                {Object.keys(theater_left).map(row => (
                  <SeatColumn key={row} seatCount={theater_left[row].length}>
                    {theater_left[row].map(seat => {
                      const seatId = `${row}${seat}`;
                      const isReserved = reservedSeats.includes(seatId);
                      const isLocked = lockedSeats.includes(seatId);
                      const isShowSelectedAudience = selectedAudienceSeats.includes(seatId);
                      const isLocking = newLockedSeats.includes(seatId);
                      const isUnlocking = newUnlockedSeats.includes(seatId);

                      // 클릭 가능 여부를 isRealTime, manageMode, 배열 상태에 따라 설정
                      const isAvailable = isRealTime
                        ? true
                        : manageMode
                          ? !unclickableSeats.includes(seatId)
                          : isLocked;

                      return (
                        <SingleSeat
                          key={seatId}
                          isAdmin={true}
                          content={`${row}${String(seat).padStart(2, '0')}`}
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

              <SeatRow>
                {Object.keys(theater_right).map(row => (
                  <SeatColumn key={row} seatCount={theater_right[row].length}>
                    {theater_right[row].map(seat => {
                      const seatId = `${row}${seat}`;
                      const isReserved = reservedSeats.includes(seatId);
                      const isLocked = lockedSeats.includes(seatId);
                      const isShowSelectedAudience = selectedAudienceSeats.includes(seatId);
                      const isLocking = newLockedSeats.includes(seatId);
                      const isUnlocking = newUnlockedSeats.includes(seatId);

                      // 클릭 가능 여부를 isRealTime, manageMode, 배열 상태에 따라 설정
                      const isAvailable = isRealTime
                        ? true
                        : manageMode
                          ? !unclickableSeats.includes(seatId)
                          : isLocked;

                      return (
                        <SingleSeat
                          key={seatId}
                          isAdmin={true}
                          content={`${row}${String(seat).padStart(2, '0')}`}
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
            </SeatMapTopSide>

            <SeatMapDownSide>
              <SeatRow>
                {Object.keys(theater_bottom).map(row => (
                  <SeatColumn key={row} seatCount={theater_bottom[row].length}>
                    {theater_bottom[row].map(seat => {
                      const seatId = `${row}${seat}`;
                      const isReserved = reservedSeats.includes(seatId);
                      const isLocked = lockedSeats.includes(seatId);
                      const isShowSelectedAudience = selectedAudienceSeats.includes(seatId);
                      const isLocking = newLockedSeats.includes(seatId);
                      const isUnlocking = newUnlockedSeats.includes(seatId);

                      // 클릭 가능 여부를 isRealTime, manageMode, 배열 상태에 따라 설정
                      const isAvailable = isRealTime
                        ? true
                        : manageMode
                          ? !unclickableSeats.includes(seatId)
                          : isLocked;

                      return (
                        <SingleSeat
                          key={seatId}
                          isAdmin={true}
                          content={`${row}${String(seat).padStart(2, '0')}`}
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
            </SeatMapDownSide>
          </SeatMapContent>
        </SeatMapContainer>
      </TransformComponent>
    </TransformWrapper>
  );
};

export default SeatMap;

const SeatMapContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;

  width: 100%;
  height: 100%;

  gap: 15px;
  padding: 15px;
  padding-bottom: 50px;
`;

const StageContainer = styled.div<{seatMapWidth: number}>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  width: ${({seatMapWidth}) => `${seatMapWidth}px`};
  padding: 0 45px;
`;

const StageImage = styled.div<{stage: string}>`
  position: relative;

  background-image: url(${props => props.stage});
  background-size: 100% 100%;
  background-position: center;

  width: 100%;
  height: 80px;
`;

const StageText = styled.span`
  position: absolute;
  top: 15%;
  left: 50%;
  transform: translateX(-50%);

  color: var(--grey-4);
`;

const SeatMapContent = styled.div`
  display: flex;
  flex-direction: column;

  gap: 5px;
  margin-right: 70px;
`;

const SeatMapTopSide = styled.div`
  display: flex;
  justify-content: space-between;

  gap: 35px;
`;

const SeatMapDownSide = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const SeatRow = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  gap: 5px;
`;

const SeatColumn = styled.div<{seatCount: number}>`
  display: flex;

  width: ${({seatCount}) => `${seatCount * 35}px`};

  gap: 5px;
`;

const AudienceInfoWrapper = styled.div`
  position: absolute;
  left: 0%;
  top: -5%;

  display: flex;
  width: 100%;

  z-index: 3;
`;
