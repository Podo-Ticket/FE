import React, { useState } from 'react';
import { Frown, Meh, Smile } from 'lucide-react';

import '../../styles/EvaluationModal.css';
import thanksIcon from '../../assets/thanks_icon.png';

function EvaluationModal({ closeModal }) {
    const [selectedIcon, setSelectedIcon] = useState(null);
    const [showThankYou, setShowThankYou] = useState(false);
    const [isClosing, setIsClosing] = useState(false); 

    const handleIconClick = (icon) => {
        setSelectedIcon(icon);
        setTimeout(() => {
            setShowThankYou(true);
            setTimeout(() => {
                setIsClosing(true);
                setTimeout(() =>{
                    closeModal();
                },500)
            }, 500);
        }, 1000);
    };

    return (
        <div className={`modal-overlay-evaluation ${isClosing ? 'closing' : ''}`} >
            {showThankYou ? (
                <div className="modal-content-evaluation">
                    <img src={thanksIcon} className="thanks-icon"></img>;
                    <div className="thank-you-message">평가에 응해주셔서 감사합니다</div>
                </div>
            ) : (
                <div className="modal-content-evaluation">
                    <div className="evaluation-title">저희 서비스를 평가해주세요!</div>
                    <div className="evaluation-content">
                        <div className="evaluation-choice" onClick={() => handleIconClick('frown')}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="58" height="58" viewBox="0 0 58 58" fill="none">
                                <circle cx="29" cy="29" r="29" fill="#F2F2F2" />
                            </svg>
                            <Frown className="evaluation-choice-icon" />
                            <div className="evaluation-choice-text">더 귀찮았아요</div>
                            {selectedIcon === 'frown' && <div className="overlay-circle" />}
                        </div>

                        <div className="evaluation-choice" onClick={() => handleIconClick('meh')}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="58" height="58" viewBox="0 0 58 58" fill="none">
                                <circle cx="29" cy="29" r="29" fill="#F2F2F2" />
                            </svg>
                            <Meh className="evaluation-choice-icon" />
                            <div className="evaluation-choice-text">비슷해요</div>
                            {selectedIcon === 'meh' && <div className="overlay-circle" />}
                        </div>

                        <div className="evaluation-choice" onClick={() => handleIconClick('smile')}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="58" height="58" viewBox="0 0 58 58" fill="none">
                                <circle cx="29" cy="29" r="29" fill="#F2F2F2" />
                            </svg>
                            <Smile className="evaluation-choice-icon" />
                            <div className="evaluation-choice-text">더 편해졌어요!</div>
                            {selectedIcon === 'smile' && <div className="overlay-circle" />}
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}

export default EvaluationModal;