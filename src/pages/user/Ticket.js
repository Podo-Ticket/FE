import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { SERVER_URL } from '../../constants/ServerURL';
//import { Navigation } from 'swiper/modules';

import EvaluationModal from '../../components/modal/EvaluationModal';
import poster from '../../assets/images/poster.jpg';
import infoIcon from '../../assets/images/info_icon.png'
import PlusInfoModal from '../../components/modal/PlusInfoModal'
import CompleteTicketingModal from '../../components/modal/CompleteTicketingModal';
import '../../styles/user/Ticket.css';
import 'swiper/css';


const Ticket = () => {
    const popupRef = useRef(null);

    const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0); // 현재 티켓 인덱스
    const [isPlusInfoModalOpen, setIsPlusInfoModalOpen] = useState(false);
    const [tickets, setTickets] = useState([]); // 티켓 상태 초기화
    const [isCompleteTicketingModalOpen, setIsCompleteTicketingModalOpen] = useState(false);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [isFadingOut, setIsFadingOut] = useState(false); // fade-out 상태 추가

    // 날짜 형식 맞추기 함수
    const formatDate = (dateString) => {
        // 날짜 문자열을 'YYYY-MM-DD HH:mm:ss' 형식으로 받을 것으로 가정
        const dateParts = dateString.split(' ')[0].split('-');
        const timeParts = dateString.split(' ')[1].split(':');

        const year = dateParts[0];
        const month = dateParts[1].padStart(2, '0'); // 두 자리 수로 만들기
        const day = dateParts[2].padStart(2, '0'); // 두 자리 수로 만들기
        const hours = timeParts[0].padStart(2, '0'); // 두 자리 수로 만들기
        const minutes = timeParts[1].padStart(2, '0'); // 두 자리 수로 만들기

        // 요일 계산
        const date = new Date(`${year}-${month}-${day}T${hours}:${minutes}`);
        const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];

        return `${year}.${month}.${day} (${dayOfWeek}) ${hours}:${minutes}`;
    };

    // 티켓 정보 가져오기
    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await axios.get(`${SERVER_URL}/ticket/info`, {
                    withCredentials: true, // 쿠키 포함
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const formattedTickets = response.data.seats.map(seat => ({
                    id: `${seat.row}${seat.number}`, // 각 티켓의 ID 생성
                    title: seat.schedule.play.title,
                    location: "광운대학교 새빛관 대강의실", // 고정된 공연장 이름 (필요에 따라 수정)
                    date: formatDate(seat.schedule.date_time), // 날짜 형식 변환 필요
                    seat: `${seat.row} ${seat.number}`, // 좌석 정보
                    image: poster, // 포스터 이미지
                }));

                setTickets(formattedTickets); // 티켓 상태 업데이트
            } catch (error) {
                console.error("Error fetching tickets:", error);
            }
        };

        fetchTickets(); // 티켓 데이터 가져오기

        // 컴포넌트가 마운트될 때 모달 열기
        setIsCompleteTicketingModalOpen(true); // 모달 열기
    }, []); // 컴포넌트 마운트 시 한 번 호출

    // 슬라이더 카드 스타일 함수
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

    const closeModal = () => {
        setIsEvaluationModalOpen(false); // 모달 닫기 함수
        togglePopup();
    };

    const closePlusInfoModal = () => {
        setIsPlusInfoModalOpen(false); // 공연장 정보 모달 닫기
    };

    const closeCompleteTicketingModal = () => {
        setIsCompleteTicketingModalOpen(false); // 모달 닫기
        setIsEvaluationModalOpen(true); // 평가 모달 열기
    };

    // 현재 티켓이 존재하는지 확인
    const currentTicket = tickets[currentIndex];

    const togglePopup = () => {
        setIsPopupVisible(!isPopupVisible);
        if (!isPopupVisible) {
            // 말풍선이 열릴 때 3초 후 닫히도록 설정
            setTimeout(() => {
                setIsFadingOut(true); // fade-out 효과 시작
                setTimeout(() => {
                    setIsPopupVisible(false);
                    setIsFadingOut(false); // 상태 초기화
                }, 500); // fade-out이 끝난 후 상태 초기화
            }, 3000); // 3000ms = 3초
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setIsPopupVisible(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="ticket-container">

            <div className="ticketing-title-container">
                <h2 className="ticketing-title">티켓 정보</h2>
                <div>
                    <img src={infoIcon} className="ticket-info-icon" onClick={() => setIsPlusInfoModalOpen(true)} />
                    <div className="ticketing-title-speech-bubble-container">
                        {isPopupVisible && (
                            <div className={`ticket-speech-bubble ${isFadingOut ? 'fade-out' : ''}`} ref={popupRef}>
                                <div>길을 못 찾겠다면?</div>
                            </div>
                        )}
                    </div>
                </div>

            </div>

            <span className="ticket-index">
                <span className="ticket-index-current">{currentIndex + 1}</span>/{tickets.length}
            </span>

            <div className="swiper-container">
                <Swiper
                    onInit={(swiper) => {
                        updateSlideStyles(swiper); // 초기 상태 설정을 지연시킴
                    }}
                    onSlideChange={(swiper) => {
                        setCurrentIndex(swiper.activeIndex);
                        updateSlideStyles(swiper);
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

            {currentTicket && ( // currentTicket이 존재할 때만 정보 표시
                <div className="ticketing-info-container">
                    <div className="ticketing-detail">
                        <p>{currentTicket.title}</p>
                        <span>{currentTicket.date}</span>
                        <span>{currentTicket.location}</span>
                    </div>
                    <div className="ticketing-seat">
                        <div className="ticketing-seat-head">좌석</div>
                        <div className="ticketing-seat-num">
                            {currentTicket.seat.replace(/([^\d]*)(\d)/, '$1')} {/* 첫 번째 숫자 제거 */}
                        </div>
                    </div>
                </div>
            )}

            {/* 모달이 열렸을 때 CompleteTicketingModal 렌더링 */}
            {isCompleteTicketingModalOpen && (
                <CompleteTicketingModal
                    isOpen={isCompleteTicketingModalOpen}
                    onClose={closeCompleteTicketingModal}
                />
            )}

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