import React from 'react';
import { useNavigate } from 'react-router-dom';

import '../../styles/user/WaitAdminModal.css'; // 스타일 파일 추가

const WaitAdminModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    
    if (!isOpen) return null;

    const handleWaitAdminOK = () => {
        onClose(); // 모달 닫기
        navigate('/'); // UserHome으로 이동
    };

    return (
        <div className="modal-overlay-wait-admin">
            <div className="modal-content-wait-admin">
                <p>현장 예매가 완료되었습니다!</p>
                <span>관리자 확정 후 티켓 발권이 가능합니다.</span>
                <button
                    className="wait-admin-button"
                    onClick={handleWaitAdminOK}
                >
                    확인
                </button>
            </div>
        </div>
    );
};

export default WaitAdminModal;