import React, { useState } from 'react';
import styled from 'styled-components';

import TopNav from '../nav/TopNav';
import SeatMap from '../../assets/images/seat_map.png';
import VenueMap from '../../assets/images/venue_map.png';
import CloseBtn from '../button/SmallBtn';

import { PERFORMANCE_NOTICE } from '../../constants/venue/KwangwoonUniv'
import { fadeIn, fadeOut } from '../../styles/animation/DefaultAnimation.ts'

// Props 타입 정의
interface TheaterInfoModalProps {
  showTheaterInfoModal: boolean; // 모달 열림 여부
  onAcceptFunc: () => void;
}

const TheaterInfoModal: React.FC<TheaterInfoModalProps> = ({ showTheaterInfoModal, onAcceptFunc }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('1'); // 활성화된 탭 상태

  if (!showTheaterInfoModal) return null;

  const handleAcceptClick = () => {
    setIsClosing(true); // 페이드아웃 애니메이션 시작
    setTimeout(() => {
      setIsClosing(false); // 상태 초기화
      onAcceptFunc(); // 애니메이션 종료 후 닫기 함수 호출
    }, 300); // 애니메이션 시간과 동일하게 설정
  };

  const renderContent = () => {
    switch (activeTab) {
      case '1':
        return (
          <SeatDescription>
            <img src={SeatMap} alt="좌석 안내" />
          </SeatDescription>
        );
      case '2':
        return (
          <VenueMapDescription>
            <img src={VenueMap} alt="공연장 지도" />
          </VenueMapDescription>
        );
      case '3':
        return (
          <PerformanceDescription>
            {PERFORMANCE_NOTICE.map((notice, index) => (
              <p key={index}>{notice}</p>
            ))}
          </PerformanceDescription>
        );
      default:
        return null;
    }
  };

  return (
    <ModalOverlay>
      <ModalContent isClosing={isClosing}>
        <TopNav lefter={null} center={{ text: "공연장 정보" }} righter={null} customStyles={{
          borderRadius: "20px 20px 0px 0px",
          background: "transparent",
          height: "60px"
        }} />

        {/* 탭 네비게이션 */}
        <TabNavBar>
          <NavButton onClick={() => setActiveTab('1')} isActive={activeTab === '1'}>
            좌석 안내
          </NavButton>
          <NavButton onClick={() => setActiveTab('2')} isActive={activeTab === '2'}>
            공연장 지도
          </NavButton>
          <NavButton onClick={() => setActiveTab('3')} isActive={activeTab === '3'}>
            공연 유의사항
          </NavButton>
          <HighlightBox activeTab={activeTab} />
        </TabNavBar>

        <RenderedContentContainer>
          {renderContent()}
        </RenderedContentContainer>

        <CloseBtn content="닫기" onClick={handleAcceptClick} isAvailable={true} />
      </ModalContent>
    </ModalOverlay>
  );
};

export default TheaterInfoModal;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);

  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 10000;
`;

const ModalContent = styled.div<{ isClosing: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 90%;
  height: 90%;
  background-color: var(--ect-white);
  border-radius: 10px;
  
  gap: 15px;
  padding: 25px 20px;

  animation: ${({ isClosing }) => (isClosing ? fadeOut : fadeIn)} 0.4s ease-in-out;
`;

const TabNavBar = styled.div`
  position: relative;

  display: flex;
  justify-content: space-between;
  align-items: center;

  width: 100%;
  border-radius: 30px;
  background: var(--grey-2);

  gap: 10px;
  padding: 4px 7px;
`;

const NavButton = styled.button.attrs<{ isActive: boolean }>(({ isActive }) => ({
  className: isActive ? 'Podo-Ticket-Headline-H6' : 'Podo-Ticket-Body-B9',
})) <{ isActive: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;

  width: calc(100% / 3);
  background-color: transparent;
  color: ${({ isActive }) => (isActive ? 'var(--purple-4)' : 'var(--grey-5)')};
  border: none;
  border-radius: 30px;

  padding: 5px 0;

  z-index: 2;
  
  transition: background-color 0.3s ease-in-out;
`;

const HighlightBox = styled.div<{ activeTab: string }>`
  position: absolute;
  bottom: 4px;
  
  width: calc((100% / 3) - 10px); // gap 고려
  height: calc(100% - 8px); // padding(4px top + bottom) 고려
  
  background-color: var(--lightpurple-2);
  border: 1px solid var(--purple-7);
  border-radius: 30px;

  transform: ${({ activeTab }) => {
    switch (activeTab) {
      case '1':
        return 'translateX(0%)'; // 첫 번째 탭
      case '2':
        return 'translateX(calc(100% + 7px))'; // 두 번째 탭 (gap 포함)
      case '3':
        return 'translateX(calc(200% + 16px))'; // 세 번째 탭 (gap 포함)
      default:
        return 'translateX(0%)';
    }
  }};
  
  transition: transform 0.3s ease-in-out; /* 부드러운 이동 애니메이션 */
`;

const RenderedContentContainer = styled.div`
  display: flex;

  width: 100%;
  height: 80%;

  border-radius: 10px;
  border: 1px solid var(--grey-3);
  background: var(--ect-white);

  padding-right: 10px;

  overflow: auto; 
`;

const SeatDescription = styled.div`
  height: 100%; 

  padding: 5px;
  
  img {
    max-height: 100%;
    object-fit: contain; /* 이미지 비율 유지 */
    margin-top: 20px;
  }
`;

const VenueMapDescription = styled.div`
  height: 100%; 

  padding: 5px;
  
  img {
    max-height: 100%;
    object-fit: contain; /* 이미지 비율 유지 */
    margin-top: 20px;
  }
`;

const PerformanceDescription = styled.div.attrs({ className: 'Podo-Ticket-Body-B8' })`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  gap: 10px;
  padding: 8px 10px;

  & > br {
    margin-bottom: 30px; /* 줄 간격 조정 */
  }
`;