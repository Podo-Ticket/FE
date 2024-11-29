import React from 'react';

import '../../styles/admin/LockApproveModal.css'

const LockApproveModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay-lock-approve">
            <div className="modal-content-lock-approve">
                <h2>해당 좌석을 잠그시겠습니까?</h2>
                <span>좌석을 해제하면 발권이 가능합니다.</span>
                <div className="lock-approve-button-container">
                    <button className="lock-cancel-button" onClick={onClose}>취소</button>
                    <button className="lock-approve-button" onClick={onConfirm}>확인</button>
                </div>
            </div>
        </div>
    );
};

export default LockApproveModal;