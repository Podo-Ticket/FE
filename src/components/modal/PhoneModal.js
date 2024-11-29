import React, { useState } from 'react';

import '../../styles/user/PhoneModal.css';

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

  const handleSubmit = () => {
    // If the button is enabled, call the startLoading function
    if (isButtonEnabled) {
      startLoading(phone); // 핸드폰 번호를 제출하는 함수 호출
    }
  };

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
            onClick={handleSubmit} // Only start loading if conditions are met
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
              <p>개인정보보호법에 따라 {'<'}포도티켓{'>'}에 회원가입 하시는 분께 수집하는 개인정보의 항목, 개인정보의 수집 및 이용목적, 개인정보의 보유 및 이용기간, 동의 거부권 및 동의 거부 시 불이익에 관한 사항을 안내해 드리오니 자세히 읽은 후 동의하여 주시기를 바랍니다.</p>
              <p>■ 수집하는 개인정보 항목</p>
              <p>{'<'}포도티켓{'>'}은 회원 서비스 운영, 판매 상품 A/S, 주문 및 결제, 서비스 홍보 및 판매 권유를 위해 아래와 같은 개인정보를 수집하고 있습니다.</p>
              <p>수집항목: 이름, 전화번호</p>
              <p>개인정보 수집 방법: 홈페이지(회원가입), 공연 예매</p>
              <p>■ 개인정보의 수집 및 이용 목적</p>
              <p>{'<'}포도티켓{'>'}은 수집한 개인정보를 다음의 목적을 위해 활용합니다.</p>
              <p>재화 또는 서비스 제공</p>
              <p>서비스 제공, 계약서 ∙ 청구서 발송, 콘텐츠 제공, 맞춤 서비스 제공, 본인인증, 연령 인증, 요금 결제 ∙ 정산</p>
              <p>회원 가입 및 관리</p>
              <p>회원 가입 의사 확인, 회원제 서비스 제공에 따른 본인 식별 ∙ 인증, 회원 자격 유지 ∙ 관리, 서비스 부정 이용 방지, 만 14세 미만 아동의 개인정보 처리 시 법정대리인의 동의 여부 확인, 각종 고지 ∙ 통지, 고충 처리</p>
              <p>■ 개인정보의 보유 및 이용기간</p>
              <p>{'<'}포도티켓{'>'}은 개인정보 수집 및 이용 목적이 달성된 후에는 예외 없이 해당 정보를 지체 없이 파기합니다.</p>
              <p>자세한 내용은 개인정보 처리 방침을 확인해 주세요.</p>
              <p>귀하는 위와 같이 개인정보를 수집 ∙ 이용하는데 동의를 거부할 권리가 있습니다. 필수 수집 항목에 대해 동의를 거절하는 경우 서비스 이용이 제한될 수 있습니다.</p>
              <br></br>
              <p>■ 개인정보 제3자에게 제공 동의</p>
              <p>{'<'}포도티켓{'>'}은 수집·보유하고 있는 개인정보를 이용자의 동의 없이 제3자에게 제공하지 않으나, 다음의 경우에는 개인정보를 제3자에게 제공할 수 있습니다.</p>
              <p>{'<'}포도티켓{'>'} 회원 가입을 위하여 아래의 개인정보 수집 이용(및 제공)에 대한 내용을 자세히 읽어 보신 후 동의 여부를 결정하여 주시기 바랍니다.</p>
              <br></br>
              <p>공연 예매, 좌석 배정 및 입장을 위하여 공연 주체에게 전달하는 경우</p>
              <p>법률에 특별한 규정이 있거나 법령상 의무를 준수하기 위하여 불가피한 경우</p>
              <p>제공받는 자: 해당 공연 주체</p>
              <p>제공목적: 좌석 배정, 공연 입장</p>
              <p>제공하는 항목: 이름, 전화번호</p>
              <p>보유 및 이용기간: 해당 계약 종료 시점 이전까지</p>
              <br></br>
              <p>귀하는 위와 같이 개인정보를 수집 ∙ 이용하는데 동의를 거부할 권리가 있습니다. 필수 수집 항목에 대해 동의를 거절하는 경우 서비스 이용이 제한될 수 있습니다.</p>
            </div>
            <button onClick={closePrivacyModal} className="close-privacy-button">닫기</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PhoneModal;