import React, {useEffect, useState, useRef} from 'react';
import styled from 'styled-components';

import MediumBtn from '@components/common/buttons/MediumBtn.tsx';
import MultiLanguageHeader from '@components/layout/headers/MultiLanguageHeader.tsx';
import lowResPoster from '../../assets/images/posters/1st_Podo_CreativeStudio_poster_lowRes.png';
import poster from '../../assets/images/posters/1st_Podo_CreativeStudio_poster.png'; // 해당 공연에 맞는 상수값 적용 필요

import {fetchPlayInfo} from '../../api/user/UserHomeApi';
import {slideUp} from '../../styles/animation/DefaultAnimation.ts';
import {DateUtil, getClosestDateTime} from '../../utils/DateUtil';
import {useNavigateTo} from '../../utils/NavigateUtil.ts';
import {USER_HOME} from '../../constants/text/UIText.ts';
import {useLanguage} from '../../hooks/useLanguage.ts';
import {Language} from '../../constants/text/Language.ts';
import ProgressiveImage from '@/components/pages/customer/userHome/ProgressiveImage.tsx';

const UserHome: React.FC = () => {
  const navigateTo = useNavigateTo();
  const {language, setLanguage} = useLanguage();

  const [playInfo, setPlayInfo] = useState<any>(null);
  const [, setScheduleId] = useState<number | 0>(0);
  const [performanceSession, setPerformanceSession] = useState<string | ''>('');

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [, setIsPopupClosing] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const [cardWidth, setCardWidth] = useState(312);

  useEffect(() => {
    const resize = () => {
      const svh = window.innerHeight * 0.926;
      const height = Math.min(svh, 597);
      const newWidth = (height * 312) / 597;
      setCardWidth(Math.min(312, newWidth));
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // 현재 공연 정보 반영
  useEffect(() => {
    const loadPlayInfo = async () => {
      try {
        const playId = 1;
        const data = await fetchPlayInfo(playId);

        const closestDateTime = getClosestDateTime(data.schedule);
        const closestSchedule = data.schedule.find(
          (schedule: {date_time: string}) => schedule.date_time === closestDateTime,
        );

        if (closestSchedule) {
          setScheduleId(closestSchedule.id);
          localStorage.setItem('scheduleId', closestSchedule.id);
        }
        localStorage.setItem('isForceLogout', 'false');
        setPlayInfo(data.play);
        setPerformanceSession(getClosestDateTime(data.schedule));
      } catch (error) {
        console.error('Failed to load play info:', error);
      }
    };

    localStorage.setItem('language', Language.Korean);
    loadPlayInfo();
  }, []);

  const toggleLanguage = () => {
    const current = localStorage.getItem('language') as Language;
    const next = current === Language.Korean ? Language.English : Language.Korean;
    localStorage.setItem('language', next);
    setLanguage(next);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsPopupClosing(true);
        setTimeout(() => {
          setIsPopupVisible(false);
          setIsPopupClosing(false);
        }, 250);
      }
    };

    if (isPopupVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPopupVisible]);

  return (
    <MainContainer backgroundImage={poster}>
      <PosterDetailsContainer cardWidth={cardWidth}>
        <MultiLanguageHeader clickLanguage={toggleLanguage} />
        <CardFront>
          <CardBackGround />

          <ProgressiveImage
            lowResSrc={lowResPoster}
            highResSrc={poster}
            alt='공연 포스터'
            style={{borderRadius: '8px'}}
          />

          <TicketBottomContainer>
            <ShowDetails>
              {playInfo && (
                <>
                  <ShowDetailsTitle className='Podo-Ticket-Headline-H3'>
                    {language === Language.English ? playInfo.en_title : playInfo.title}
                  </ShowDetailsTitle>
                  <ShowDetailsSubtitle className='Podo-Ticket-Body-B5'>
                    <Subtitle className='Podo-Ticket-Body-B9'>
                      {language === Language.English
                        ? USER_HOME.english.time
                        : USER_HOME.korean.time}
                    </Subtitle>
                    <SubContents className='Podo-Ticket-Body-B7'>
                      {' '}
                      {DateUtil.formatDate(performanceSession, language)}
                    </SubContents>
                  </ShowDetailsSubtitle>
                </>
              )}
            </ShowDetails>

            <DetailBtnContainer>
              <GetTicketBtn
                content={
                  language === Language.English
                    ? USER_HOME.english.pickupBtn
                    : USER_HOME.korean.pickupBtn
                }
                onClick={() => navigateTo('/issue-ticket')}
                isAvailable={true}
              />
            </DetailBtnContainer>
          </TicketBottomContainer>
        </CardFront>
      </PosterDetailsContainer>
    </MainContainer>
  );
};

export default UserHome;
const MainContainer = styled.div<{backgroundImage: string}>`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;
  height: 100svh;

  background-image: ${({backgroundImage}) => `url(${backgroundImage})`};
  background-size: cover;
  background-position: center;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--background-gradation-main);
  }
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
  }
`;

const PosterDetailsContainer = styled.div<{cardWidth: number}>`
  @media (max-height: 645px) {
    height: 100svh;
    width: ${({cardWidth}) => `${cardWidth}px`};
  }

  @media (min-height: 646px) {
    min-width: 312px;
    min-height: 645px;
  }

  max-width: 312px;
  z-index: 100000;
  height: 90.3svh;
  max-height: 645px;

  animation: ${slideUp} 0.5s ease-out;

  margin: auto;
`;

const CardFront = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 92.6%;
  position: relative;
  border-radius: 20px;
  margin-top: 3.7%;
  -webkit-mask-image:
    radial-gradient(circle at left 73.9%, transparent 15px, black 15px),
    radial-gradient(circle at right 73.9%, transparent 15px, black 15px),
    linear-gradient(white, white);
  -webkit-mask-composite: destination-out;
  -webkit-mask-repeat: no-repeat;

  mask-image:
    radial-gradient(circle at left 73.9%, transparent 4.5%, black 4.5%),
    radial-gradient(circle at right 73.9%, transparent4.5%, black 4.5%),
    linear-gradient(white, white);
  mask-composite: exclude;
  mask-repeat: no-repeat;
`;

const CardBackGround = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: white;
  border-radius: 20px;
`;

const TicketBottomContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 26.1%;
  z-index: 1;

  justify-content: center;
  gap: 8.3%;
`;

const ShowDetails = styled.div`
  display: flex;
  flex-direction: column;

  gap: 15.3%;
`;

const ShowDetailsTitle = styled.div`
  white-space: nowrap; // 줄 바꿈 방지
  text-align: center;
`;

const ShowDetailsSubtitle = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;

  justify-content: center;

  white-space: nowrap; // 줄 바꿈 방지
  color: var(--grey-grey7);
`;

const Subtitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border: 1px solid var(--grey-grey-3, #e2e2e2);
  color: var(--grey-grey-6, #777);

  padding: 0 3.7%;
  border-radius: 30px;
`;

const SubContents = styled.span`
  color: var(--grey-7);
  display: flex;
  align-items: center;
`;

const DetailBtnContainer = styled.div`
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 2;
`;

const GetTicketBtn = styled(MediumBtn)``;
