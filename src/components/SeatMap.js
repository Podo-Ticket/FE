import React, { useRef, useEffect } from 'react';

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

const bookedSeats = ["나11", "나12", "나13", "다530", "다531", "나536", "나537"];

const SeatMap = ({ selectedSeats, setSelectedSeats, setIsAlreadySelectedModalOpen, disabled }) => {
  const seatMapRef = useRef(null);

  useEffect(() => {
    // 컴포넌트가 처음 렌더링될 때 seat-map-customer 컨테이너의 중간으로 스크롤
    if (seatMapRef.current) {
      seatMapRef.current.scrollTo({
        top: seatMapRef.current.scrollHeight / 2 - seatMapRef.current.clientHeight / 2,
        left: seatMapRef.current.scrollWidth / 2,
        behavior: 'smooth'
      });
    }
  }, []);

  const handleSeatClick = (row, seat) => {
    if (disabled) return; // 버튼이 비활성화된 경우 클릭 무시

    const seatId = `${row}${seat}`;
    if (bookedSeats.includes(seatId)) {
      setIsAlreadySelectedModalOpen(true);
    } else if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else if (selectedSeats.length < 3) {
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
                    onClick={() => handleSeatClick(row, seat)}
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
                    onClick={() => handleSeatClick(row, seat)}
                    disabled={disabled}
                  >
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