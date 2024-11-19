import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { RotateCw } from 'lucide-react';

import '../styles/SelectSeats.css';
import { SERVER_URL } from '../constants/ServerURL';
import { useSchedule } from '../hook/ScheduleContext';

import SeatMap from '../components/SeatMap';
import errorIcon from '../assets/images/error_icon.png'

function SelectSeats() {
  const navigate = useNavigate();
  const location = useLocation();
  const { scheduleId, setScheduleId } = useSchedule();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isAlreadySelectedModalOpen, setIsAlreadySelectedModalOpen] = useState(false);
  const [headCount, setHeadCount] = useState(0); // headCount 상태 추가
  const [isClosing, setIsClosing] = useState(false);
  const [error, setError] = useState(null); // 오류 상태 추가

  const [currentScheduleId, setCurrentScheduleIdState] = useState(null);

  // 좌석 정보 API 호출
  const fetchSeats = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/seat`, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, // 쿠키 포함
      });

      setCurrentScheduleIdState(1);
      // 성공적으로 응답을 받으면 headCount와 좌석 정보를 상태에 저장
      setHeadCount(response.data.headCount);

      // 좌석 정보를 사용하려면 추가적인 상태를 여기에서 설정할 수 있습니다.
    } catch (error) {
      console.error('Error fetching seats:', error);
      setError('좌석 정보를 가져오는 데 실패했습니다.'); // 오류 메시지 설정
    }
  };

  useEffect(() => {
    setCurrentScheduleIdState(1);
  }, []); // 컴포넌트가 마운트될 때 한 번만 실행

  useEffect(() => {
    if (currentScheduleId) {
      fetchSeats(); // currentScheduleId가 변경될 때마다 좌석 정보 가져오기
    }
  }, [currentScheduleId]);

  // 이미 선택된 좌석 모달 함수
  const handleAlreadySelectedOverlayClick = () => {
    setIsClosing(true); // 애니메이션 시작
    setTimeout(() => {
      setIsAlreadySelectedModalOpen(false); // 모달 닫기
      setIsClosing(false); // 애니메이션 상태 초기화
    }, 300); // 애니메이션과 같은 시간으로 설정
  };

  // 좌석 선택란 새로고침
  const handleRefresh = async () => {
    window.location.reload(); // 페이지 새로 고침
  };

  // 좌석 확인 및 발권 요청 함수
  const handleTicketCheck = async () => {

    try {
      const seats = selectedSeats.map(seat => {
        const row = seat.slice(0, 2); // 좌석 ID의 첫 두 문자를 행으로 설정
        const column = parseInt(seat.slice(2)); // 나머지 부분을 숫자로 변환하여 column으로 설정

        return { "row": row, "number": column }; // 객체 형식으로 변환
      });

      const encodedSeats = encodeURIComponent(JSON.stringify(seats));

      const response = await axios.get(`${SERVER_URL}/seat/check`, {
        params: {
          scheduleId: 1, // 공연 일시 ID
          seats: encodedSeats, // 좌석 정보 인코딩
        },
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, // 쿠키 포함
      });

      if (response.data.success) {
        // 좌석이 유효한 경우
        navigate('/confirm', { state: { selectedSeats } }); // 선택한 좌석과 함께 확인 페이지로 이동
      } else {
        // 이미 선택된 좌석일 경우
        setIsAlreadySelectedModalOpen(true);
      }
    } catch (error) {
      console.error('Error checking seats:', error);
      setError('좌석 확인에 실패했습니다.'); // 오류 메시지 설정
    }

  };

  const goToTicket = () => {
    // 선택한 좌석에서 행 이름과 열 번호를 유지
    const transformedSeats = selectedSeats.map(seat => {
      const row_t = seat.charAt(0); // 행 이름 (예: '나')
      const column_t = seat.slice(1); // 열 번호 (예: '1')

      return `${row_t}${column_t.length > 1 ? column_t.slice(1) : ''}`; // 첫 번째 숫자 제거
    });

    // 변환된 좌석 배열을 state로 전달
    navigate('/confirm', { state: { selectedSeats: transformedSeats } });
  };


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
        scheduleId={currentScheduleId}
        headCount={headCount}
        isRealTime={false}
      />

      {selectedSeats.length >= 0 && (
        <button className={`select-confirm-button ${selectedSeats.length === parseInt(headCount) ? 'select-confirm-button-active' : ''}`}
          onClick={handleTicketCheck}
          disabled={selectedSeats.length < parseInt(headCount)}
        >
          선택 완료 {selectedSeats.length} / {headCount}
        </button>
      )}


      {isAlreadySelectedModalOpen && (
        <div className="already-seat-modal-overlay" onClick={handleAlreadySelectedOverlayClick}>
          <div className={`already-seat-modal-content ${isClosing ? 'seat-close-animation' : ''}`}>
            <img className="error-icon" src={errorIcon} />
            <span className="error-message">다른 고객님께서 이미 선택한 좌석입니다.</span>
          </div>
        </div>
      )}

    </div>
  );
};

export default SelectSeats;