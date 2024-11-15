import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';

import '../styles/UserHome.css';

import ReserveWayModal from '../components/modal/ReserveWayModal';
import Loading from '../components/modal/LoadingModal';  // 로딩 컴포넌트 가져오기
import CompleteModal from '../components/modal/CompleteModal';
import PhoneModal from '../components/modal/PhoneModal'; // 모달 컴포넌트 불러오기
import poster from '../assets/images/poster.jpg'
import homeTicket from '../assets/images/home_ticket.png'
import errorIcon from '../assets/images/error_icon.png'
import { ChevronLeft, ChevronRight } from 'lucide-react';

const validPhoneNumbers = ['010-1234-1234', '010-2559-4304'];

function UserHome() {
  const navigate = useNavigate();
  const popupRef = useRef(null);

  //Functional modal declaration
  const [isReserveWayModalOpen, setIsReserveWayModalOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isInvalidPhoneModalOpen, setIsInvalidPhoneModalOpen] = useState(false);
  const [isInvalidPhoneModalClosing, setIsInvalidPhoneModalClosing] = useState(false);

  //Animation modal declaration
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const openPhoneModal = () => {
    setIsPhoneModalOpen(true);
  };

  const closePhoneModal = () => {
    setIsPhoneModalOpen(false);
  };

  const openReserveWayModal = () => {
    setIsReserveWayModalOpen(true);
  };

  const closeReserveWayModal = () => {
    setIsReserveWayModalOpen(false);
  };

  const handleCheckReservation = () => {
    openPhoneModal(); // 핸드폰 번호 검사 모달로 이동
  };

  const handleReserve = () => {
    navigate('/reserve'); // 현장 예매 페이지로 이동
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  const handleInvalidPhoneOverlayClick = () => {
    setIsInvalidPhoneModalClosing(true); // 애니메이션 시작
    setTimeout(() => {
      setIsInvalidPhoneModalOpen(false); // 모달 상태를 닫음
      setIsInvalidPhoneModalClosing(false); // 애니메이션 상태 초기화
    }, 300); // 애니메이션과 같은 시간으로 설정
  };

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

  const handlePhoneSubmit = (phone) => {
    if (!phone) {
      setIsInvalidPhoneModalOpen(true); // 핸드폰 번호가 없을 경우 InvalidPhoneModal 열기
    } else {
      goToSeatSelection(phone); // 핸드폰 번호를 전달하여 예매 진행
    }
  };

  const goToSeatSelection = (phone) => {
    setIsLoading(true);  // Start loading
    setTimeout(() => {
      // 1초가 지나면 검사를 시작

      if (!phone) {
        setIsLoading(false);
        setIsInvalidPhoneModalOpen(true); // 핸드폰 번호가 없을 경우 InvalidPhoneModal 열기
      } else if (!validPhoneNumbers.includes(phone)) {
        // 핸드폰 번호가 예매 내역에 없는 경우
        setIsLoading(false);
        setIsInvalidPhoneModalOpen(true);
      } else {
        setIsLoading(false);  // End loading after 1 second
        setIsComplete(true);   // Show CompleteModal
        setTimeout(() => {
          closePhoneModal(); // 유효한 핸드폰 번호일 경우 PhoneModal 닫기
          setIsComplete(false);  // Hide CompleteModal after 1 second
          navigate('/select');
        }, 1000);
      }
    }, 1000); // (로딩 1초)
  }

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
            <div className="card-background-image-container">
              <img className="card-background-image" src={homeTicket} alt="배경 이미지" />
            </div>

            <div className="image-container">
              <img src={poster} alt="공연 포스터" className="poster" />
              <div className="image-overlay"></div> {/* 오버레이용 div 추가 */}
              <div className="show-details">
                <h2>옥탑방 고양이</h2>
                <h3>2024.11.16 18:00 공연</h3>
              </div>
            </div>

            <div className="detail-container">

              <div className="home-info-item">
                <span>연출</span>
                <p>곽민지</p>
              </div>
              <div className="home-info-item">
                <span>작</span>
                <p>김유리</p>
              </div>
              <div className="home-info-item">
                <span>배우</span>
                <p>황소원, 송현태, 김민채, 지현우</p>
                <div className="detail-more-small" onClick={togglePopup}>
                  더보기

                  {isPopupVisible && (
                    <div className="speech-bubble" ref={popupRef}>
                      <div>황소원, 송현태, 김민채, 지현우,</div>
                      <div>이현진, 김서연, 이동훈, 김태형,</div>
                      <div>김원중, 김민재, 박준석, 황준혁</div>
                    </div>
                  )}

                </div>
              </div>
              <div className="home-info-item">
                <span>관람 시간</span>
                <p>90분</p>
              </div>
              <div className="home-info-item">
                <span>장소</span>
                <p>광운대학교 새빛관 대강의실</p>
              </div>

              <div className="detail-more-button" >
                <span onClick={handleFlip}>자세히 보기 <ChevronRight size={16} style={{ verticalAlign: 'middle' }} /></span>
              </div>

              <div className="button-container">
                <button onClick={openReserveWayModal} className="ticket-button">티켓 발권</button>
              </div>
            </div>
          </div>

          <div className="card-back">
            <div className="card-background-image-container">
              <img className="card-background-image" src={homeTicket} alt="배경 이미지" />
            </div>
            <div className="detail-container back-info">

              <div className="detail-more-nav">
                <div className="go-front-button" onClick={handleFlip}><ChevronLeft size={16} /></div>
                <div className="detail-more-title">상세 정보</div>
              </div>

              <div className="home-info-item-container">
                <div className="home-info-item back-item">
                  <span>연출</span>
                  <p>곽민지</p>
                </div>
                <div className="home-info-item">
                  <span>작</span>
                  <p>김유리</p>
                </div>
                <div className="home-info-item">
                  <span>배우</span>
                  <div className="home-info-item-content">
                    <p>황소원, 송현태, 김민채, 지현우, 이현진</p>
                    <p>김서연, 이동훈, 김태형,김원중, 김민재</p>
                    <p>박준석, 황준혁</p>
                  </div>
                </div>
                <div className="home-info-item">
                  <span>기획</span>
                  <p>박연수</p>
                </div>
                <div className="home-info-item">
                  <span>무대</span>
                  <p>이우준, 신혜교, 조준형</p>
                </div>
                <div className="home-info-item">
                  <span>관람 시간</span>
                  <p>90분</p>
                </div>
                <div className="home-info-item">
                  <span>장소</span>
                  <p>광운대학교 새빛관 대강의실</p>
                </div>
                <div className="home-info-item">
                  <span>공연 기간</span>
                  <p>2024.11.16 (토) 18:00</p>
                </div>
              </div>

              <div style={{ height: '80px' }}></div>

            </div>
          </div>
        </div>
      </div>

      <ReserveWayModal
        isOpen={isReserveWayModalOpen}
        onClose={closeReserveWayModal}
        onCheckReservation={handleCheckReservation} // 예매 내역 확인
        onReserve={handleReserve} // 현장 예매
      />

      <PhoneModal
        showPhoneModal={isPhoneModalOpen}
        closePhoneModal={closePhoneModal}
        startLoading={handlePhoneSubmit}
      />

      {isLoading && <Loading isOpen={isLoading} />}
      <CompleteModal
        isOpen={isComplete}
        onClose={handleCompleteClose}
      />

      {isInvalidPhoneModalOpen && (
        <div className="modal-invalid-phone-overlay" onClick={handleInvalidPhoneOverlayClick}>
          <div className={`modal-invalid-phone-content ${isInvalidPhoneModalClosing ? 'phone-close-animation' : ''}`}>
            <img className="error-icon" src={errorIcon} />
            <span className="error-message">예매내역을 확인할 수 없습니다.</span>
          </div>
        </div>
      )}

    </div>
  );
}

export default UserHome;