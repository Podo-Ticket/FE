import React, { useState } from 'react'

import '../../styles/DefaultErrorModalD2U.css'
import errorIcon from '../../assets/images/error_icon.png'

const DefaultErrorModalD2U = ({ isOpen, onClose, errorMessage }) => {
    const [isInvalidErrorModalClosing, setIsInvalidErrorModalClosing] = useState(false);

    if (!isOpen) return null;

    const handleInvalidMessageOverlayClick = () => {
        setIsInvalidErrorModalClosing(true); // 애니메이션 시작
        setTimeout(() => {
            onClose(); // 모달 상태를 닫음
            setIsInvalidErrorModalClosing(false); // 애니메이션 상태 초기화
        }, 300); // 애니메이션과 같은 시간으로 설정
    };

    return (
        <div className="modal-invalid-default-D2U-overlay" onClick={handleInvalidMessageOverlayClick}>
            <div className={`modal-invalid-default-D2U-content ${isInvalidErrorModalClosing ? 'D2U-close-animation' : ''}`}>
                <img className="invalid-error-icon" src={errorIcon} />
                <span className="invalid-error-message">{errorMessage}</span>
            </div>
        </div>
    );
};

export default DefaultErrorModalD2U;