import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import MediumBtn from '../../components/button/MediumBtn.tsx';
import MoreDetailBtn from '../../components/button/SmallMoreBtn.tsx';
import MoreBtn from '../../components/button/SmallMoreBtn.tsx';
import ReserveWayModal from '../../components/modal/ChoiceModal.tsx';
import AuthModal from '../../components/auth/PhoneAuthModal.tsx';
import Loading from '../../components/loading/Loading.tsx';

import poster from '../../assets/images/poster.jpeg'
import homeTicket from '../../assets/images/home_ticket.png'

import { fetchPlayInfo } from '../../api/user/UserHomeApi';
import { slideUp } from '../../styles/animation/DefaultAnimation.ts'
import { BASE_PERFORMANCE_INFO } from '../../constants/text/InfoText.ts'
import { DateUtil } from '../../utils/DateUtil';
import { toggleModal } from '../../utils/ModalUtil.ts'
import { useNavigateTo } from '../../utils/NavigateUtil.ts';

const UserHome: React.FC = () => {
  const navigateTo = useNavigateTo();

  const [playInfo, setPlayInfo] = useState(null);
  const [scheduleId, setScheduleId] = useState<number | 0>(0);
  const [performanceSession, setPerformanceSession] = useState<string | ''>('');

  const [modals, setModals] = useState<{ [key: string]: boolean }>({
    authModal: false,
    reserveWayModal: false,
    loading: false
  });

  //Animation modal declaration
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  // 현재 공연 정보 반영
  useEffect(() => {
    const loadPlayInfo = async () => {
      try {
        const playId = 1; // Replace with dynamic ID if needed
        const data = await fetchPlayInfo(playId);
        setPlayInfo(data.play);
        setScheduleId(data.schedule.id);
        localStorage.setItem("scheduleId", data.schedule.id);
        setPerformanceSession(data.schedule.date_time);
      } catch (error) {
        console.error('Failed to load play info:', error);
      }
    };

    loadPlayInfo();
  }, []);

  const handleAuthModalAccept = () => {
    navigateTo('/select');
  };

  const toggleFlip = () => setIsFlipped(!isFlipped);


  return (
    <MainContainer backgroundImage={poster}>
      <MainTitle className='Podo-Ticket-Headline-H3'>공연 입장을 도와드릴게요!</MainTitle>

      <PosterDetailsContainer>
        <Card isFlipped={isFlipped}>
          {/* Front Side */}
          <CardFront>

            <CardBackgroundImage src={homeTicket} alt="배경 이미지" />

            <TicketHeaderContainer>
              <Poster src={poster} alt="공연 포스터" />
              <ImageOverlay />
              <ShowDetails>
                {playInfo && (
                  <>
                    <ShowDetailsTitle className='Podo-Ticket-Headline-H1'>{playInfo.title}</ShowDetailsTitle>
                    <ShowDetailsSubtitle className='Podo-Ticket-Body-B5'>
                      {DateUtil.formatDate(performanceSession)}</ShowDetailsSubtitle>
                  </>
                )}
              </ShowDetails>
            </TicketHeaderContainer>

            <DetailContainer>
              {BASE_PERFORMANCE_INFO.map((item, index) => (
                <FrontCardInfoItem key={index}>
                  <InfoCategory className='Podo-Ticket-Body-B9'>
                    {item.category}
                  </InfoCategory>
                  <InfoContent className='Podo-Ticket-Body-B7'>
                    {item.content}
                  </InfoContent>
                </FrontCardInfoItem>
              ))}
            </DetailContainer>

            <DetailBtnContainer>
              <MoreDetailBtn
                content="자세히 보기"
                onClick={() => toggleFlip}
                isAvailable={true}
              />

              <MediumBtn
                content="티켓 발권"
                onClick={() => toggleModal('reserveWayModal', true, setModals)}
                isAvailable={true}
              />
            </DetailBtnContainer>

          </CardFront>

          {/* Back Side */}
          <CardBack>

          </CardBack>

        </Card>
      </PosterDetailsContainer>


      {/* Modals */}
      <ReserveWayModal
        showChoiceModal={modals.reserveWayModal}
        closeChoiceModal={() => toggleModal('reserveWayModal', false, setModals)}
        onFirstItemClick={() => toggleModal('authModal', true, setModals)}
        onSecondItemClick={() => navigateTo('/reserve')}
      />

      <AuthModal
        showPhoneModal={modals.authModal}
        scheduleId={scheduleId}
        onAcceptFunc={handleAuthModalAccept}
        onUnacceptFunc={() => toggleModal('authModal', false, setModals)}
      />

      <Loading showLoading={modals.loading} />

    </MainContainer>
  );
};

export default UserHome;

const MainContainer = styled.div<{ backgroundImage: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;

  height: 100%;
  padding: 0px 30px;
  background-image: ${({ backgroundImage }) => `url(${backgroundImage})`};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--background-gradient-1);
  }
`;

const MainTitle = styled.h1`
  padding: 30px 0;
  padding-top : 40px;

  z-index: 1;

  color: var(--ect-white);
`;

const PosterDetailsContainer = styled.div`
  width: 100%;
  height: 100%;

  border-radius: 20px 20px 0px 0px;

  z-index: 1;
  perspective: 1000px;

  animation: ${slideUp} 0.5s ease-out;
`;

const Card = styled.div<{ isFlipped?: boolean }>`
  position: relative;

  width: 100%;
  height: 100%;
  
  transform-style: preserve-3d;
  transition: transform 1s ease-in-out;

  ${({ isFlipped }) => isFlipped && `
    transform: rotateY(180deg);
  `}
`;

const CardFront = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: visible;

  z-index: 2;
  transform: rotateY(0deg);
  transform-style: preserve-3d;
`;

const CardBack = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;

  z-index: 1;
  transform-style: preserve-3d;
  transform: rotateY(180deg);
`;

const CardBackgroundImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 110%;
  border-radius: 20px 20px 0px 0px;
 
  z-index: 2;
`;

const TicketHeaderContainer = styled.div`
  position: relative;

  overflow: hidden;
  z-index: 2;
`;

const Poster = styled.img`
  width: 100%;
  height: 150px;

  border-radius: 20px 20px 0px 0px;
  object-fit: cover;
  object-position: center;
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: calc(100% - 5px);

  width: 100%;
  border-radius: 20px 20px 0px 0px;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ShowDetails = styled.div`
  position: absolute;
  top: calc(60%);
  left: calc(50%);
  transform: translate(-50%, -50%);

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  color: var(--ect-white);
`;

const ShowDetailsTitle = styled.div`
white-space: nowrap;    // 줄 바꿈 방지
text-align: center;
`;

const ShowDetailsSubtitle = styled.div`
white-space: nowrap;    // 줄 바꿈 방지
text-align: center;
`;

const DetailContainer = styled.div`
position: relative;
display: flex;
flex-direction: column;

padding-left : 36px;
padding-top : 35px;
padding-right: 0px;
gap : 13px;

z-index: 2;
`;

const FrontCardInfoItem = styled.div`
display: flex;
align-items: center;

gap: 16px;
`;

const InfoCategory = styled.div`
display: flex;
justify-content: center;
align-items: center;

width: 59px;
border-radius: 30px;
border: 1px solid var(--purple-9);
background: var(--ect-white);

color: var(--grey-6);
`;

const InfoContent = styled.div`
color: var(--grey-7);
`;

const DetailBtnContainer = styled.div`
position: relative;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;

margin-top: 40px;
gap: 66px;

z-index: 2;
`;