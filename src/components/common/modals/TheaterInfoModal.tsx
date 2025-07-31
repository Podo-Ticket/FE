import React, {useState} from 'react';
import styled from 'styled-components';

import TopNav from '@components/layout/headers/TopNav';
import CloseBtn from '@components/common/buttons/SmallBtn';

import SeatMap from '@assets/images/seatMap/sapy_grayhall.png';
import VenueMap from '@assets/images/guideMap/guideMap_SAPY_Grayhall.png';
import backIcon from '@assets/images/left_arrow.png';

import {PERFORMANCE_NOTICE} from '../../../constants/text/playInfo/1st_Podo_CreativeStudio.ts';
import {fadeIn, fadeOut} from '../../../styles/animation/DefaultAnimation.ts';
import {TICKET} from '@/constants/text/UIText.ts';

interface TheaterInfoModalProps {
  showTheaterInfoModal: boolean;
  onAcceptFunc: () => void;
  pageMode?: boolean;
}

const TheaterInfoModal: React.FC<TheaterInfoModalProps> = ({
  showTheaterInfoModal,
  onAcceptFunc,
  pageMode = false,
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('1');
  const language = localStorage.getItem('language');

  if (!showTheaterInfoModal) return null;

  const handleAcceptClick = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onAcceptFunc();
    }, 300);
  };

  const renderContent = () => {
    switch (activeTab) {
      case '1':
        return (
          <SeatDescription>
            <img src={SeatMap} alt='좌석 안내' />
          </SeatDescription>
        );
      case '2':
        return (
          <VenueMapDescription>
            <img src={VenueMap} alt='공연장 지도' />
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

  const lefter = {
    icon: backIcon,
    iconWidth: 13,
    iconHeight: 20,
    text: '',
    clickFunc: onAcceptFunc,
  };

  return (
    <ModalOverlay pageMode={pageMode}>
      <ModalContent isClosing={isClosing} pageMode={pageMode}>
        <TopNav
          lefter={pageMode ? lefter : undefined}
          center={{
            text: `${
              language === 'english'
                ? TICKET.english.venueModalTitle
                : TICKET.korean.venueModalTitle
            }`,
          }}
          righter={undefined}
          customStyles={{
            borderRadius: '20px 20px 0px 0px',
            background: 'transparent',
            height: '60px',
          }}
        />

        <TabNavBar>
          <NavButton onClick={() => setActiveTab('1')} isActive={activeTab === '1'}>
            {language === 'english'
              ? TICKET.english.venueModalSeatGuide
              : TICKET.korean.venueModalSeatGuide}
          </NavButton>
          <NavButton onClick={() => setActiveTab('2')} isActive={activeTab === '2'}>
            {language === 'english' ? TICKET.english.venueModalMap : TICKET.korean.venueModalMap}
          </NavButton>
          <NavButton onClick={() => setActiveTab('3')} isActive={activeTab === '3'}>
            {language === 'english'
              ? TICKET.english.venueModalGuidelines
              : TICKET.korean.venueModalGuidelines}
          </NavButton>
          <HighlightBox activeTab={activeTab} />
        </TabNavBar>

        <RenderedContentContainer>{renderContent()}</RenderedContentContainer>

        {pageMode ? undefined : (
          <CloseBtn
            content={
              language === 'english'
                ? TICKET.english.venueModalAccpet
                : TICKET.korean.venueModalAccpet
            }
            onClick={handleAcceptClick}
            isAvailable={true}
          />
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default TheaterInfoModal;

const ModalOverlay = styled.div<{pageMode: boolean}>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${({pageMode}) => (pageMode ? 'var(--ect-white)' : 'rgba(0, 0, 0, 0.6)')};

  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 10000;
`;

const ModalContent = styled.div<{isClosing: boolean; pageMode: boolean}>`
  display: flex;
  flex-direction: column;
  ${({pageMode}) => (pageMode ? '' : 'justify-content: center')};

  align-items: center;

  width: ${({pageMode}) => (pageMode ? '100%' : '90%')};
  height: ${({pageMode}) => (pageMode ? '100%' : '90%')};
  background-color: var(--ect-white);
  border-radius: 10px;

  gap: 15px;
  padding: 25px 20px;

  animation: ${({isClosing}) => (isClosing ? fadeOut : fadeIn)} 0.4s ease-in-out;
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

const NavButton = styled.button.attrs<{isActive: boolean}>(({isActive}) => ({
  className: isActive ? 'Podo-Ticket-Headline-H6' : 'Podo-Ticket-Body-B9',
}))<{isActive: boolean}>`
  display: flex;
  justify-content: center;
  align-items: center;

  width: calc(100% / 3);
  background-color: transparent;
  color: ${({isActive}) => (isActive ? 'var(--purple-4)' : 'var(--grey-5)')};
  border: none;
  border-radius: 30px;

  padding: 5px 0;

  z-index: 2;

  transition: background-color 0.3s ease-in-out;
`;

const HighlightBox = styled.div<{activeTab: string}>`
  position: absolute;
  bottom: 4px;

  width: calc((100% / 3) - 10px); // gap 고려
  height: calc(100% - 8px); // padding(4px top + bottom) 고려

  background-color: var(--lightpurple-2);
  border: 1px solid var(--purple-7);
  border-radius: 30px;

  transform: ${({activeTab}) => {
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

  transition: transform 0.3s ease-in-out;
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
    height: 100%;
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

const PerformanceDescription = styled.div.attrs({
  className: 'Podo-Ticket-Body-B8',
})`
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
