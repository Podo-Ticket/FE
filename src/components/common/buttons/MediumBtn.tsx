import React from 'react';
import styled from 'styled-components';

interface MediumBtnProps {
  content: string; // 버튼 안 내용
  onClick: () => void; // 온 클릭 함수
  isAvailable: boolean; // 버튼 동작 여부
  isGray?: boolean;
}

const MediumBtn: React.FC<MediumBtnProps> = ({content, onClick, isAvailable, isGray = false}) => {
  return (
    <MediumBtnContainer
      className='Podo-Ticket-Body-B2'
      onClick={onClick}
      disabled={!isAvailable}
      isAvailable={isAvailable}
      isGray={isGray}
    >
      {content}
    </MediumBtnContainer>
  );
};

export default MediumBtn;

const MediumBtnContainer = styled.button<{
  isAvailable: boolean;
  isGray: boolean;
}>`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 88.8%;
  height: 8.32svh;
  max-height: 55px;
  padding: 15px 0px;
  border-radius: 10px;
  border: none;
  background: ${({isAvailable, isGray}) =>
    isGray ? 'var(--grey-3)' : isAvailable ? 'var(--purple-4)' : 'var(--purple-9)'};

  gap: 6px;

  color: ${({isAvailable, isGray}) =>
    isGray && !isAvailable
      ? 'var(--grey-4)'
      : isGray
        ? 'var(--grey-6)'
        : isAvailable
          ? 'var(--ect-white)'
          : 'var(--ect-white)'};
  text-align: center;

  transition: background 0.3s ease-in-out;

  user-select: none; /* 텍스트 선택 방지 */
  -webkit-user-select: none; /* Safari에서 드래그 방지 */
  -moz-user-select: none; /* Firefox에서 드래그 방지 */
  -ms-user-select: none;
`;
