import React, { useState } from 'react';

import '../../styles/UnlockApproveModal.css'

const UnlockApproveModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay-unlock-approve">
            <div className="modal-content-unlock-approve">
                <h2>해당 좌석을 잠금 해제하시겠습니까?</h2>
                <span>좌석을 해제하면 발권이 가능합니다.</span>
                <div className="unlock-approve-button-container">
                    <button className="unlock-cancel-button" onClick={onClose}>취소</button>
                    <button className="unlock-approve-button" onClick={onConfirm}>확인</button>
                </div>
            </div>
        </div>
    );
};

export default UnlockApproveModal;