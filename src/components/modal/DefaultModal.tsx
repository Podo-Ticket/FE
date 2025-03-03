import React, { useState } from 'react';
import styled from 'styled-components';

import ModalSmallBtn from '../button/ModalSmallBtn.tsx';

import { fadeIn, fadeOut } from '../../styles/animation/DefaultAnimation.ts'

interface DefaultModalProps {
  showDefaultModal: boolean;
  title: string;
  description: string;
  onAcceptFunc: () => void;
  onUnacceptFunc: () => void;
  noOverlay?: boolean;
}

const DefaultModal: React.FC<DefaultModalProps> = ({ showDefaultModal, title, description, onAcceptFunc, onUnacceptFunc, noOverlay = false }) => {
  const [isClosing, setIsClosing] = useState(false);

  if (!showDefaultModal) return null;

  const handleUnacceptClick = () => {
    setIsClosing(true); // 페이드아웃 애니메이션 시작
    setTimeout(() => {
      setIsClosing(false); // 상태 초기화
      onUnacceptFunc(); // 애니메이션 종료 후 닫기 함수 호출
    }, 300); // 애니메이션 시간과 동일하게 설정
  };

  const handleAcceptClick = () => {
    setIsClosing(true); // 페이드아웃 애니메이션 시작
    setTimeout(() => {
      setIsClosing(false); // 상태 초기화
      onAcceptFunc(); // 애니메이션 종료 후 닫기 함수 호출
    }, 300); // 애니메이션 시간과 동일하게 설정
  };

  return (
    <Overlay noOverlay={noOverlay}>
      <Content isClosing={isClosing} isExpand={description === ''}>
        <Title className='Podo-Ticket-Headline-H3'>{title}</Title>
        {description === '' ? undefined :
          <Description className='Podo-Ticket-Body-B5'>{description}</Description>
        }

        <ButtonContainer>
          <ModalSmallBtn
            content="취소"
            onClick={handleUnacceptClick}
            isAvailable={true}
            isDarkblue={true}
          />
          <ModalSmallBtn
            content="확인"
            onClick={onAcceptFunc}
            isAvailable={true}
            isDarkblue={false}
          />
        </ButtonContainer>
      </Content>
    </Overlay>
  );
};

export default DefaultModal;

const Overlay = styled.div<{ noOverlay: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ noOverlay }) => (noOverlay ? 'rgba(0, 0, 0, 0.0)' : 'rgba(0, 0, 0, 0.6)')};

  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
`;

const Content = styled.div<{ isClosing: boolean, isExpand: boolean }>`
  display: flex;
  justify-content: center;
  flex-direction: column;

  width: 20.1875rem;
  background: var(--ect-white);
  border-radius: 10px;

  padding: ${({ isExpand }) => (isExpand ? 35 : 25)}px 21px;
  padding-top: 30px;

  text-align: center;

  animation: ${({ isClosing }) => (isClosing ? fadeOut : fadeIn)} 0.4s ease-in-out;
`;

const Title = styled.h2`
  margin-bottom: 10px;

  color: var(--grey-7);
`;

const Description = styled.span`
  color: var(--grey-5);
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;

  margin-top: 20px;

  gap: 8px;
`;