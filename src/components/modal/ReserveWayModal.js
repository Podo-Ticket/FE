import React from 'react';

import '../../styles/user/ReserveWayModal.css'; // 스타일 파일 추가
import checkIcon from '../../assets/images/check_reserve_icon.png'
import reserveIcon from '../../assets/images/reserve_icon.png'

const ReserveWayModal = ({ isOpen, onClose, onCheckReservation, onReserve }) => {
    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        // 모달 내용 부분 클릭 시 onClose를 호출하지 않도록
        if (e.target.classList.contains('modal-overlay-reserve-way')) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay-reserve-way" onClick={handleOverlayClick}>
            <div className="modal-content-reserve-way">

                <div className="reserve-way-button-container">
                    <button
                        className="check-reservation-button"
                        onClick={() => {
                            onCheckReservation(); // 예매 내역 확인 클릭 시
                            onClose(); // 모달 닫기
                        }}
                    >
                        <img className="reserve-way-icon" src={checkIcon} />
                        <p>티켓 발권</p>
                        <span>사전에 예매한 티켓을 발권받을 수 있어요!</span>
                    </button>
                    <button
                        className="reserve-button"
                        onClick={() => {
                            onReserve(); // 현장 예매 클릭 시
                            onClose(); // 모달 닫기
                        }}
                    >
                        <img className="reserve-way-icon" src={reserveIcon} />
                        <p>현장 예매</p>
                        <span>티켓을 새로 예매할 수 있어요!</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReserveWayModal;