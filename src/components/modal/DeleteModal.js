import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../../styles/DeleteModal.css';

function DeleteModal({ showDeleteModal, closeDeleteModal, onDelete }) {
  const navigate = useNavigate();

  const handleSubmit = () => {
    // POST Request //
    onDelete();
    navigate('/manage');
  };

  if (!showDeleteModal) return null;

  return (
    <div className="modal-overlay-delete">
      <div className="modal-content-delete">
        <h2>해당 명단을 삭제하시겠습니까?</h2>
        <span>삭제한 명단은 다시 복구 불가능합니다.</span>

        <div className="delete-modal-buttons">
          <button onClick={closeDeleteModal} className="delete-back-button">이전</button>
          <button onClick={handleSubmit} className="delete-ticket-button">삭제</button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;