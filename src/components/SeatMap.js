import axios from 'axios';
import React, { useRef, useEffect, useState } from 'react';

import { SERVER_URL } from '../constants/ServerURL';

import '../styles/SeatMap.css';

const rows_l = {
  나1: [1, 2, 3, 4, 5, 6],
  나2: [7, 8, 9, 10, 11, 12, 13],
  나3: [14, 15, 16, 17, 18, 19, 20, 21],
  나4: [22, 23, 24, 25, 26, 27, 28, 29],
  나5: [30, 31, 32, 33, 34, 35, 36, 37, 38],
  나6: [39, 40, 41, 42, 43, 45, 46, 47, 48],
  나7: [49, 50, 51, 52, 53, 54, 55, 56, 57, 58],
  나8: [59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69]
};

const rows_r = {
  다1: [1, 2, 3, 4, 5, 6],
  다2: [7, 8, 9, 10, 11, 12, 13],
  다3: [14, 15, 16, 17, 18, 19, 20, 21],
  다4: [22, 23, 24, 25, 26, 27, 28, 29],
  다5: [30, 31, 32, 33, 34, 35, 36, 37, 38],
  다6: [39, 40, 41, 42, 43, 45, 46, 47, 48],
  다7: [49, 50, 51, 52, 53, 54, 55, 56, 57, 58],
  다8: [59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69]
};

const SeatMap = ({ selectedSeats, setSelectedSeats, setIsAlreadySelectedModalOpen,
  disabled, scheduleId, headCount, isRealTime, onSeatClick }) => {

  const seatMapRef = useRef(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [allBookedSeats, setallBookedSeats] = useState([]);


  useEffect(() => {
    const fetchSeats = async () => {
      if (!scheduleId) {
        console.error("scheduleId가 없습니다.");
        return;
      }

      try {
        const endpoint = isRealTime ? `${SERVER_URL}/seat/realTime` : `${SERVER_URL}/seat`;
        const response = await axios.get(endpoint, {
          withCredentials: true, // 세션 쿠키 포함
          headers: {
            'Content-Type': 'application/json',
          },
          params: { scheduleId },
        });

        // bookedSeats를 API 응답에 따라 설정
        const booked = response.data.seats.map(seat => `${seat.row}${seat.number}`);
        setBookedSeats(booked); // bookedSeats 상태 업데이트
        setallBookedSeats(response.data);

        console.log("아래는 (allBookedSeats);");
        console.log(allBookedSeats.seats);

        console.log("예약된 좌석:", booked); // 예약된 좌석 로그 출력
      } catch (error) {
        console.error("Error fetching seats:", error);
      }
    };

    fetchSeats(); // scheduleId가 있을 때만 호출
  }, [scheduleId]);

  const handleSeatClick = (seatId) => {
    if (disabled) return;

    // 좌석 클릭 시 예매 정보 API 호출
    if (isRealTime) {
      const bookedSeatIndex = bookedSeats.findIndex(bookedId => bookedId === seatId);
      if (bookedSeatIndex !== -1) {
        // allBookedSeats에서 해당 좌석 ID를 조회하여 ID 값을 찾기
        const bookedSeatInfo = allBookedSeats.seats[bookedSeatIndex]; // 좌석 정보 가져오기
        const bookedSeatId = bookedSeatInfo.id; // 좌석 ID 가져오기
        onSeatClick(bookedSeatId); // 좌석 클릭 시 예매 정보 요청
        console.log("찐막이다");
        console.log(bookedSeatId);
        console.log("찐막이라고");
        return; // 예매 정보 요청 후 함수 종료
      }
    }

    if (bookedSeats.includes(seatId)) {
      setIsAlreadySelectedModalOpen(true);
    } else if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else if (selectedSeats.length < headCount) { // headCount에 따라 좌석 선택 제한
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  return (
    <div className="seat-map">
      <div className="stage-container">
        <svg xmlns="http://www.w3.org/2000/svg" width="360" height="60" viewBox="0 0 329 40" fill="none" className="stage">
          <g filter="url(#filter0_d_710_26307)">
            <path d="M6.85747 7.3947C5.92831 4.19588 8.32797 1 11.659 1H317.341C320.672 1 323.072 4.19588 322.143 7.3947L316.914 25.3947C316.294 27.5307 314.337 29 312.113 29H16.8874C14.6632 29 12.7064 27.5307 12.0859 25.3947L6.85747 7.3947Z" fill="#F2F2F2" />
            <path d="M7.33762 7.25523C6.50138 4.3763 8.66108 1.5 11.659 1.5H317.341C320.339 1.5 322.499 4.37629 321.662 7.25523L316.434 25.2552C315.876 27.1776 314.114 28.5 312.113 28.5H16.8874C14.8856 28.5 13.1245 27.1776 12.5661 25.2552L7.33762 7.25523Z" stroke="#E2E2E2" />
          </g>
          <text x="50%" y="40%" textAnchor="middle" alignmentBaseline="middle" fill="#777" fontSize="12" fontWeight="500">
            무대
          </text>
          <defs>
            <filter id="filter0_d_710_26307" x="0.655884" y="0" width="327.688" height="40" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dy="5" />
              <feGaussianBlur stdDeviation="3" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_710_26307" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_710_26307" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>

      <div className="seat-map-customer" ref={seatMapRef}>
        {/* Left section seats */}
        <div className="seat-row">
          {Object.keys(rows_l).map(row => (
            <div key={row} className="seat-column">
              {rows_l[row].map(seat => {
                const seatId = `${row}${seat}`;
                const isBooked = bookedSeats.includes(seatId);
                return (
                  <button
                    key={seatId}
                    className={`seat ${selectedSeats.includes(seatId) ? 'selected' : ''} ${isBooked ? 'booked' : ''}`}
                    onClick={isRealTime ? () => handleSeatClick(seatId) : () => handleSeatClick(row, seat)}
                    disabled={disabled}
                  >
                    나 {seat}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Right section seats */}
        <div className="seat-row">
          {Object.keys(rows_r).map(row => (
            <div key={row} className="seat-column">
              {rows_r[row].map(seat => {
                const seatId = `${row}${seat}`;
                const isBooked = bookedSeats.includes(seatId);
                return (
                  <button
                    key={seatId}
                    className={`seat ${selectedSeats.includes(seatId) ? 'selected' : ''} ${isBooked ? 'booked' : ''}`}
                    onClick={isRealTime ? () => handleSeatClick(seatId) : () => handleSeatClick(row, seat)}
                    disabled={disabled}>
                    다 {seat}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeatMap;