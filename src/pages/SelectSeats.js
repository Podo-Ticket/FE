import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCw } from 'lucide-react';

import '../styles/SelectSeats.css';

import SeatMap from '../components/SeatMap';
import errorIcon from '../assets/images/error_icon.png'

function SelectSeats() {
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isAlreadySelectedModalOpen, setIsAlreadySelectedModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // 이미 선택된 좌석 모달 함수
  const handleAlreadySelectedOverlayClick = () => {
    setIsClosing(true); // 애니메이션 시작
    setTimeout(() => {
      setIsAlreadySelectedModalOpen(false); // 모달 닫기
      setIsClosing(false); // 애니메이션 상태 초기화
    }, 300); // 애니메이션과 같은 시간으로 설정
  };

  // 좌석 선택란 새로고침
  const handleRefresh = () => {
    setSelectedSeats([]);
  };

  const goToTicket = () => navigate('/confirm');

  return (
    <div className="seat-selection-container">

      <div className="seat-header">
        <p className="seat-header-text">좌석을 선택해주세요</p>
        <button className="refresh-button" onClick={handleRefresh}>
          <RotateCw size={20} color="#3C3C3C" />
        </button>
      </div>

      <div className="seat-legend">
        <span className="legend">
          <span className="available-icon"></span>
          선택 가능 좌석
        </span>
        <span className="legend">
          <span className="selected-icon"></span>
          선택한 좌석
        </span>
        <span className="legend">
          <span className="booked-icon"></span>
          선택 불가능 좌석
        </span>
      </div>


      <SeatMap
        selectedSeats={selectedSeats}
        setSelectedSeats={setSelectedSeats}
        setIsAlreadySelectedModalOpen={setIsAlreadySelectedModalOpen}
        disabled={false}
      />


      {selectedSeats.length >= 0 && (
        <button className={`select-confirm-button ${selectedSeats.length === 3 ? 'select-confirm-button-active' : ''}`}
          onClick={goToTicket}
          disabled={selectedSeats.length < 3}>
          선택 완료 {selectedSeats.length} / 3
        </button>
      )}


      {isAlreadySelectedModalOpen && (
        <div className="already-seat-modal-overlay" onClick={handleAlreadySelectedOverlayClick}>
          <div className={`already-seat-modal-content ${isClosing ? 'seat-close-animation' : ''}`}>
            <img className="error-icon" src={errorIcon}/>
            <span className="error-message">다른 고객님께서 이미 선택한 좌석입니다.</span>
          </div>
        </div>
      )}

    </div>
  );
};

export default SelectSeats;