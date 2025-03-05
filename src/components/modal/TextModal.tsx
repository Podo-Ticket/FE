import React, { useState } from 'react'
import styled from 'styled-components';

import OkayBtn from '../button/SmallBtn'

import { fadeIn, fadeOut } from '../../styles/animation/DefaultAnimation.ts'

interface TextModalProps {
  showTextModal: boolean;
  onAcceptFunc: () => void;
  title: string;
  description: string;
  overlaied?: boolean;
}

const TextModal: React.FC<TextModalProps> = ({ showTextModal, onAcceptFunc, title, description, overlaied = false }) => {
  const [isClosing, setIsClosing] = useState(false);

  if (!showTextModal) return null;

  const handleAcceptClick = () => {
    setIsClosing(true); // 페이드아웃 애니메이션 시작
    setTimeout(() => {
      setIsClosing(false); // 상태 초기화
      onAcceptFunc(); // 애니메이션 종료 후 닫기 함수 호출
    }, 300); // 애니메이션 시간과 동일하게 설정
  };

  return (
    <ModalOverlay overlaied={overlaied}>
      <ModalContent isClosing={isClosing}>
        <HeadText className='Podo-Ticket-Headline-H2'>{title}</HeadText>
        <ContentPrivacy className='Podo-Ticket-Body-B8'>{description}</ContentPrivacy>
        <OkayBtn content="확인" onClick={handleAcceptClick} isAvailable={true} />
      </ModalContent>
    </ModalOverlay>
  );
};

export default TextModal;

const ModalOverlay = styled.div<{ overlaied: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  z-index: 1000;

  width: 100%;
  height: 100%;
  background: ${({ overlaied }) => (overlaied ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.0)')};
`;

const ModalContent = styled.div<{ isClosing: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 90%;

  background: var(--ect-white);
  border-radius: 10px;
  padding: 30px 22px;

  text-align: center;

  animation: ${({ isClosing }) => (isClosing ? fadeOut : fadeIn)} 0.4s ease-in-out;
`;

const HeadText = styled.span`
  margin-bottom: 20px;
  color: var(--charcoal-black);
`;

const ContentPrivacy = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;

  height: 145px;
  border-radius: 10px;
  background-color: var(--grey-2);

  margin-bottom: 23px;
  padding: 10px;
  padding-right: 20px;
  
  color: var(--grey-6);

  overflow-y: auto;
`;

