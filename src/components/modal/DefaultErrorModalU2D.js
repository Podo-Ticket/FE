import React, { useState } from 'react'

import '../../styles/DefaultErrorModalU2D.css'
import errorIcon from '../../assets/images/error_icon.png'

const DefaultErrorModalU2D = ({ isOpen, onClose, errorMessage }) => {
    const [isInvalidPhoneModalClosing, setIsInvalidPhoneModalClosing] = useState(false);

    if (!isOpen) return null;

    const handleInvalidPhoneOverlayClick = () => {
        setIsInvalidPhoneModalClosing(true); // 애니메이션 시작
        setTimeout(() => {
            onClose(); // 모달 상태를 닫음
            setIsInvalidPhoneModalClosing(false); // 애니메이션 상태 초기화
        }, 300); // 애니메이션과 같은 시간으로 설정
    };

    return (
        <div className="modal-invalid-default-U2D-overlay" onClick={handleInvalidPhoneOverlayClick}>
            <div className={`modal-invalid-default-U2D-content ${isInvalidPhoneModalClosing ? 'U2D-close-animation' : ''}`}>
                <img className="invalid-error-icon" src={errorIcon} />
                <span className="invalid-error-message">{errorMessage}</span>
            </div>
        </div>
    );
};

export default DefaultErrorModalU2D;