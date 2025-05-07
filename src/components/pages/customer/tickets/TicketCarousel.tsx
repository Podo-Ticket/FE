import React, { useState } from "react";
import styled from "styled-components";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import TicketBackground from "@assets/images/ticket_background.svg?react";
import poster from "@/assets/images/posters/2025_Spring_KwangwoonUniv_poster.png"; // 해당 공연에 맞는 상수값 적용 필요
import { Language } from "@/constants/text/Language";

import { splitDateTime } from "../../../../utils/DateUtil";
import { TICKET } from "@/constants/text/UIText";
interface Ticket {
  id: string;
  title: string;
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
  isOnSite,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const language =
    localStorage.getItem("language") === "english"
      ? Language.English
      : Language.Korean;

  const handleSlideChange = (swiper: any) => {
    const newIndex = swiper.activeIndex;
    setActiveIndex(newIndex);
    onActiveIndexChange(newIndex);
  };

  if (!currentTicketInfo) return null;

  console.log(currentTicketInfo.dateTime);
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
        {Array.from({ length: ticketCount }, (_, index) => (
          <TicketSwiperSlide
            key={index}
            className={
              index === activeIndex ? "active-slide" : "inactive-slide"
            }
          >
            <TicketCellBackground>
              <TicketBackground
                width="100%"
                height="100%"
                preserveAspectRatio="none"
              />
            </TicketCellBackground>

            <TicketHeaderContainer>
              <Poster src={poster} alt="공연 포스터" />
              {isOnSite ? (
                <ReservationTag
                  className="Podo-Ticket-Body-B12"
                  style={{
                    border: "1px solid var(--grey-1)",
                    background: "var(--grey-5)",
                    color: "var(--ect-white)",
                  }}
                >
                  현장 예매
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
                  사전 예매
                </ReservationTag>
              )}
            </TicketHeaderContainer>

            <TicketInformation>
              <TopContent>
                <ContentItem>
                  <Category>
                    {language === "english"
                      ? TICKET.english.performanceTitle
                      : TICKET.korean.performanceTitle}
                  </Category>
                  <PlayTitle>{currentTicketInfo.title}</PlayTitle>
                </ContentItem>
              </TopContent>

              <MiddleContent>
                <MiddleLeftContent>
                  <ContentItem>
                    <Category>
                      {language === "english"
                        ? TICKET.english.performanceDate
                        : TICKET.korean.performanceDate}
                    </Category>
                    <Description>{result?.date}</Description>
                  </ContentItem>

                  <ContentItem>
                    <Category>
                      {language === "english"
                        ? TICKET.english.venue
                        : TICKET.korean.venue}
                    </Category>
                    <Description>{currentTicketInfo.location}</Description>
                  </ContentItem>
                </MiddleLeftContent>
                <MiddleRightContent>
                  <ContentItem>
                    <Category>
                      {language === "english"
                        ? TICKET.english.startTime
                        : TICKET.korean.startTime}
                    </Category>
                    <Description>{result?.time}</Description>
                  </ContentItem>
                  <ContentItem>
                    <Category>
                      {language === "english"
                        ? TICKET.english.runningTime
                        : TICKET.korean.runningTime}
                    </Category>
                    <Description>
                      {currentTicketInfo.runningTime}{" "}
                      {language === "english"
                        ? TICKET.english.minutes
                        : TICKET.korean.minutes}
                    </Description>
                  </ContentItem>
                </MiddleRightContent>
              </MiddleContent>

              <DummyContent />

              <BottomContent>
                <Category>
                  {" "}
                  {language === "english"
                    ? TICKET.english.seatNumber
                    : TICKET.korean.seatNumber}
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
  width: 100%;
  height: 65svh;
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

const TicketCellBackground = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;

  width: 100%;
  height: 100%;

  border-radius: inherit;

  transition: width 0.3s ease-in-out, height 0.3s ease-in-out;

  z-index: 2;
`;

const TicketHeaderContainer = styled.div`
  position: relative;
  display: flex;

  width: calc(100%);
  height: 28.5svh;

  overflow: hidden;
  z-index: 2;
`;

const Poster = styled.img`
  width: 100%; // 티켓 보라색 테두리 고려
  height: calc(100%); // 티켓 보라색 테두리 고려
  border-radius: 20px 20px 0px 0px;

  object-fit: cover;
  object-position: top; // 포스터에 맞게 보이는 위치 변경
`;

const TicketInformation = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100%;

  z-index: 2;
`;

const Category = styled.div.attrs({ className: "Podo-Ticket-Body-B7" })`
  color: var(--grey-5);
`;

const Description = styled.div.attrs({ className: "Podo-Ticket-Body-B6" })`
  color: var(--grey-7);
`;

const TopContent = styled.div`
  padding: 20px;
  padding-bottom: 0;
`;

const PlayTitle = styled.div.attrs({ className: "Podo-Ticket-Body-B1" })`
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

const DummyContent = styled.div`
  flex-grow: 1;
`;

const BottomContent = styled.div``;

const CurrentSeat = styled.div.attrs({ className: "Podo-Ticket-Body-B2" })`
  padding-bottom: 20px;

  color: var(--purple-4);
`;

const ReservationTag = styled.span`
  position: absolute;
  width: 2.875rem;
  height: 1.125rem;
  border-radius: 1.875rem;

  right: 20px;
  top: 15px;

  display: flex;
  align-items: center;
  justify-content: center;
`;
