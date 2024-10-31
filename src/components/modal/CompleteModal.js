import React, { useState, useEffect } from 'react'

import '../../styles/CompleteModal.css'
import thanksIcon from '../../assets/thanks_icon.png';

const CompleteModal = ({ isOpen, onClose }) => {
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsClosing(false);
        }
    }, [isOpen]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose(); // Call the onClose prop after the fade-out
        }, 500); // Match this duration with the CSS transition duration
    };

    if(onClose && isOpen){setTimeout(() => {
        handleClose();
    }, 500);}

    if (!isOpen) return null;
    return (
        <div className={`modal-overlay-complete visible ${isClosing ? 'closing' : ''}`}>
            <div className="modal-content-complete">
                <img src={thanksIcon} className="thanks-icon-complete" alt="Thank You" />
            </div>
        </div>
    );
};

export default CompleteModal;