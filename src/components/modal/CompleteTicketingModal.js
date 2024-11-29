import React from 'react'

import '../../styles/user/CompleteTicketingModal.css'
import checkIcon from '../../assets/images/check_icon.png';

const CompleteTicketingModal = ({ isOpen, onClose }) => {

    if (!isOpen) return null;
    
    return (
        <div className="modal-overlay-complete-ticketing">
            <div className="modal-content-complete-ticketing">
                <img src={checkIcon} className="check-icon-complete-ticketing" alt="Thank You" />
                <p>발권 완료</p>
                <span>바로 입장해주시면 됩니다!</span>
                <button onClick={onClose}>다음</button>
            </div>
        </div>
    );
};

export default CompleteTicketingModal;