import axios from 'axios';
import React, { useRef, useEffect, useState } from 'react';

import { SERVER_URL } from '../constants/ServerURL';

import stage from '../assets/image/stage.png'
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
  disabled, scheduleId, headCount, isRealTime, onSeatClick, bookingInfo }) => {

  const seatMapRef = useRef(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [allBookedSeats, setallBookedSeats] = useState([]);
  const [temporarySelectedSeats, setTemporarySelectedSeats] = useState([]); // 일시적으로 선택된 좌석

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

  useEffect(() => {
    if (!bookingInfo) {
      setTemporarySelectedSeats([]); // bookingInfo가 null이 될 때 temporarySelectedSeats 초기화
    }
  }, [bookingInfo]);

  const handleSeatClick = (seatId) => {
    if (disabled) return;

    // 좌석 클릭 시 예매 정보 API 호출
    if (isRealTime) {
      const bookedSeatIndex = bookedSeats.findIndex(bookedId => bookedId === seatId);
      if (bookedSeatIndex !== -1) {
        const bookedSeatInfo = allBookedSeats.seats[bookedSeatIndex];
        const bookedSeatId = bookedSeatInfo.id;
        onSeatClick(bookedSeatId);

        // 좌석 클릭 시 해당 좌석을 temporarySelectedSeats에 추가
        const userSeats = bookingInfo ? bookingInfo.seats.map(seat => `${seat.row}${seat.number}`) : [];
        setTemporarySelectedSeats(userSeats); // userSeats를 일시적으로 선택된 좌석으로 설정
        return;
      }
    } else {
      // 일반 좌석 선택 로직
      console.log(seatId);

      if (bookedSeats.includes(seatId)) {
        setIsAlreadySelectedModalOpen(true);
      } else if (selectedSeats.includes(seatId)) {
        // 이미 선택된 좌석을 클릭하면 선택 취소
        setSelectedSeats(selectedSeats.filter(id => id !== seatId));
        setTemporarySelectedSeats([]); // 선택 해제 시 원래 색으로 복원
      } else if (selectedSeats.length < headCount) {
        // headCount에 따라 좌석 선택 제한
        setSelectedSeats([...selectedSeats, seatId]);
        setTemporarySelectedSeats([]); // 이전 선택된 좌석의 색 복원
      }
    }
  };

  const handleUserSeatClick = (row, seat) => {
    const seatId = `${row}${seat}`; // 좌석 ID 생성

    if (bookedSeats.includes(seatId)) {
      setIsAlreadySelectedModalOpen(true);
    } else if (selectedSeats.includes(seatId)) {
      // 이미 선택된 좌석을 클릭하면 선택 취소
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
      setTemporarySelectedSeats([]); // 선택 해제 시 원래 색으로 복원
    } else if (selectedSeats.length < headCount) {
      // headCount에 따라 좌석 선택 제한
      setSelectedSeats([...selectedSeats, seatId]);
      setTemporarySelectedSeats([]); // 이전 선택된 좌석의 색 복원
    }
  }

  // bookingInfo에서 userSeats를 가져와서 temporarySelectedSeats에 추가
  useEffect(() => {
    if (bookingInfo) {
      const userSeats = bookingInfo.seats.map(seat => `${seat.row}${seat.number}`);
      setTemporarySelectedSeats(userSeats); // userSeats를 일시적으로 선택된 좌석으로 설정
    }
  }, [bookingInfo]);

  // temporarySelectedSeats 값이 변경될 때 로그 출력
  useEffect(() => {
    console.log("temporarySelectedSeats:", temporarySelectedSeats);
  }, [temporarySelectedSeats]);


  return (
    <div className="seat-map">
      <div className="stage-container">
        <img src={stage} className="stage" />
        <span className="stage-label">무대</span>
      </div>

      <div className="seat-map-customer" ref={seatMapRef}>
        {/* Left section seats */}
        <div className="seat-row">
          {Object.keys(rows_l).map(row => (
            <div key={row} className="seat-column">
              {rows_l[row].map(seat => {
                const seatId = `${row}${seat}`;
                const isBooked = bookedSeats.includes(seatId);
                const isTemporarySelected = temporarySelectedSeats.includes(seatId);

                return (
                  <button
                    key={seatId}
                    className={`seat ${selectedSeats.includes(seatId) ? 'selected' : ''} ${isBooked ? 'booked' : ''} ${isTemporarySelected ? 'temporary-selected' : ''}`}
                    onClick={isRealTime ? () => handleSeatClick(seatId) : () => handleUserSeatClick(row, seat)}
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
                const isTemporarySelected = temporarySelectedSeats.includes(seatId);

                return (
                  <button
                    key={seatId}
                    className={`seat ${selectedSeats.includes(seatId) ? 'selected' : ''} ${isBooked ? 'booked' : ''} ${isTemporarySelected ? 'temporary-selected' : ''}`}
                    onClick={isRealTime ? () => handleSeatClick(seatId) : () => handleUserSeatClick(row, seat)}
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