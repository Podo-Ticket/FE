import poster from '../image/poster.png'
import '../css/App.css';
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
function App() {
  const navigate = useNavigate();

  const goToSeatSelection = () => {
    navigate('/seat-selection');
  };

  return (

    <div className="container">
      <h1 className="title">보러오신 공연이 맞나요?</h1>
      <div className="poster-details-container">
        <div className="image-container">
          <img src={poster} alt="공연 포스터" className="poster" />
        </div>
        <div className="show-details">
          <h2>밤으로의 긴 여로</h2>
          <h3>광운대학교 새빛관 대강의실</h3>
          <h3>2024.09.05 ~ 2024.09.07 15:00</h3>
        </div>
      </div>
      <div className="button-container">
        <button className="exit-button">나가기</button>
        <button onClick={goToSeatSelection} className="ticket-button">티켓 받기</button>
      </div>
    </div>

  );
}

export default App;
