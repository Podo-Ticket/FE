import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCw } from 'lucide-react';

import '../styles/BottomNav.css';
import '../styles/RealTimeSeats.css';
import BottomNav from '../components/BottomNav';
import SeatMap from '../components/SeatMap';
import calendarIcon from '../assets/image/calendar_icon.png'
import { ChevronDown } from 'lucide-react';

function RealTimeSeats() {
  const navigate = useNavigate();
  const selectRef = useRef(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isAlreadySelectedModalOpen, setIsAlreadySelectedModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [selectedSession, setSelectedSession] = useState('2024.10.09 (수) 17:00');

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

  // 공연 회차 선택 핸들러
  const handleSessionChange = (event) => {
    setSelectedSession(event.target.value);
  };

  const handleChevronClick = () => {
    selectRef.current.focus(); // select 요소에 포커스 주기
    selectRef.current.click(); // select 요소 클릭 트리거
  };

  return (
    <div className="admin-login-container">

      <div className="seat-header">
        <p className="seat-header-text">실시간 좌석 현황</p>
        <button className="refresh-button" onClick={handleRefresh}>
          <RotateCw size={20} color="#3C3C3C" />
        </button>
      </div>

      <div className='seats-time-select-container'>
        {/* 공연 회차 선택 버튼 */}
        <div className="session-picker">
          <div className="seesion-picker-left">
            <img src={calendarIcon} className="calendar-icon" />
            <select
              ref={selectRef}
              className="session-select"
              value={selectedSession}
              onChange={handleSessionChange}
            >
              <option value="2024.10.09 (수) 17:00">2024.10.09 (수) 17:00</option>
              <option value="2024.10.10 (목) 17:00">2024.10.10 (목) 17:00</option>
              <option value="2024.10.11 (금) 17:00">2024.10.11 (금) 17:00</option>
            </select>
          </div>
          <div className="session-picker-right" onClick={handleChevronClick} ><ChevronDown size={21} color="#3C3C3C" /></div>
        </div>
      </div>

      <SeatMap
        selectedSeats={selectedSeats}
        setSelectedSeats={setSelectedSeats}
        setIsAlreadySelectedModalOpen={setIsAlreadySelectedModalOpen}
        disabled={true}
      />

      <div className="admin-seat-legend">
        <span className="admin-legend">
          <span className="admin-available-icon"></span>
          발권 가능
        </span>
        <span className="admin-legend">
          <span className="admin-booked-icon"></span>
          발권 완료
        </span>

        <button className="admin-legend-button">
          여석 {139}석
        </button>
      </div>

      <BottomNav /> {/* 항상 하단에 고정된 네비게이션 바 */}

    </div>

  );
}

export default RealTimeSeats;