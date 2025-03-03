import React, { useState } from "react";
import styled from "styled-components";

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import ticketBackground from '../../assets/images/ticket_image.png'
import poster from '../../assets/images/posters/24th_SeoulNationalUniv_Riveract_poster.jpg'

import { splitDateTime } from '../../utils/DateUtil';

interface Ticket {
  id: string;
  title: string;
  location: string;
  dateTime: string;
  seat: string;
  runningTime: number;
  image: string;
}

interface TicketCarouselProps {
  ticketCount: number;
  onActiveIndexChange: (index: number) => void; // active index 변경 시 호출되는 콜백
  currentTicketInfo: Ticket;
}

const TicketCarousel: React.FC<TicketCarouselProps> = ({ ticketCount, onActiveIndexChange, currentTicketInfo }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSlideChange = (swiper: any) => {
    const newIndex = swiper.activeIndex; // Swiper의 active index 가져오기
    setActiveIndex(newIndex); // 상태 업데이트
    onActiveIndexChange(newIndex); // 부모 컴포넌트로 active index 전달
  };

  if (!currentTicketInfo) return null;

  // 공연 날짜와 공연 시작시간 분리
  const result = splitDateTime(currentTicketInfo.dateTime);

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
        {Array.from({ length: ticketCount }, (_, index) => (
          <TicketSwiperSlide key={index} className={index === activeIndex ? "active-slide" : "inactive-slide"}>
            <TicketCellBackground src={ticketBackground} alt={`티켓 ${index + 1}`} />

            <TicketHeaderContainer>
              <Poster src={poster} alt="공연 포스터" />
            </TicketHeaderContainer>

            <TicketInformation>
              <TopContent>
                <ContentItem>
                  <Category>공연 제목</Category>
                  <PlayTitle>{currentTicketInfo.title}</PlayTitle>
                </ContentItem>

              </TopContent>

              <MiddleContent>
                <MiddleLeftContent>
                  <ContentItem>
                    <Category>공연 일자</Category>
                    <Description>{result?.date}</Description>
                  </ContentItem>

                  <ContentItem>
                    <Category>공연 장소</Category>
                    <Description>{currentTicketInfo.location}</Description>
                  </ContentItem>

                </MiddleLeftContent>
                <MiddleRightContent>
                  <ContentItem>
                    <Category>시작 시간</Category>
                    <Description>{result?.time}</Description>
                  </ContentItem>
                  <ContentItem>
                    <Category>관람 시간</Category>
                    <Description>{currentTicketInfo.runningTime}분</Description>
                  </ContentItem>
                </MiddleRightContent>
              </MiddleContent>

              <DummyContent/>

              <BottomContent>
                <Category>좌석 번호</Category>
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
  width: 100%;
  height: 475px;
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
    transition: box-shadow 0.3s ease-in-out, opacity 0.3s ease-in-out;
  }

  .inactive-slide {
    opacity: 0.5;
    box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
    transition: box-shadow 0.3s ease-in-out, opacity 0.3s ease-in-out;
  }
`;

const TicketSwiperSlide = styled(SwiperSlide)`
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100%;

`;

const TicketCellBackground = styled.img`
  position: absolute;
  top: 0px;
  left: 0px;

  display: block;

  width: 100%;
  height: 100%;
  border-radius: inherit;

  object-fit: contain; 
  object-position: center;

  transition: width 0.3s ease-in-out, height 0.3s ease-in-out;
 
  z-index: 2;
`;

const TicketHeaderContainer = styled.div`
  position: relative;
  display: flex;

  width: calc(100% - 3px);
  border-bottom: 1px solid var(--grey-2);
  overflow: hidden;
  z-index: 2;

  transform: translate(1.5px, 0.8px); // 티켓 보라색 테두리 고려
`;

const Poster = styled.img`
  width: calc(100%); // 티켓 보라색 테두리 고려
  height: calc(135px); // 티켓 보라색 테두리 고려
  border-radius: 20px 20px 0px 0px;
  

  object-fit: cover;
  object-position: center;
`;

const TicketInformation = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100%;

  z-index: 2;
`;

const Category = styled.div.attrs({ className: 'Podo-Ticket-Body-B7' })`
color: var(--grey-5);
`;

const Description = styled.div.attrs({ className: 'Podo-Ticket-Body-B6' })`
color: var(--grey-7);
`;

const TopContent = styled.div`
padding: 20px;
padding-bottom: 0;
`;

const PlayTitle = styled.div.attrs({ className: 'Podo-Ticket-Body-B1' })`
padding-bottom: 20px;
border-bottom: 1px solid var(--grey-2);

color: var(--grey-7);
`;

const MiddleContent = styled.div`
display: flex;

padding: 20px;

gap: 20px;
`;

const MiddleLeftContent = styled.div`
display: flex;
flex-direction: column;

gap: 25px;
`;

const MiddleRightContent = styled.div`
display: flex;
flex-direction: column;

gap: 25px;
`;

const ContentItem = styled.div`
display: flex;
flex-direction: column;

text-align: left;

gap: 3px;
`;

const DummyContent = styled.div`flex-grow: 1;`;

const BottomContent = styled.div``;

const CurrentSeat = styled.div.attrs({ className: 'Podo-Ticket-Body-B2' })`
padding-bottom: 20px;

color: var(--purple-4);
`;
