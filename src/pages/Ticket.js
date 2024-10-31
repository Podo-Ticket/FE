import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import EvaluationModal from '../components/modal/EvaluationModal';
import poster from '../assets/images/poster4.png';
import '../styles/Ticket.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


const Ticket = () => {
    const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0); // 현재 티켓 인덱스

    const [tickets] = useState([
        {
            id: 1,
            title: '밤으로의 긴 여로',
            location: '광운대학교 새빛관 대강의실',
            date: '2024.09.05 ~ 2024.09.07 15:00',
            seat: 'D 9',
            image: poster,
        },
        {
            id: 2,
            title: '밤으로의 긴 여로',
            location: '광운대학교 새빛관 대강의실',
            date: '2024.09.05 ~ 2024.09.07 15:00',
            seat: 'C 12',
            image: poster,
        },
        {
            id: 3,
            title: '밤으로의 긴 여로',
            location: '광운대학교 새빛관 대강의실',
            date: '2024.09.05 ~ 2024.09.07 15:00',
            seat: 'C 13',
            image: poster,
        }
    ]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsEvaluationModalOpen(true); // 5초 뒤에 모달을 열기
        }, 5000); // 5000 밀리초 = 5초

        return () => clearTimeout(timer); // 컴포넌트가 언마운트될 때 타이머를 정리
    }, []);

    const closeModal = () => {
        setIsEvaluationModalOpen(false); // 모달 닫기 함수
    };

    return (
        <div className="ticket-container">
            <h2 className="ticketing-title">티켓 정보</h2>

            <span className="ticket-index">
                <span className="ticket-index-current">{currentIndex + 1}</span>/{tickets.length}
            </span>

            <div className="swiper-container">
                <Swiper
                    onSlideChange={(swiper) => {
                        const slides = swiper.slides;
                        setCurrentIndex(swiper.activeIndex)
                        slides.forEach((slide, index) => {
                            if (index === swiper.activeIndex) {
                                slide.style.opacity = '1';
                                slide.style.transform = 'scale(1)';
                            } else {
                                slide.style.opacity = '0.5';
                                slide.style.transform = 'scale(0.9)';
                            }
                        });
                    }}
                    spaceBetween={-50}
                    slidesPerView={3}
                    centeredSlides={true}
                    className="ticket-swiper"
                >
                    {tickets.map((ticket, index) => (
                        <SwiperSlide key={ticket.id}>
                            <div className="ticket-card">
                                <img src={ticket.image} alt={ticket.title} className="ticket-image" />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <div className="ticketing-info-container">
                <div className="ticketing-detail">
                    <p>{tickets[currentIndex].title}</p>
                    <span>{tickets[currentIndex].date}</span>
                    <span>{tickets[currentIndex].location}</span>
                </div>
                <div className="ticketing-seat">
                    <div className="ticketing-seat-head">좌석</div>
                    <div className="ticketing-seat-num">{tickets[currentIndex].seat}</div>
                </div>
            </div>

            {/* 모달이 열렸을 때 EvaluationModal 렌더링 */}
            {isEvaluationModalOpen && (
                <div className="modal-overlay-evaluation">
                    <EvaluationModal closeModal={closeModal} />
                </div>
            )}

        </div>
    );
};

export default Ticket;