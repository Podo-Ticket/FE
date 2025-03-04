import React, { useState } from 'react';
import styled from 'styled-components';

import SmallBtn from '../button/SmallBtn.tsx';

import successImage from '../../assets/images/check_icon.png';
import dangerImage from '../../assets/images/purple_danger.png';

import { fadeIn, fadeOut } from '../../styles/animation/DefaultAnimation.ts'

interface NoticeModalProps {
  showNoticeModal: boolean;
  imgStatus?: 'success' | 'danger' | null;
  title: string;
  description: string;
  onAcceptFunc: () => void;
  buttonContent?: string;
}

const NoticeModal: React.FC<NoticeModalProps> = ({ showNoticeModal, imgStatus, title, description, onAcceptFunc, buttonContent = "" }) => {
  const [isClosing, setIsClosing] = useState(false);

  if (!showNoticeModal && !isClosing) return null;

  const handleOverlayClick = () => {
    setIsClosing(true); // 페이드아웃 애니메이션 시작
    setTimeout(() => {
      setIsClosing(false); // 상태 초기화
      onAcceptFunc(); // 애니메이션 종료 후 닫기 함수 호출
    }, 300); // 애니메이션 시간과 동일하게 설정
  };

  // 이미지 경로 선택
  const getImageSrc = () => {
    switch (imgStatus) {
      case 'success':
        return successImage;
      case 'danger':
        return dangerImage;
      default:
        return null;
    }
  };
  const imageSrc = getImageSrc();

  return (
    <Overlay onClick={handleOverlayClick}>
      <Content isClosing={isClosing}>
        {imageSrc && <ContentImage src={imageSrc} alt={imgStatus || ''} />}
        <Title className='Podo-Ticket-Headline-H3'>{title}</Title>
        <Description className='Podo-Ticket-Body-B5'>{description}</Description>
        <ButtonContainer>
          <SmallBtn
            content={buttonContent}
            onClick={onAcceptFunc}
            isAvailable={true}
            isGray={true}
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 22.0625rem;
  background-color: var(--ect-white);
  border-radius: 10px;

  gap: 5px;
  padding: 25px;

  text-align: center;

  animation: ${({ isClosing }) => (isClosing ? fadeOut : fadeIn)} 0.4s ease-in-out;
`;

const ContentImage = styled.img`
 width: 44px;
 height: 44px;

 margin-bottom: 10px;
`;

const Title = styled.div`
  color: var(--grey-7);
`;

const Description = styled.span`
  margin-bottom: 11px;

  color: var(--grey-5);
`;

const ButtonContainer = styled.div`
  display: flex;
`;