import React from "react";
import styled from "styled-components";

interface SingleSeatProps {
    isAdmin: boolean; // 어드민 계정 여부
    content: string; // 버튼 안 내용
    onClick: () => void; // 클릭 이벤트 핸들러
    isAvailable: boolean; // 버튼 동작 여부
    isLocked?: boolean; // 좌석이 잠겨 있는지 여부
    isReserved?: boolean; // 좌석이 예약되었는지 여부
    isSelected?: boolean; // 좌석이 선택되었는지 여부
    isTemporarySelected?: boolean; // 임시 선택된 좌석인지 여부
    isRealTime?: boolean; // 실시간 모드인지 여부
    newLockedSeats?: boolean; // 새로 잠긴 좌석인지 여부
    newUnlockedSeats?: boolean; // 새로 잠금 해제된 좌석인지 여부
}

const SingleSeat: React.FC<SingleSeatProps> = ({
    isAdmin,
    content,
    onClick,
    isAvailable,
    isLocked = false,
    isReserved = false,
    isSelected = false,
    isTemporarySelected = false,
    isRealTime = false,
    newLockedSeats = false,
    newUnlockedSeats = false,
}) => {
    return (
        <SingleSeatContainer
            onClick={onClick}
            disabled={!isAvailable || (isReserved && !isRealTime)}
            isAvailable={isAvailable}
            isAdmin={isAdmin}
            isLocked={isLocked}
            isReserved={isReserved}
            isSelected={isSelected}
            isTemporarySelected={isTemporarySelected}
            newLockedSeats={newLockedSeats}
            newUnlockedSeats={newUnlockedSeats}
        >
            {content}
        </SingleSeatContainer>
    );
};

export default SingleSeat;

// Styled Components
const SingleSeatContainer = styled.button<{
    isAvailable: boolean;
    isAdmin: boolean;
    isLocked: boolean;
    isReserved: boolean;
    isSelected: boolean;
    isTemporarySelected: boolean;
    newLockedSeats: boolean;
    newUnlockedSeats: boolean;
}>`
  width: 32px;
  height: 32px;
  border-radius: 5px;
  
  color: var(--grey-6);
  font-size: 11px;
  font-weight: 600;

  border: ${({
    isLocked,
    isReserved,
    isSelected,
    isTemporarySelected,
    newLockedSeats,
    newUnlockedSeats
}) => {
        if (isLocked) return "none";
        if (isReserved) return "none";
        if (newLockedSeats) return "purple";
        if (newUnlockedSeats) return "green";
        if (isTemporarySelected) return "orange";
        if (isSelected) return "1px solid var(--purple-6)";
        return "none";
    }};
  
  background-color: ${({
        isLocked,
        isAdmin,
        isReserved,
        isSelected,
        isTemporarySelected,
        newLockedSeats,
        newUnlockedSeats
    }) => {
        if (isLocked) {return isAdmin ? "var(--red-1)" : "var(--grey-6)"};
        if (isReserved) return "var(--grey-6)";
        if (newLockedSeats) return "purple";
        if (newUnlockedSeats) return "green";
        if (isTemporarySelected) return "orange";
        if (isSelected) return "var(--purple-9)";
        return "var(--grey-3)";
    }};
  
  color: ${({
        isLocked,
        isReserved,
        isSelected,
        newLockedSeats,
        newUnlockedSeats
    }) => {
        if (isLocked || isReserved || newLockedSeats) return "var(--grey-4)";
        if (newUnlockedSeats) return "white";
        if (isSelected) return "var(--purple-4)"
        return "var(--grey-6)";
    }};
  
  cursor: ${({ isAvailable }) => (isAvailable ? "pointer" : "not-allowed")};
  
  opacity: ${({
        isLocked,
        isReserved,
        newLockedSeats,
        newUnlockedSeats
    }) => {
        if (isLocked || isReserved || newLockedSeats) return "0.6";
        if (newUnlockedSeats) return "1";
        return "1";
    }};
  
  transition: all .2s ease-in-out;
  }
`;