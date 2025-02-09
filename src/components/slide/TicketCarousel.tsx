import React, { useState } from "react";
import styled from "styled-components";

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import poster from '../../assets/images/poster.jpeg'

interface TicketCarouselProps {
  ticketCount: number;
  onActiveIndexChange: (index: number) => void; // active index 변경 시 호출되는 콜백
}

const TicketCarousel: React.FC<TicketCarouselProps> = ({ ticketCount, onActiveIndexChange }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSlideChange = (swiper: any) => {
    const newIndex = swiper.activeIndex; // Swiper의 active index 가져오기
    setActiveIndex(newIndex); // 상태 업데이트
    onActiveIndexChange(newIndex); // 부모 컴포넌트로 active index 전달
  };

  return (
    <TicketCarouselContainer>
      <TicketSwiper
        slidesPerView={2}
        spaceBetween={20}
        centeredSlides={true}
        pagination={{
          clickable: true,
        }}
        onSlideChange={handleSlideChange}
      >
        {Array.from({ length: ticketCount }, (_, index) => (
          <TicketSwiperSlide key={index} className={index === activeIndex ? "active-slide" : "inactive-slide"}>
            <img src={poster} alt={`티켓 ${index + 1}`} />
          </TicketSwiperSlide>
        ))}

      </TicketSwiper>
    </TicketCarouselContainer>
  );
};

export default TicketCarousel;

const TicketCarouselContainer = styled.div`
  width: 100%;
  height: 300px;
  background: transparent;

  padding: 5px;

  text-align: center;

  user-select: none; /* 텍스트 선택 방지 */
  -webkit-user-select: none; /* Safari에서 드래그 방지 */
  -moz-user-select: none; /* Firefox에서 드래그 방지 */
  -ms-user-select: none;
`;

const TicketSwiper = styled(Swiper)`
  width: 100%;
  height: 100%;

  padding: 15px 0;

  .active-slide {
    transform: scale(1.05);
    opacity: 1;
    box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out, opacity 0.3s ease-in-out;
  }

  .inactive-slide {
    transform: scale(0.95);
    opacity: 0.6;
    box-shadow: 0px 5px 7.5px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out, opacity 0.3s ease-in-out;
  }
`;

const TicketSwiperSlide = styled(SwiperSlide)`
  display: flex;

  width: 90%;
  height: 90%;
  border-radius: 10px;

  img {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    object-fit: cover;
    transition: width 0.3s ease-in-out, height 0.3s ease-in-out;
  }
`;