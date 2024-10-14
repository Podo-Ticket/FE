import React, { useState } from 'react';
import '../css/seatSelection.css';
import { useNavigate } from 'react-router-dom';

const rows = {
  A: [1, 2, 3, 4, 5, 6, 7],
  B: [1, 2, 3, 4, 5, 6, 7],
  C: [1, 2, 3, 4, 5, 6, 7],
  D: [1, 2, 3, 4, 5, 6, 7, 8],
  E: [1, 2, 3, 4, 5, 6, 7, 8]
};

function SeatSelection() {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  const [isAlreadySelectedModalOpen, setIsAlreadySelectedModalOpen] = useState(false);
  const bookedSeats = ["A1", "B2", "C3"]; // 이미 선택된 좌석
  const navigate = useNavigate();

  const handleSeatClick = (row, seat) => {
    const seatId = `${row}${seat}`;
    console.log(`좌석 클릭됨: ${seatId}, isModalOpen: ${isModalOpen}`); // 디버깅용
    if (bookedSeats.includes(seatId)) {
      setIsAlreadySelectedModalOpen(true); // 이미 선택된 좌석 클릭 시 모달 열기
    } else if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else if (selectedSeats.length < 3) {
      setSelectedSeats([...selectedSeats, seatId]);
    } else {
      setIsLimitModalOpen(true); // 최대 선택 수 초과 시 모달 열기
    }
  };

  const handleTicketButtonClick = () => {
    if (selectedSeats.length === 3) {
      setIsModalOpen(true); // 모달 창 열기
    } else {
      alert('좌석을 3개 선택해야 합니다.');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // 모달 창 닫기
  };

  const handleLimitOverlayClick = () => {
    setIsLimitModalOpen(false); // 최대 좌석 수 초과 모달 닫기
  };

  const handleAlreadySelectedOverlayClick = () => {
    setIsAlreadySelectedModalOpen(false); // 이미 선택된 좌석 모달 닫기
  };


  const goToTicket = () => {
    navigate('/ticket');
  };

  return (
    <div className="seat-selection-container">
      <h2>좌석을 선택해주세요</h2>
      <p>{selectedSeats.length}/3 좌석 선택됨</p>

      <div className="seat-map">
        {Object.keys(rows).map(row => (
          <div key={row} className="seat-row">
            <span>{row}</span>
            {rows[row].map(seat => {
              const seatId = `${row}${seat}`;
              const isBooked = bookedSeats.includes(seatId);
              return (
                <button
                  key={seatId}
                  className={`seat ${selectedSeats.includes(seatId) ? 'selected' : ''} ${isBooked ? 'booked' : ''}`}
                  onClick={() => handleSeatClick(row, seat)}
                >
                  {seat}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {selectedSeats.length === 3 && (
        <button className="confirm-button" onClick={handleTicketButtonClick}>
          선택 완료
        </button>
      )}

      {/* 선택한 좌석을 확인하는 모달 창 */}
      {isModalOpen && (
        <div className="modal-overlay" style={{
          position: 'absolute',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div className="modal-content ">
            <h3>선택한 좌석으로 티켓 발권 해드릴까요?</h3>
            <div className="selected-seats">
              {selectedSeats.map(seat => (
                <div key={seat} className="seat-box">
                  {seat}
                </div>
              ))}
            </div>
            <p>발권 이후 좌석 변경은 <span className="warning">불가</span>합니다.</p>
            <button onClick={handleCloseModal} className="back-button-seat">돌아가기</button>
            <button className="ticket-button-seat" onClick={goToTicket}>티켓 발권</button>
          </div>
        </div>
      )}

      {/* 최대 좌석 수 초과 경고 모달 */}
      {isLimitModalOpen && (
        <div className="modal-overlay " onClick={handleLimitOverlayClick}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="error-message">최대 3자리까지만 선택할 수 있습니다.</h3>
          </div>
        </div>
      )}

      {/* 이미 선택된 좌석 경고 모달 */}
      {isAlreadySelectedModalOpen && (
        <div className="modal-overlay " onClick={handleAlreadySelectedOverlayClick}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="error-message">이미 선택된 좌석입니다.</h3>
          </div>
        </div>
      )}

    </div>
  );
}

export default SeatSelection;