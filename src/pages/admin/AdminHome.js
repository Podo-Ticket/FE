import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SERVER_URL } from '../../constants/ServerURL';

import DefaultErrorModalD2U from '../../components/modal/DefaultErrorModalD2U'

import '../../styles/admin/AdminHome.css';
import podoIcon from '../../assets/images/podo_icon.png'

function AdminHome() {
  const navigate = useNavigate();
  const [adminCode, setAdminCode] = useState('');
  const [isInvalidCodeModalOpen, setIsInvalidCodeModalOpen] = useState(false);
  const [invalidErrorMessage, setInvalidErrorMessage] = useState('');
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

  const handleSubmit = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/admin`, {
        withCredentials: true, // 세션 쿠키 포함
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          code: adminCode,
        },
      });

      if (response.data.success) {
        navigate('/seats'); // 인증 성공 시 이동
      }
    } catch (error) {
      if (error.response && error.response.data.error) {
        setInvalidErrorMessage('잘못된 인증 코드입니다.');
        setIsInvalidCodeModalOpen(true); // 인증 실패 시 모달 열기
      } else {
        console.error("Error during API call:", error);
      }
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

      <DefaultErrorModalD2U
        isOpen={isInvalidCodeModalOpen}
        onClose={() => setIsInvalidCodeModalOpen(false)}
        errorMessage={invalidErrorMessage}
      />

    </div>
  );
}

export default AdminHome;

