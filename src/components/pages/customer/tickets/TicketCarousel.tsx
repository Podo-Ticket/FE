import React, {useState} from 'react';
import styled from 'styled-components';

import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';

import TicketBackground from '@assets/images/ticket_background.svg?react';
import poster from '@/assets/images/posters/1st_Podo_CreativeStudio_poster.png'; // 해당 공연에 맞는 상수값 적용 필요
import {Language} from '@/constants/text/Language';

import {splitDateTime} from '../../../../utils/DateUtil';
import {TICKET} from '@/constants/text/UIText';
interface Ticket {
  id: string;
  title: string;
  en_title: string;
  en_location: string;
  location: string;
  dateTime: string;
  seat: string;
  runningTime: number;
  image: string;
  onsite: boolean;
}

interface TicketCarouselProps {
  ticketCount: number;
  onActiveIndexChange: (index: number) => void;
  currentTicketInfo: Ticket;
  isOnSite: boolean;
}

const TicketCarousel: React.FC<TicketCarouselProps> = ({
  ticketCount,
  onActiveIndexChange,
  currentTicketInfo,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const language =
    localStorage.getItem('language') === 'english' ? Language.English : Language.Korean;

  const handleSlideChange = (swiper: any) => {
    const newIndex = swiper.activeIndex;
    setActiveIndex(newIndex);
    onActiveIndexChange(newIndex);
  };

  if (!currentTicketInfo) return null;

  const result = splitDateTime(currentTicketInfo.dateTime, language);

  return (
    <TicketCarouselContainer>
      <TicketSwiper
        slidesPerView={1.4}
        spaceBetween={25}
        centeredSlides={true}
        pagination={{
          clickable: true,
        }}
        onSlideChange={handleSlideChange}
      >
        {Array.from({length: ticketCount}, (_, index) => (
          <TicketSwiperSlide
            key={index}
            className={index === activeIndex ? 'active-slide' : 'inactive-slide'}
          >
            <TicketCellBackground>
              <TicketBackground width='100%' height='100%' preserveAspectRatio='none' />
            </TicketCellBackground>

            <TicketHeaderContainer>
              <Poster src={poster} alt='공연 포스터' />
              {/* 현장예매/사전예매 태그 */}
              {/* {isOnSite ? (
                <ReservationTag
                  className="Podo-Ticket-Body-B12"
                  style={{
                    border: "1px solid var(--grey-1)",
                    background: "var(--grey-5)",
                    color: "var(--ect-white)",
                  }}
                >
                  {language === "english"
                    ? TICKET.english.onSiteReservation
                    : TICKET.korean.onSiteReservation}
                </ReservationTag>
              ) : (
                <ReservationTag
                  className="Podo-Ticket-Body-B12"
                  style={{
                    border: "1px solid var(--purple-7)",
                    background:
                      "var(--Podo-Ticket-chip-light-purple02, #F5F4FF)",
                    color: "var(--purple-4-main)",
                  }}
                >
                  {language === "english"
                    ? TICKET.english.advanceReservation
                    : TICKET.korean.advanceReservation}
                </ReservationTag>
              )} */}
            </TicketHeaderContainer>

            <TicketInformation>
              <Information>
                <TopContent>
                  <ContentItem>
                    <Category>
                      {language === 'english'
                        ? TICKET.english.performanceTitle
                        : TICKET.korean.performanceTitle}
                    </Category>
                    <PlayTitle>
                      {' '}
                      {language === 'english'
                        ? currentTicketInfo.en_title
                        : currentTicketInfo.title}
                    </PlayTitle>
                  </ContentItem>
                </TopContent>

                <MiddleContent>
                  <MiddleLeftContent>
                    <ContentItem>
                      <Category>
                        {language === 'english'
                          ? TICKET.english.performanceDate
                          : TICKET.korean.performanceDate}
                      </Category>
                      <Description>{result?.date}</Description>
                    </ContentItem>

                    <ContentItem>
                      <Category>
                        {language === 'english' ? TICKET.english.venue : TICKET.korean.venue}
                      </Category>
                      <Description>
                        {' '}
                        {language === 'english'
                          ? currentTicketInfo.en_location
                          : currentTicketInfo.location}
                      </Description>
                    </ContentItem>
                  </MiddleLeftContent>
                  <MiddleRightContent>
                    <ContentItem>
                      <Category>
                        {language === 'english'
                          ? TICKET.english.startTime
                          : TICKET.korean.startTime}
                      </Category>
                      <Description>{result?.time}</Description>
                    </ContentItem>
                    <ContentItem>
                      <Category>
                        {language === 'english'
                          ? TICKET.english.runningTime
                          : TICKET.korean.runningTime}
                      </Category>
                      <Description>
                        {currentTicketInfo.runningTime}{' '}
                        {language === 'english' ? TICKET.english.minutes : TICKET.korean.minutes}
                      </Description>
                    </ContentItem>
                  </MiddleRightContent>
                </MiddleContent>
              </Information>

              <BottomContent>
                <Category>
                  {' '}
                  {language === 'english' ? TICKET.english.seatNumber : TICKET.korean.seatNumber}
                </Category>
                <CurrentSeat>{currentTicketInfo.seat}</CurrentSeat>
              </BottomContent>
            </TicketInformation>
          </TicketSwiperSlide>
        ))}
      </TicketSwiper>
    </TicketCarouselContainer>
  );
};

export default TicketCarousel;

const TicketCarouselContainer = styled.div`
  width: auto;

  height: 100%;
  background: transparent;

  text-align: center;

  user-select: none; /* 텍스트 선택 방지 */
  -webkit-user-select: none; /* Safari에서 드래그 방지 */
  -moz-user-select: none; /* Firefox에서 드래그 방지 */
  -ms-user-select: none;
`;

const TicketSwiper = styled(Swiper)`
  width: 100%;
  height: 100%;

  .active-slide {
    opacity: 1;
    box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
    transition:
      box-shadow 0.3s ease-in-out,
      opacity 0.3s ease-in-out;
  }

  .inactive-slide {
    opacity: 0.5;
    box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
    transition:
      box-shadow 0.3s ease-in-out,
      opacity 0.3s ease-in-out;
  }
`;

const TicketSwiperSlide = styled(SwiperSlide)`
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100%;
  border-radius: 20px;

  overflow: hidden;
`;

const TicketCellBackground = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;

  width: 100%;
  height: 100%;

  border-radius: inherit;

  transition:
    width 0.3s ease-in-out,
    height 0.3s ease-in-out;

  z-index: 2;
`;

const TicketHeaderContainer = styled.div`
  position: relative;
  display: flex;

  width: calc(100%);
  height: 28.6%;

  overflow: hidden;
  z-index: 2;
`;

const Poster = styled.img`
  width: 100%; // 티켓 보라색 테두리 고려
  height: calc(100%); // 티켓 보라색 테두리 고려
  border-top: 1px solid var(--purple-7);
  border-right: 1px solid var(--purple-7);
  border-left: 1px solid var(--purple-7);
  border-radius: 20px 20px 0 0;
  object-fit: cover;
  object-position: top; // 포스터에 맞게 보이는 위치 변경
`;

const TicketInformation = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 71.4%;

  padding: 0 7.3%;
  z-index: 2;
`;

const Information = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 74.85%;
`;

const Category = styled.div.attrs({className: 'Podo-Ticket-Body-B7'})`
  color: var(--grey-5);
  white-space: nowrap; // 줄 바꿈 방지
`;

const Description = styled.div.attrs({className: 'Podo-Ticket-Body-B6'})`
  color: var(--grey-7);
`;

const TopContent = styled.div`
  display: flex;
  flex-direction: column;

  height: 34.4%;
  gap: 3px;
  justify-content: center;
  border-bottom: 1px solid var(--grey-2);
`;

const PlayTitle = styled.div.attrs({className: 'Podo-Ticket-Headline-H3'})`
  color: var(--grey-7);
`;

const MiddleContent = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  padding-top: 7.9%;
  height: 65.6%;
`;

const MiddleLeftContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 72.2%;
  padding-right: 6.7%;
  gap: 15%;
`;

const MiddleRightContent = styled.div`
  display: flex;
  width: auto;
  flex-direction: column;
  gap: 15%;
`;

const ContentItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: left;
`;

const BottomContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 25.15%;
  justify-content: center;
  gap: 4%;
`;

const CurrentSeat = styled.div.attrs({className: 'Podo-Ticket-Headline-H2'})`
  color: var(--purple-4);
`;

// const ReservationTag = styled.span`
//   position: absolute;
//   width: 2.875rem;
//   height: 1.125rem;
//   border-radius: 1.875rem;

//   right: 20px;
//   top: 15px;

//   display: flex;
//   align-items: center;
//   justify-content: center;
// `;
