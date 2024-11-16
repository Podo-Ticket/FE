import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SERVER_URL } from '../constants/ServerURL'

import '../styles/BottomNav.css';
import '../styles/RealTimeSeats.css';
import BottomNav from '../components/BottomNav';
import SeatMap from '../components/SeatMap';
import calendarIcon from '../assets/image/calendar_icon.png'
import personIcon from '../assets/image/person_info_icon.png';
import phoneIcon from '../assets/image/phone_info_icon.png';
import seatIcon from '../assets/image/seat_info_icon.png';
import { ChevronDown, RotateCw } from 'lucide-react';

function RealTimeSeats() {
  const navigate = useNavigate();
  const selectRef = useRef(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isAlreadySelectedModalOpen, setIsAlreadySelectedModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [selectedSession, setSelectedSession] = useState('1');
  const [availableSeats, setAvailableSeats] = useState(0); // 여석 수
  const [error, setError] = useState(''); // 오류 메시지
  const [bookingInfo, setBookingInfo] = useState(null); // 예매 정보 저장

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

  // 좌석 정보 가져오기
  const fetchSeats = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/seat/realTime`, {
        withCredentials: true, // 세션 쿠키 포함
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          scheduleId: selectedSession, // 선택된 공연 일시 ID
        },
      });
      setAvailableSeats(response.data.availableSeats); // 여석 수 설정
      setError(''); // 오류 초기화
    } catch (error) {
      console.error("Error fetching seats:", error);
      if (error.response && error.response.data.error) {
        setError(error.response.data.error); // 오류 메시지 설정
      } else {
        setError("좌석 정보를 가져오는 데 실패했습니다."); // 일반 오류 메시지
      }
    }
  };

  useEffect(() => {
    fetchSeats(); // 컴포넌트가 마운트될 때 좌석 정보 가져오기
  }, []); // 초기 로드 시 한 번만 호출

  // 좌석 클릭 핸들러
  const handleSeatClick = async (seatId) => {
    try {
      const response = await axios.get(`${SERVER_URL}/seat/audience`, {
        withCredentials: true, // 세션 쿠키 포함
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          scheduleId: selectedSession,
          seatId: seatId,
        },
      });

      const userInfo = response.data.userInfo;
      console.log(userInfo);
      console.log(seatId);
      console.log(userInfo.head_count,);
      setBookingInfo({
        name: userInfo.user.name,
        phone: userInfo.user.phone_number,
        headCount: userInfo.user.head_count,
      });
    } catch (error) {
      console.error("Error fetching booking info:", error);
      setBookingInfo(null); // 에러 발생 시 예매 정보 초기화
    }
  };

  // 클릭 이벤트 핸들러
  const handleClickOutside = (event) => {
    if (bookingInfo && !event.target.closest('.seats-button-info-container')) {
      setBookingInfo(null); // 예약 정보 초기화
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [bookingInfo]);

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
              <option value="1">2024.11.16 (토) 18:00</option>
            </select>
          </div>
          <div className="session-picker-right" onClick={handleChevronClick} ><ChevronDown size={21} color="#3C3C3C" /></div>
        </div>
      </div>

      {bookingInfo && (
        <div className='seats-button-info-container'>
          <div className='seats-button-info-item'>
            <img src={personIcon} className='seats-button-info-icon' />
            <p>예매자</p>
            <span>{bookingInfo.name}</span>
          </div>

          <div className="seats-button-info-divider"></div>

          <div className='seats-button-info-item'>
            <img src={phoneIcon} className='seats-button-info-icon' />
            <p>연락처</p>
            <span>{bookingInfo.phone}</span>
          </div>

          <div className="seats-button-info-divider"></div>

          <div className='seats-button-info-item'>
            <img src={seatIcon} className='seats-button-info-icon' />
            <p>좌석 수</p>
            <span>{bookingInfo.headCount}석</span>
          </div>
        </div>
      )}

      <SeatMap
        selectedSeats={selectedSeats}
        setSelectedSeats={setSelectedSeats}
        setIsAlreadySelectedModalOpen={setIsAlreadySelectedModalOpen}
        scheduleId={selectedSession}
        selectedSession={0}
        isRealTime={true}
        onSeatClick={handleSeatClick} // 좌석 클릭 핸들러 전달
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
          여석 {availableSeats}석
        </button>
      </div>

      <BottomNav /> {/* 항상 하단에 고정된 네비게이션 바 */}

    </div>

  );
}

export default RealTimeSeats;