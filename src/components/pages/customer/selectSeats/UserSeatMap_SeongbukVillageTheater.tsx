import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import SingleSeat from "@components/common/buttons/SingleSeat";
import stage from "@assets/images/stage.png";
import {
  SEONGBUK_VILLAGE_THEATER_BOTTOM as theater_bottom,
  SEONGBUK_VILLAGE_THEATER_LEFTSIDE as theater_left,
  SEONGBUK_VILLAGE_THEATER_RIGHTSIDE as theater_right,
} from "@/constants/venue/SeongbukVillageTheater";

import { fetchSeats } from "@/api/user/SelectSeatsApi";

interface SeatMapProps {
  isRealTime: boolean; // 실시간 모드 여부
  isRefreshed: boolean;
  scheduleId: number | null; // 스케줄 ID
  headCount: number; // 선택 가능한 좌석 수 제한
  currentSelectedSeats: string[]; // 선택된 좌석 배열
  setCurrentSelectedSeats: React.Dispatch<React.SetStateAction<string[]>>; // 선택된 좌석 업데이트 함수
  showErrorModal: React.Dispatch<React.SetStateAction<boolean>>; // 이미 선택된 좌석 경고 모달 상태 업데이트 함수
  disabled: boolean; // 좌석 선택 비활성화 여부
  onSeatClick?: (seatId: string) => void; // 좌석 클릭 핸들러 (옵션)
  onSeatEdit?: boolean; // 좌석 수정 모드 여부 (옵션)
}

const SeatMap: React.FC<SeatMapProps> = ({
  currentSelectedSeats,
  setCurrentSelectedSeats,

  showErrorModal,
  disabled,
  scheduleId,
  headCount,
  isRealTime,
  onSeatEdit,
}) => {
  const seatMapRef = useRef<HTMLDivElement>(null);
  const [seatMapWidth, setSeatMapWidth] = useState(0);

  useEffect(() => {
    if (seatMapRef.current) {
      const width = seatMapRef.current.getBoundingClientRect().width;
      setSeatMapWidth(width);
    }
  }, []);

  const [unclickableSeats, setUnclickableSeats] = useState<string[]>([]);
  const [reservedSeats, setReservedSeats] = useState<string[]>([]);
  const [lockedSeats, setLockedSeats] = useState<string[]>([]);

  // 좌석 정보 가져오기
  const loadSeatMapSeats = async () => {
    if (!scheduleId) {
      console.error("scheduleId가 없습니다.");
      return;
    }

    try {
      const data = await fetchSeats(
        0 | Number(localStorage.getItem("scheduleId"))
      );
      const unclickable = data.seats.map(
        (seat: { row: string; number: number }) => `${seat.row}${seat.number}`
      );
      const reserved = data.seats
        .filter((seat: { lock: boolean }) => seat.lock === false)
        .map(
          (seat: { row: string; number: number }) => `${seat.row}${seat.number}`
        );
      const locked = data.seats
        .filter((seat: { lock: boolean }) => seat.lock == true)
        .map(
          (seat: { row: string; number: number }) => `${seat.row}${seat.number}`
        );

      setUnclickableSeats(unclickable);
      setReservedSeats(reserved);
      setLockedSeats(locked);
    } catch (error) {
      console.error("Error fetching seats:", error);
    }
  };

  useEffect(() => {
    if (!isRealTime) {
      loadSeatMapSeats();
    }
  }, [scheduleId, isRealTime]);

  const handleUserSeatClick = (row: string, seat: number) => {
    const seatId = `${row}${seat}`;
    if (unclickableSeats.includes(seatId)) {
      showErrorModal(true);
    } else if (currentSelectedSeats.includes(seatId)) {
      setCurrentSelectedSeats(
        currentSelectedSeats.filter((id) => id !== seatId)
      );
    } else if (currentSelectedSeats.length < headCount) {
      setCurrentSelectedSeats([...currentSelectedSeats, seatId]);
    }
  };

  return (
    <TransformWrapper
      initialScale={1} // 초기 확대 비율
      minScale={1} // 최소 축소 비율
      maxScale={5} // 최대 확대 비율
      doubleClick={{ disabled: true }} // 더블 클릭 확대 비활성화
      wheel={{ step: 0.1 }} // 마우스 휠 줌 속도( step: 0.1) (마우스 휠 줌 비활성화 -  disabled: true  )
      pinch={{ step: 5 }} // 핀치 줌 감도
      centerZoomedOut // 줌아웃 시 중앙 정렬
    >
      <TransformComponent>
        <SeatMapScroller>
          <SeatMapContainer>
            <StageContainer seatMapWidth={seatMapWidth}>
              <StageImage stage={stage}>
                <StageText className="Podo-Ticket-Headline-H4">무대</StageText>
              </StageImage>
            </StageContainer>

            <SeatMapContent ref={seatMapRef}>
              <SeatMapTopSide>
                <SeatRow>
                  {Object.keys(theater_left).map((row) => (
                    <SeatColumn key={row} seatCount={theater_left[row].length}>
                      {theater_left[row].map((seat) => {
                        const seatId = `${row}${seat}`;
                        const isReserved = reservedSeats.includes(seatId);
                        const isLocked = lockedSeats.includes(seatId);

                        return (
                          <SingleSeat
                            key={seatId}
                            isAdmin={false}
                            content={`${row}${seat}`}
                            onClick={() => handleUserSeatClick(row, seat)}
                            isAvailable={
                              (!disabled && !(onSeatEdit && isReserved)) || true
                            }
                            isSelected={currentSelectedSeats.includes(seatId)}
                            isReserved={isReserved}
                            isLocked={isLocked}
                          />
                        );
                      })}
                    </SeatColumn>
                  ))}
                </SeatRow>

                <SeatRow>
                  {Object.keys(theater_right).map((row) => (
                    <SeatColumn key={row} seatCount={theater_right[row].length}>
                      {theater_right[row].map((seat) => {
                        const seatId = `${row}${seat}`;
                        const isReserved = reservedSeats.includes(seatId);
                        const isLocked = lockedSeats.includes(seatId);

                        return (
                          <SingleSeat
                            key={seatId}
                            isAdmin={false}
                            content={`${row}${seat}`}
                            onClick={() => handleUserSeatClick(row, seat)}
                            isAvailable={
                              (!disabled && !(onSeatEdit && isReserved)) || true
                            }
                            isSelected={currentSelectedSeats.includes(seatId)}
                            isReserved={isReserved}
                            isLocked={isLocked}
                          />
                        );
                      })}
                    </SeatColumn>
                  ))}
                </SeatRow>
              </SeatMapTopSide>

              <SeatMapDownSide>
                <SeatRow>
                  {Object.keys(theater_bottom).map((row) => (
                    <SeatColumn
                      key={row}
                      seatCount={theater_bottom[row].length}
                    >
                      {theater_bottom[row].map((seat) => {
                        const seatId = `${row}${seat}`;
                        const isReserved = reservedSeats.includes(seatId);
                        const isLocked = lockedSeats.includes(seatId);

                        return (
                          <SingleSeat
                            key={seatId}
                            isAdmin={false}
                            content={`${row}${seat}`}
                            onClick={() => handleUserSeatClick(row, seat)}
                            isAvailable={
                              (!disabled && !(onSeatEdit && isReserved)) || true
                            }
                            isSelected={currentSelectedSeats.includes(seatId)}
                            isReserved={isReserved}
                            isLocked={isLocked}
                          />
                        );
                      })}
                    </SeatColumn>
                  ))}
                </SeatRow>
              </SeatMapDownSide>
            </SeatMapContent>
          </SeatMapContainer>
        </SeatMapScroller>
      </TransformComponent>
    </TransformWrapper>
  );
};

export default SeatMap;

const SeatMapScroller = styled.div`
  display: flex;
  justify-content: center;
  min-height: 300px;
`;

const SeatMapContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  width: 100%;
  height: 100%;

  gap: 15px;
  padding: 15px;
`;

const StageContainer = styled.div<{ seatMapWidth: number }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  width: ${({ seatMapWidth }) => `${seatMapWidth}px`};
  padding: 0 45px;
`;

const StageImage = styled.div<{ stage: string }>`
  position: relative;

  background-image: url(${(props) => props.stage});
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

  gap: 2.5px;
`;

const SeatMapTopSide = styled.div`
  display: flex;

  gap: 70px;
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

  gap: 2.5px;
`;

const SeatColumn = styled.div<{ seatCount: number }>`
  display: flex;

  width: ${({ seatCount }) => `${seatCount * 35}px`};

  gap: 2.5px;
`;
