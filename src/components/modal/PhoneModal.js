import React, { useState } from 'react';

import '../../styles/PhoneModal.css';

function PhoneModal({ showPhoneModal, closePhoneModal, startLoading }) {
  const [isChecked, setIsChecked] = useState(false); // 체크박스 상태 관리  
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [phone, setPhone] = useState(''); // 전화번호 상태 추가

  const openPrivacyModal = () => {
    setShowPrivacyModal(true);
  };

  const closePrivacyModal = () => {
    setShowPrivacyModal(false);
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // 숫자만 남기기
    let formattedValue = '';

    // 전화번호 형식에 맞게 하이픈 추가
    if (value.length > 0) {
      formattedValue += value.slice(0, 3);
    }
    if (value.length > 3) {
      formattedValue += '-' + value.slice(3, 7);
    }
    if (value.length > 7) {
      formattedValue += '-' + value.slice(7, 11);
    }

    setPhone(formattedValue);
  };

  if (!showPhoneModal) return null;

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  // Determine if the "다음" button should be enabled
  const isButtonEnabled = isChecked && phone.length === 13; // Assuming formatted phone is "000-0000-0000"

  return (
    <div className="modal-overlay-phone">
      <div className="modal-content-phone">
        <h2>예매 내역 확인</h2>

        <input className="phone-input" type="text" placeholder="전화번호를 입력해 주세요"
          value={phone}
          onChange={handlePhoneChange} />

        <div className="agreement-container">
          <label className="agreement-label">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
              className="agreement-checkbox"
            />
            <span className="custom-checkbox"></span>
            <span>개인정보 수집 동의</span>
          </label>
          <a href="#" className="agreement-link" onClick={openPrivacyModal}>전문보기</a>
        </div>

        <div className="phone-modal-buttons">
          <button onClick={closePhoneModal} className="phone-back-button">이전</button>
          <button
            onClick={isButtonEnabled ? startLoading : null} // Only start loading if conditions are met
            className="phone-ticket-button"
            style={{
              backgroundColor: isButtonEnabled
                ? 'var(--purple-purple-4-main, #6A39C0)'
                : 'var(--purple-purple-9, #DFCDFF)',
            }}
            disabled={!isButtonEnabled} // Disable button if conditions are not met
          >
            다음
          </button>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="modal-overlay-privacy">
          <div className="modal-content-privacy">
            <h2>개인정보 수집 동의의 약관</h2>
            <div className="container-content-privacy">
              <p> ① 회원의 개인정보는 공공기관의 개인정보보호법에 의해 보호되며 당 사이트의 개인정보처리방침이 적용됩니다. </p>
              <p>② 당 사이트의 회원 정보는 다음과 같이 수집, 사용, 관리, 보호됩니다.</p>
              <p>1. 개인정보의 수집 : 당 사이트는 회원 가입시 회원이 제공하는 정보를 수집합니다.</p>
              <p>2. 개인정보의 사용 : 당 사이트는 서비스 제공과 관련해서 수집된 회원정보를 본인의 승낙 없이 제3자에게 누설, 배포하지 않습니다. 누설, 배포하지 않습니다.</p>
              <p> ① 회원의 개인정보는 공공기관의 개인정보보호법에 의해 보호되며 당 사이트의 개인정보처리방침이 적용됩니다. </p>
              <p>② 당 사이트의 회원 정보는 다음과 같이 수집, 사용, 관리, 보호됩니다.</p>
              <p>1. 개인정보의 수집 : 당 사이트는 회원 가입시 회원이 제공하는 정보를 수집합니다.</p>
              <p>2. 개인정보의 사용 : 당 사이트는 서비스 제공과 관련해서 수집된 회원정보를 본인의 승낙 없이 제3자에게 누설, 배포하지 않습니다. 누설, 배포하지 않습니다.</p>
              <p> ① 회원의 개인정보는 공공기관의 개인정보보호법에 의해 보호되며 당 사이트의 개인정보처리방침이 적용됩니다. </p>
              <p>② 당 사이트의 회원 정보는 다음과 같이 수집, 사용, 관리, 보호됩니다.</p>
              <p>1. 개인정보의 수집 : 당 사이트는 회원 가입시 회원이 제공하는 정보를 수집합니다.</p>
              <p>2. 개인정보의 사용 : 당 사이트는 서비스 제공과 관련해서 수집된 회원정보를 본인의 승낙 없이 제3자에게 누설, 배포하지 않습니다. 누설, 배포하지 않습니다.</p>
            </div>
            <button onClick={closePrivacyModal} className="close-privacy-button">닫기</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PhoneModal;