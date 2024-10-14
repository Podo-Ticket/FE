import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

import poster from '../image/poster.png';
import '../css/ticket.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Ticket = () => {
    // 티켓 및 좌석 정보 관리
    const [tickets] = useState([
        {
            id: 1,
            title: '사랑에 빠지기까지 D-100',
            location: '아루또 소극장',
            date: '2024.10.09 17:00',
            seat: 'D 9',
            image: poster,
        },
        {
            id: 2,
            title: '사랑에 빠지기까지 D-100',
            location: '아루또 소극장',
            date: '2024.10.09 17:00',
            seat: 'C 12',
            image: poster,
        },
        {
            id: 3,
            title: '사랑에 빠지기까지 D-100',
            location: '아루또 소극장',
            date: '2024.10.09 17:00',
            seat: 'C 13',
            image: poster,
        }
    ]);

    return (
        <div className="ticket-container">
            <h2 className="ticket-title">TICKET</h2>
            <Swiper
                onSlideChange={(swiper) => {
                    const slides = swiper.slides;
                    slides.forEach((slide, index) => {
                        if (index === swiper.activeIndex) {
                            slide.style.opacity = '1';
                            slide.style.transform = 'scale(0.8)';
                        } else {
                            slide.style.opacity = '0.5';
                            slide.style.transform = 'scale(0.5)';
                        }
                    });
                }}
                spaceBetween={1}
                slidesPerView={3}
                centeredSlides={true}
                pagination={true}
                loop={true}
                modules={[Pagination]}
                className="ticket-swiper"
            >
                {tickets.map((ticket, index) => (
                    <SwiperSlide key={ticket.id}>
                        <div className="ticket-card">
                            <img src={ticket.image} alt={ticket.title} className="ticket-image" />
                            <div className="ticket-info">
                                <h3>{ticket.title}</h3>
                                <p>{ticket.location}</p>
                                <p>{ticket.date}</p>
                                <div className="ticket-seat">
                                    <span>좌석</span>
                                    <strong>{ticket.seat}</strong>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default Ticket;