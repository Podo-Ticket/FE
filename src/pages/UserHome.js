import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';

import '../styles/UserHome.css';

import Loading from '../components/modal/LoadingModal';  // 로딩 컴포넌트 가져오기
import CompleteModal from '../components/modal/CompleteModal';
import PhoneModal from '../components/modal/PhoneModal'; // 모달 컴포넌트 불러오기
import poster from '../assets/images/poster4.png'

function App() {
  const navigate = useNavigate();
  const popupRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);  // 로딩 상태 관리
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const openPhoneModal = () => {
    setIsPhoneModalOpen(true);
  };

  const closePhoneModal = () => {
    setIsPhoneModalOpen(false);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  // 팝업 외부 클릭 시 팝업 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsPopupVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);



  const goToSeatSelection = () => {
    setIsLoading(true);  // Start loading
    setTimeout(() => {
      setIsLoading(false);  // End loading after 1 second
      setIsComplete(true);   // Show CompleteModal
      setTimeout(() => {
        setIsComplete(false);  // Hide CompleteModal after 1 second
        navigate('/select');
      }, 1000);  // CompleteModal shows for 1 second
    }, 1000);  // Loading time: 1 second
  };

  const handleCompleteClose = () => {
    setIsComplete(false); // Hide CompleteModal
    navigate('/select'); // Navigate after closing
  };

  return (
    <div className="main-container">
      <h1 className="main-title">공연 입장을 도와드릴게요!</h1>

      <div className="poster-details-container">
        <div className={`card ${isFlipped ? "flipped" : ""}`}>

          <div className="card-front">
            <div className="image-container">
              <img src={poster} alt="공연 포스터" className="poster" />
              <div className="image-overlay"></div> {/* 오버레이용 div 추가 */}
              <div className="show-details">
                <h2>밤으로의 긴 여로</h2>
                <h3>2024.10.09 17:00 공연</h3>
              </div>
            </div>

            <div className="detail-container">

              <div className="info-item">
                <span>연출</span>
                <p>이서희</p>
              </div>
              <div className="info-item">
                <span>작</span>
                <p>유진 오닐</p>
              </div>
              <div className="info-item">
                <span>배우</span>
                <p>최우승, 권연우, 홍세림, 이서진</p>
                <div className="detail-more-small" onClick={togglePopup}>
                  더보기

                  {isPopupVisible && (
                    <div className="speech-bubble" ref={popupRef}>
                      <div>최우승, 권연우, 홍세림, 이서진,</div>
                      <div>이진성</div>
                    </div>
                  )}

                </div>
              </div>
              <div className="info-item">
                <span>관람 시간</span>
                <p>100분</p>
              </div>
              <div className="info-item">
                <span>장소</span>
                <p>광운대학교 새빛관 대강의실</p>
              </div>

              <div className="detail-more-button" onClick={handleFlip}>
                <span>자세히 보기 {'>'}</span>
              </div>

              {/* 절취선과 구멍 */}
              <div className="perforation-line">
                <div className="hole left-hole"></div>
                <div className="hole right-hole"></div>
              </div>

              <div className="button-container">
                <button onClick={openPhoneModal} className="ticket-button">티켓 받기</button>
                <PhoneModal
                  showPhoneModal={isPhoneModalOpen}
                  closePhoneModal={closePhoneModal}
                  startLoading={goToSeatSelection} />
              </div>
            </div>
          </div>

          <div className="card-back">
            <div className="detail-container back-info">

              <div className="detail-more-nav">
                <div className="go-front-button" onClick={handleFlip}>{'<'}</div>
                <div className="detail-more-title">상세 정보</div>
              </div>

              <div className="info-item-container">
                <div className="info-item back-item">
                  <span>연출</span>
                  <p>서 준</p>
                </div>
                <div className="info-item">
                  <span>작</span>
                  <p>악덕연출</p>
                </div>
                <div className="info-item">
                  <span>배우</span>
                  <p>최우승, 권연우, 홍세림, 이서진</p>
                  <div className="detail-more-small" onClick={togglePopup}>
                    더보기

                    {isPopupVisible && (
                      <div className="speech-bubble" ref={popupRef}>
                        <div>최우승, 권연우, 홍세림, 이서진,</div>
                        <div>이진성</div>
                      </div>
                    )}

                  </div>
                </div>
                <div className="info-item">
                  <span>조명</span>
                  <p>이상현</p>
                </div>
                <div className="info-item">
                  <span>무대</span>
                  <p>구현준</p>
                </div>
                <div className="info-item">
                  <span>음악</span>
                  <p>유두현</p>
                </div>
                <div className="info-item">
                  <span>소품</span>
                  <p>김현정</p>
                </div>
                <div className="info-item">
                  <span>관람 시간</span>
                  <p>900분</p>
                </div>
                <div className="info-item">
                  <span>장소</span>
                  <p>광운대학교 새빛관 대강의실</p>
                </div>
                <div className="info-item">
                  <span>공연 기간</span>
                  <p>2024.01.01 ~ 2024.12.31</p>
                </div>
              </div>


              {/* 절취선과 구멍 */}
              <div className="perforation-line">
                <div className="hole left-hole"></div>
                <div className="hole right-hole"></div>
              </div>

              <div style={{ height: '80px' }}></div>

            </div>
          </div>
        </div>
      </div>

      {/* 로딩 컴포넌트 표시 */}
      {isLoading && <Loading isOpen={isLoading} />}
      <CompleteModal isOpen={isComplete} onClose={handleCompleteClose} />
    </div>
  );
}

export default App;