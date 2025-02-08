import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

import MediumBtn from '../button/MediumBtn.tsx';

import { fadeIn, fadeOut } from '../../styles/animation/DefaultAnimation.ts'

interface NoticeModalProps {
  showNoticeModal: boolean;
  title: string;
  description: string;
  onAcceptFunc: () => void;
}

const NoticeModal: React.FC<NoticeModalProps> = ({ showNoticeModal, title, description, onAcceptFunc }) => {
  const [isClosing, setIsClosing] = useState(false);

  if (!showNoticeModal && !isClosing) return null;

  const handleOverlayClick = () => {
    setIsClosing(true); // 페이드아웃 애니메이션 시작
    setTimeout(() => {
      setIsClosing(false); // 상태 초기화
      onAcceptFunc(); // 애니메이션 종료 후 닫기 함수 호출
    }, 300); // 애니메이션 시간과 동일하게 설정
  };

  return (
    <Overlay onClick={handleOverlayClick}>
      <Content isClosing={isClosing}>
        <Title className='title-sm-300'>{title}</Title>
        <Description className='caption-md-300'>{description}</Description>
        <ButtonContainer>
          <MediumBtn
            content="확인"
            onClick={onAcceptFunc}
            isAvailable={true}
          />
        </ButtonContainer>
      </Content>
    </Overlay>
  );
};

export default NoticeModal;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
`;

const Content = styled.div <{ isClosing: boolean }>`
  width: 20.1875rem;
  background-color: var(--gray-0);
  border-radius: 10px;

  padding: 25px;

  text-align: center;

  animation: ${({ isClosing }) => (isClosing ? fadeOut : fadeIn)} 0.4s ease-in-out;
`;

const Title = styled.div`
  margin-bottom: 10px;

  color: var(--gray-80);
`;

const Description = styled.span`
  color: var(--gray-80);

  margin-bottom: 20px;
`;

const ButtonContainer = styled.div`
  margin-top: 20px;
  display: flex;
`;