import React from "react";
import styled from "styled-components";

interface TicketCarouselProps {
    content: string;        // 버튼 안 내용
    onClick: () => void;        // 온 클릭 함수
    isAvailable: boolean;       // 버튼 동작 여부
}

const TicketCarousel: React.FC<TicketCarouselProps>  = ({ content, onClick, isAvailable }) => {
  return (
    <TicketCarouselContainer
      className="Podo-Ticket-Body-B2"
      onClick={onClick}
      disabled={!isAvailable}
      isAvailable={isAvailable}
    >
      {content}
    </TicketCarouselContainer>
  );
};

export default TicketCarousel;

const TicketCarouselContainer = styled.button<{ isAvailable: boolean }>`
  width: 16.3125rem;
  height: 3.4375rem;

  padding: 15px 0px;
  border-radius: 15px;
  border: 1px solid
    ${({ isAvailable }) =>
      isAvailable ? "var(--purple-4)" : "var(--purple-9)"};
  background: ${({ isAvailable }) =>
    isAvailable ? "var(--purple-4)" : "var(--purple-9)"};

  gap: 6px;

  color: var(--ect-white);
  text-align: center;

  user-select: none; /* 텍스트 선택 방지 */
  -webkit-user-select: none; /* Safari에서 드래그 방지 */
  -moz-user-select: none; /* Firefox에서 드래그 방지 */
  -ms-user-select: none;
`;