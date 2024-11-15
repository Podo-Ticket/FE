import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
//import { Navigation } from 'swiper/modules';

import EvaluationModal from '../components/modal/EvaluationModal';
import poster from '../assets/images/poster.jpg';
import infoIcon from '../assets/images/info_icon.png'
import PlusInfoModal from '../components/modal/PlusInfoModal'
import '../styles/Ticket.css';
import 'swiper/css';


const Ticket = () => {
    const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0); // 현재 티켓 인덱스
    const [isPlusInfoModalOpen, setIsPlusInfoModalOpen] = useState(false);

    const [tickets] = useState([
        {
            id: 1,
            title: '옥탑방 고양이',
            location: '광운대학교 새빛관 대강의실',
            date: '2024.11.16 (토) 15:00',
            seat: 'D 9',
            image: poster,
        },
        {
            id: 2,
            title: '옥탑방 고양이',
            location: '광운대학교 새빛관 대강의실',
            date: '2024.11.16 (토) 15:00',
            seat: 'C 12',
            image: poster,
        },
        {
            id: 3,
            title: '옥탑방 고양이',
            location: '광운대학교 새빛관 대강의실',
            date: '2024.11.16 (토) 15:00',
            seat: 'C 13',
            image: poster,
        }
    ]);

    const updateSlideStyles = (swiper) => {
        const slides = swiper.slides;
        slides.forEach((slide, index) => {
            if (index === swiper.activeIndex) {
                slide.style.opacity = '1';
                slide.style.transform = 'scale(1)';
            } else {
                slide.style.opacity = '0.5';
                slide.style.transform = 'scale(0.9)';
            }
        });
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsEvaluationModalOpen(true); // 5초 뒤에 모달을 열기
        }, 5000); // 5000 밀리초 = 5초

        return () => clearTimeout(timer); // 컴포넌트가 언마운트될 때 타이머를 정리
    }, []);

    const closeModal = () => {
        setIsEvaluationModalOpen(false); // 모달 닫기 함수
    };

    const closePlusInfoModal = () => {
        setIsPlusInfoModalOpen(false); // 공연장 정보 모달 닫기
    };

    return (
        <div className="ticket-container">

            <div className="ticketing-title-container">
                <h2 className="ticketing-title">티켓 정보</h2>
                <img src={infoIcon} className="ticket-info-icon" onClick={() => setIsPlusInfoModalOpen(true)} />
            </div>

            <span className="ticket-index">
                <span className="ticket-index-current">{currentIndex + 1}</span>/{tickets.length}
            </span>

            <div className="swiper-container">
                <Swiper
                    onSlideChange={(swiper) => {
                        setCurrentIndex(swiper.activeIndex);
                        updateSlideStyles(swiper);
                    }}
                    onInit={(swiper) => {
                        updateSlideStyles(swiper); // 초기 상태 설정
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

            <PlusInfoModal
                isOpen={isPlusInfoModalOpen}
                onClose={closePlusInfoModal}
            />

        </div>
    );
};

export default Ticket;