import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SERVER_URL } from '../constants/ServerURL';

import '../styles/TicketConfirmation.css';

import Loading from '../components/modal/LoadingModal';
import CompleteModal from '../components/modal/CompleteModal';
import poster from '../assets/images/poster.jpg'
import confirmIcon from '../assets/images/confirm_icon.png'

const TicketConfirmation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [ticketInfo, setTicketInfo] = useState(null);
    const [error, setError] = useState(null);

    const selectedSeats = location.state ? location.state.selectedSeats : []; // 선택한 좌석

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

    useEffect(() => {
        const fetchTicketingInfo = async () => {
            try {
                const response = await axios.get(`${SERVER_URL}/seat/ticketing`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true, // 쿠키 포함
                });

                // API 응답에서 데이터 저장
                const playInfo = response.data.play[0]; // 첫 번째 공연 정보
                setTicketInfo({
                    title: playInfo.play.title,
                    date: formatDate(playInfo.date_time),
                    poster: playInfo.play.poster,
                    location: "광운대학교 새빛관 대강의실", // 장소는 임시로 설정
                    seats: selectedSeats, // 선택한 좌석
                });
            } catch (error) {
                console.error('Error fetching ticketing info:', error);
                setError('티켓 정보를 가져오는 데 실패했습니다.'); // 오류 메시지 설정
            }
        };

        fetchTicketingInfo();
    }, [selectedSeats]); // 선택한 좌석이 변경될 때마다 호출

    const goBack = async () => {
        try {
            const response = await axios.delete(`${SERVER_URL}/seat/back`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true, // 쿠키 포함
            });

            if (response.data.success) {
                navigate('/select'); // 성공적으로 취소되면 선택 페이지로 이동
            } else {
                setError('이미 발권 신청이 완료되었습니다.'); // 실패 메시지
            }
        } catch (error) {
            console.error('Error cancelling ticket:', error);
            setError('발권 신청을 취소하는 데 실패했습니다.'); // 오류 메시지 설정
        }
    };

    const handleTicketIssuance = async () => {
        setIsLoading(true); // 로딩 시작

        setTimeout(async () => {

            try {
                const response = await axios.patch(`${SERVER_URL}/seat/ticketing`, {
                    seats: selectedSeats // 선택한 좌석 정보 전송
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true, // 쿠키 포함
                });

                if (response.data.success) {
                    setIsLoading(false); // API 호출 후 로딩 종료
                    setIsComplete(true); // 발권 완료 모달 표시
                    setTimeout(() => {
                        setIsComplete(false); // 모달 숨기기
                        navigate('/ticket'); // 티켓 페이지로 이동
                    }, 1000); // 1초 후에 이동
                } else {
                    setIsLoading(false); // API 호출 후 로딩 종료
                    setError('티켓 발권에 실패했습니다.'); // 발권 실패 메시지
                }
            } catch (error) {
                setIsLoading(false); // API 호출 후 로딩 종료
                console.error('Error issuing ticket:', error);
                setError('티켓 발권에 실패했습니다.'); // 발권 실패 메시지
            }
        }, 1000); // 1초 후에 API 호출 시작
    };



    const goToTicket = () => {
        setIsLoading(true);  // Start loading
        setTimeout(() => {
            setIsLoading(false);  // End loading after 1 second
            setIsComplete(true);   // Show CompleteModal
            setTimeout(() => {
                setIsComplete(false);  // Hide CompleteModal after 1 second
                navigate('/ticket');
            }, 1000);  // CompleteModal shows for 1 second
        }, 1000);  // Loading time: 1 second
    };


    const handleCompleteClose = () => {
        setIsComplete(false); // Hide CompleteModal
        navigate('/ticket'); // Navigate after closing
    };

    return (
        <div className="ticketConfirm-container">
            {/* Header */}
            <div className="ticketConfirm-header">
                <ChevronLeft className="w-6 h-6" onClick={goBack} />
            </div>

            {/* Main Content */}
            <div className="ticketConfirm-content">
                {/* Icon */}
                <img className="ticket-icon" src={confirmIcon} />

                {/* Title */}
                <span className="ticketConfirm-title">선택한 좌석으로</span>
                <span className="ticketConfirm-title">티켓 발권 해드릴까요?</span>
                <p className="ticketConfirm-warning">발권 이후 좌석 변경은 불가합니다.</p>

                <div className="screen-divider"></div>

                {/* Ticket Information Card */}
                <div className="ticket-info-card">
                    <h2 className="info-card-title">발권 정보 요약</h2>
                    <div className="info-card-content">

                        <div className="confirm-poster-image">
                            {ticketInfo && (<img
                                src={poster}
                                alt="공연 포스터"
                            />)}
                        </div>

                        <div className="confirm-ticket-details">
                            {ticketInfo && (
                                <>
                                    <span className="confirm-show-title">{ticketInfo.title}</span>
                                    <div className="confirm-details-row">
                                        <span className="confirm-details-label">시간</span>
                                        <span className="confirm-details-text">{ticketInfo.date}</span>
                                    </div>
                                    <div className="confirm-details-row">
                                        <span className="confirm-details-label">장소</span>
                                        <span className="confirm-details-text">{ticketInfo.location}</span>
                                    </div>
                                    <div className="confirm-details-row">
                                        <span className="confirm-details-label">좌석</span>
                                        <span className="confirm-details-text">
                                            {ticketInfo.seats.map(seat => {
                                                const index = seat.search(/[0-9]/); // 숫자가 처음 나타나는 인덱스 찾기
                                                if (index !== -1) {
                                                    return seat.slice(0, index) + seat.slice(index + 1); // 첫 번째 숫자 제거
                                                }
                                                return seat; // 숫자가 없으면 그대로 반환
                                            }).join(", ")}
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>

                    </div>
                </div>

                {/* Button */}
                <button className="ticketConfirm-button" onClick={handleTicketIssuance}>
                    티켓 발권
                </button>

                {/* 로딩 컴포넌트 표시 */}
                {isLoading && <Loading isOpen={isLoading} />}
                <CompleteModal isOpen={isComplete} onClose={handleCompleteClose} />
            </div>
        </div>
    );
};

export default TicketConfirmation;