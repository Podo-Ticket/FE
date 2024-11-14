import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../styles/AdminHome.css';
import podoIcon from '../assets/image/podo_icon.png'

function AdminHome() {
  const navigate = useNavigate();
  const [adminCode, setAdminCode] = useState('');
  const [isInvalidCodeModalOpen, setIsInvalidCodeModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const isButtonDisabled = adminCode === '';

  const handleInputChange = (e) => {
    setAdminCode(e.target.value);
  };

  const handleInvalidCodeOverlayClick = () => {
    setIsClosing(true); // 애니메이션 시작
    setTimeout(() => {
      setIsInvalidCodeModalOpen(false); // 모달 닫기
      setIsClosing(false); // 애니메이션 상태 초기화
    }, 300); // 애니메이션과 같은 시간으로 설정
  };

  const handleSubmit = () => {
    if (adminCode === 'JAKGONG') {
      navigate('/seats');
    } else {
      setIsInvalidCodeModalOpen(true);
    }
  };

  return (
    <div className="admin-login-container">
      <h1 className="admin-title">ADMIN 접속</h1>

      <div className="admin-detail-container">

        <div className="admin-detail-description">
          <img src={podoIcon} className="admin-podo-icon" />
          <span>예매부터 입장까지!</span>
          <span>편리한 티켓 관리 솔루션,</span>
          <span><p className="podo-text">포도티켓</p> 입니다.</span>
        </div>

        <div className="admin-form-group">
          <label className="admin-submit-label" htmlFor="code">인증 코드</label>
          <input
            type="text"
            id="code"
            value={adminCode}
            placeholder="인증코드를 입력해주세요"
            onChange={handleInputChange}
            className="admin-input-code"
          />
          <button className={`admin-submit-button ${isButtonDisabled ? 'disabled' : ''}`}
            onClick={handleSubmit}
            disabled={isButtonDisabled}>
            접속
          </button>
        </div>
      </div>

      {isInvalidCodeModalOpen && (
        <div className="modal-invalid-code-overlay" onClick={handleInvalidCodeOverlayClick}>
          <div className={`modal-invalid-code-content ${isClosing ? 'close-animation' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none" className="error-icon">
              <path d="M7 10.5C7.19833 10.5 7.3647 10.4328 7.4991 10.2984C7.6335 10.164 7.70046 9.99786 7.7 9.8C7.69953 9.60213 7.63233 9.436 7.4984 9.3016C7.36446 9.1672 7.19833 9.1 7 9.1C6.80166 9.1 6.63553 9.1672 6.5016 9.3016C6.36766 9.436 6.30046 9.60213 6.3 9.8C6.29953 9.99786 6.36673 10.1642 6.5016 10.2991C6.63646 10.434 6.8026 10.5009 7 10.5ZM6.3 7.7H7.7V3.5H6.3V7.7ZM7 14C6.03166 14 5.12166 13.8161 4.27 13.4484C3.41833 13.0807 2.6775 12.582 2.0475 11.9525C1.4175 11.323 0.918867 10.5821 0.551601 9.73C0.184334 8.87786 0.000467552 7.96786 8.86075e-07 7C-0.00046578 6.03213 0.183401 5.12213 0.551601 4.27C0.9198 3.41787 1.41843 2.67703 2.0475 2.0475C2.67657 1.41797 3.4174 0.919333 4.27 0.5516C5.1226 0.183867 6.0326 0 7 0C7.9674 0 8.87739 0.183867 9.72999 0.5516C10.5826 0.919333 11.3234 1.41797 11.9525 2.0475C12.5816 2.67703 13.0804 3.41787 13.4491 4.27C13.8178 5.12213 14.0014 6.03213 14 7C13.9986 7.96786 13.8147 8.87786 13.4484 9.73C13.0821 10.5821 12.5834 11.323 11.9525 11.9525C11.3216 12.582 10.5807 13.0809 9.72999 13.4491C8.87926 13.8173 7.96926 14.0009 7 14Z" fill="#FF1515" />
            </svg>
            <span className="error-message">잘못된 인증 코드입니다.</span>
          </div>
        </div>
      )}
    </div>

  );
}

export default AdminHome;

