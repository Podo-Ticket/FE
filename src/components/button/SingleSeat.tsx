import React from "react";
import styled from "styled-components";

import lockIcon from "../../assets/images/admin/purple_seat_lock.png";

interface SingleSeatProps {
    isAdmin: boolean; // 어드민 계정 여부
    content: string; // 버튼 안 내용
    onClick: () => void; // 클릭 이벤트 핸들러
    isAvailable: boolean; // 버튼 동작 여부
    isLocked?: boolean; // 좌석이 잠겨 있는지 여부
    isReserved?: boolean; // 좌석이 예약되었는지 여부
    isSelected?: boolean; // 좌석이 선택되었는지 여부
    isSelectedAudience?: boolean; // 임시 선택된 좌석인지 여부
    isLocking?: boolean; // 새로 잠긴 좌석인지 여부
    isUnlocking?: boolean; // 새로 잠금 해제된 좌석인지 여부
}

const SingleSeat: React.FC<SingleSeatProps> = ({
    isAdmin,
    content,
    onClick,
    isAvailable,
    isLocked = false,
    isReserved = false,
    isSelected = false,
    isSelectedAudience = false,
    isLocking = false,
    isUnlocking = false,
}) => {
    return (
        <SingleSeatContainer
            onClick={onClick}
            disabled={!isAvailable}
            isAvailable={isAvailable}
            isAdmin={isAdmin}
            isLocked={isLocked}
            isReserved={isReserved}
            isSelected={isSelected}
            isSelectedAudience={isSelectedAudience}
            isLocking={isLocking}
            isUnlocking={isUnlocking}
        >
            {content}
            <LockImage
                isAdmin={isAdmin}
                isLocked={isLocked}
                isUnlocking={isUnlocking}
            />
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
    isSelectedAudience: boolean;
    isLocking: boolean;
    isUnlocking: boolean;
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
    isSelectedAudience,
    isLocking,
    isUnlocking
}) => {
        if (isUnlocking) return "1px solid var(--purple-6)";
        if (isSelectedAudience) return "1px solid var(--purple-6)";
        if (isLocked) return "none";
        if (isReserved) return "none";
        if (isLocking) return "1px solid var(--purple-6)";
        if (isSelected) return "1px solid var(--purple-6)";
        return "none";
    }};
  
  background-color: ${({
        isLocked,
        isAdmin,
        isReserved,
        isSelected,
        isSelectedAudience,
        isLocking,
        isUnlocking
    }) => {
        if (isUnlocking) return "var(--purple-9)";
        if (isLocked) return "var(--grey-6)";
        if (isSelectedAudience) return "var(--purple-9)";
        if (isReserved) return "var(--grey-6)";
        if (isLocking) return "var(--purple-9)";
        if (isSelected) return "var(--purple-9)";
        return "var(--grey-3)";
    }};
  
  color: ${({
        isSelectedAudience,
        isLocked,
        isReserved,
        isSelected,
        isLocking,
        isUnlocking
    }) => {
        if (isUnlocking) return "var(--purple-4)";
        if (isSelectedAudience) return "var(--purple-4)";
        if (isLocked || isReserved) return "var(--grey-4)";
        if (isLocking) return "var(--purple-4)";
        if (isSelected) return "var(--purple-4)";
        return "var(--grey-6)";
    }};
  
  cursor: ${({ isAvailable }) => (isAvailable ? "pointer" : "not-allowed")};
    
  transition: all .2s ease-in-out;

  position: relative; /* 가상 요소 배치를 위해 position 설정 */

   /* 대각선 X 표시 */
   &::before, &::after {
      content: ${({ isReserved, isLocked, isUnlocking, isSelected }) => (isReserved || isLocked || (isSelected && isUnlocking)) ? '""' : 'none'}; /* 조건부로 X 표시 */

      position: absolute;
      top: calc(50%); /* 버튼 중앙에 배치 */
      left: calc(50%);

      width: 41px; /* 대각선 길이 조정 */
      height: 1px; /* 선의 두께 */
      background-color: ${({ isUnlocking }) => (isUnlocking) ? 'var(--purple-4)' : 'var(--ect-white)'}; /* 흰색 선 */
      transform-origin: center;
   }

   &::before {
     transform: translate(-50%, -50%) rotate(45deg);
   }

   &::after {
     transform: translate(-50%, -50%) rotate(-45deg);
   }
`;

const LockImage = styled.div<{ isLocked: boolean, isUnlocking: boolean, isAdmin: boolean }>`
      content: ${({ isLocked, isUnlocking }) => (isLocked || isUnlocking ? '""' : 'none')}; /* 잠금 상태일 때만 표시 */
      position: absolute;
      top: -3px; /* 버튼의 오른쪽 위로 이동 */
      right: -3px;

      width: 12px;
      height: 16px;
      border: none;
      background-image: ${({ isLocked, isAdmin }) =>
        !isAdmin ? "none" : isLocked ? `url(${lockIcon})` : "none"};
      background-size: cover; /* 이미지 크기 설정 */
      background-repeat: no-repeat; /* 이미지 반복 방지 */
      background-color: transparent;

      z-index: 2; /* 버튼 위에 표시되도록 설정 */
`;