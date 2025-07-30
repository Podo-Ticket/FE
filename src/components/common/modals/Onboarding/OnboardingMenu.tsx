// src/components/common/Modal.tsx
import React from 'react';
import styled from 'styled-components';

interface ModalProps {
  setMenu: (menu: string) => void;
}

const OnboardingMenu: React.FC<ModalProps> = ({setMenu}) => {
  // Portal을 사용하여 body에 직접 렌더링

  console.log('모달 열림');
  return (
    <ModalContentWrapper>
      <ModalTitle>
        <ModalDescription className='Podo-Ticket-Headline-H3'>
          <p style={{color: ' var(--purple-4)'}}>어떤 기능</p>이 궁금하신가요?
        </ModalDescription>
        <ModalSubDescription className='Podo-Ticket-Body-B5'>
          포도티켓의 주요 기능에 대해 소개해드릴게요!
        </ModalSubDescription>
      </ModalTitle>
      <ButtonGroup>
        <StyledButton
          onClick={() => {
            setMenu('실시간 좌석 현황');
          }}
          className='Podo-Ticket-Headline-H5 '
        >
          실시간 좌석 현황
        </StyledButton>
        <StyledButton
          onClick={() => {
            setMenu('좌석 잠금/해제');
          }}
          className='Podo-Ticket-Headline-H5 '
        >
          좌석 잠금/해제
        </StyledButton>
        <StyledButton
          onClick={() => {
            setMenu('예매 명단 관리');
          }}
          className='Podo-Ticket-Headline-H5 '
        >
          예매 명단 관리
        </StyledButton>
        <StyledButton
          onClick={() => {
            setMenu('현장 예약 요청');
          }}
          className='Podo-Ticket-Headline-H5 '
        >
          현장 예약 요청
        </StyledButton>
      </ButtonGroup>
    </ModalContentWrapper>
  );
};

export default OnboardingMenu;

const ModalContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4.5svh;
  padding-top: 6.8%;
  align-items: center;
`;

const ModalTitle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 5px;
`;

const ModalDescription = styled.p`
  display: flex;

  color: #666;
`;

const ModalSubDescription = styled.p`
  color: var(--grey-5);
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.24svh;
`;

const StyledButton = styled.button`
  border: none;
  background-color: white;
  border-radius: 10px;
  background: var(--grey-grey-2, #f2f2f2);
  cursor: pointer;

  width: 74.6vw;
  aspect-ratio: 293 / 51;

  color: var(--grey-6);

  &:hover {
    background-color: #f0f0f0;
  }

  &:active {
    border: 1px solid var(--purple-purple-7, #b489ff);
    background: var(--lightpurple-2);
  }
`;
