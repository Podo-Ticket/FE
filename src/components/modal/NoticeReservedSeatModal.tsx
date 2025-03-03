import React, { useState } from 'react';
import styled from 'styled-components';

import ModalSmallBtn from '../button/ModalSmallBtn.tsx';

import { fadeIn, fadeOut } from '../../styles/animation/DefaultAnimation.ts'

interface NoticeReservedSeatModalProps {
  showNoticeReservedSeatModal: boolean;
  onAcceptFunc: () => void;
  onUnacceptFunc: () => void;
  noOverlay?: boolean;
}

const NoticeReservedSeatModal: React.FC<NoticeReservedSeatModalProps> = ({ showNoticeReservedSeatModal, onAcceptFunc, onUnacceptFunc, noOverlay = false }) => {
  const [isClosing, setIsClosing] = useState(false);

  if (!showNoticeReservedSeatModal) return null;

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
      <Content isClosing={isClosing}>
        <TitleContainer>
          <Title className='Podo-Ticket-Headline-H3'><span style={{ color: 'var(--purple-4)' }}>이미 발권된 좌석</span>이 포함되었습니다.</Title>
          <Title className='Podo-Ticket-Headline-H3'>나머지 회차 좌석을 잠그시겠습니까?</Title>
        </TitleContainer>

        <DescriptioncContainer>
          <Description className='Podo-Ticket-Body-B5'>이미 발권된 좌석 정보를 확인해보세요.</Description>
          <ReservedSeatsContainer>
            <SessionReservedSeats>
              <SessionInfo>
                <CategoryContainer><Category>시간</Category></CategoryContainer>
                <Detail>2024.10.09 (일) 17:00</Detail>
              </SessionInfo>
              <SessionInfo>
              <CategoryContainer><Category>좌석</Category></CategoryContainer>
                <Detail>다8, 다9, 다10</Detail>
              </SessionInfo>
            </SessionReservedSeats>
          </ReservedSeatsContainer>
        </DescriptioncContainer>

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

export default NoticeReservedSeatModal;

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

const Content = styled.div<{ isClosing: boolean }>`
  display: flex;
  justify-content: center;
  flex-direction: column;

  width: 90%;
  background: var(--ect-white);
  border-radius: 10px;

  padding: 25px 21px;
  padding-top: 30px;

  text-align: center;

  animation: ${({ isClosing }) => (isClosing ? fadeOut : fadeIn)} 0.4s ease-in-out;
`;

const Title = styled.h2`
  color: var(--grey-7);
`;

const Description = styled.span`
  color: var(--grey-5);
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;

  margin-top: 20px;

  gap: 11px;
`;

const TitleContainer = styled.div` 
  display: flex;
  flex-direction: column;

  gap: 5px;
  margin-bottom: 15px;
`;

const DescriptioncContainer = styled.div`
  display: flex;
  flex-direction: column;

  gap: 5px;
`;

const ReservedSeatsContainer = styled.div`
  display: flex;

  border-radius: 10px;
  background: var(--grey-2);

  padding: 10px;
`;

const SessionReservedSeats = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  width: 100%;

  gap: 10px;
`;

const SessionInfo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

`;

const CategoryContainer = styled.div`
  display: flex;
  flex-grow: 1;
`;


const Category = styled.div.attrs({ className: "Podo-Ticket-Body-B9" })`
border-radius: 30px;
border: 1px solid var(--grey-3);
background: var(--ect-white);

padding: 0px 10px;

color: var(--grey-6);
`;

const Detail = styled.div.attrs({ className: "Podo-Ticket-Body-B7" })`
color: var(--grey-7);
`;