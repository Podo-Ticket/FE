import React from "react";
import styled from "styled-components";

interface SmallBtnProps {
  content: string; // 버튼 안 내용
  onClick: () => void; // 온 클릭 함수
  isAvailable: boolean; // 버튼 동작 여부
  isDarkblue?: boolean; // 남색 버튼 여부
}

const ModalSmallBtn: React.FC<SmallBtnProps> = ({
  content,
  onClick,
  isAvailable,
  isDarkblue = false,
}) => {
  return (
    <ModalSmallBtnContainer
      className="Podo-Ticket-Body-B4"
      onClick={onClick}
      disabled={!isAvailable}
      isAvailable={isAvailable}
      isDarkblue={isDarkblue}
    >
      {content}
    </ModalSmallBtnContainer>
  );
};

export default ModalSmallBtn;

const ModalSmallBtnContainer = styled.button<{
  isAvailable: boolean;
  isDarkblue: boolean;
}>`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 9.375rem;
  height: 2.875rem;

  padding: 11px 48px;
  border-radius: 15px;
  background: ${({ isAvailable, isDarkblue }) =>
    isDarkblue
      ? "var(--grey-3)"
      : isAvailable
      ? "var(--purple-4)"
      : "var(--purple-9)"};
  border: none;

  gap: 10px;

  color: ${({ isAvailable, isDarkblue }) =>
    isDarkblue
      ? "var(--grey-6)"
      : isAvailable
      ? "var(--ect-white)"
      : "var(--ect-white)"};
  text-align: center;

  transition: background 0.3s ease-in-out;

  user-select: none; /* 텍스트 선택 방지 */
  -webkit-user-select: none; /* Safari에서 드래그 방지 */
  -moz-user-select: none; /* Firefox에서 드래그 방지 */
  -ms-user-select: none;
`;
