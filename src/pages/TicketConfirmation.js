
import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import '../styles/TicketConfirmation.css';

import Loading from '../components/modal/LoadingModal';
import CompleteModal from '../components/modal/CompleteModal';
import poster from '../assets/images/poster.jpg'
import confirmIcon from '../assets/images/confirm_icon.png'

const TicketConfirmation = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    const ticketInfo = {
        title: "옥탑방 고양이",
        date: "2024.10.09 (월) 17:00",
        location: "광운대학교 새빛관 대강의실",
        seats: ["다19", "다20", "다21", "다22"]
    };

    const goBack = () => {
        navigate('/select');
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
                <img className="ticket-icon" src={confirmIcon}/>

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
                            <img
                                src={poster}
                                alt="공연 포스터"
                            />
                        </div>

                        <div className="confirm-ticket-details">
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
                                <span className="confirm-details-text">{ticketInfo.seats.join(", ")}</span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Button */}
                <button className="ticketConfirm-button" onClick={goToTicket}>
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