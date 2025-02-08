import React, { useState } from 'react';
import styled from 'styled-components';

import checkIcon from '../../assets/images/check_reserve_icon.png';
import reserveIcon from '../../assets/images/reserve_icon.png';

import { fadeIn, fadeOut } from '../../styles/animation/DefaultAnimation.ts'

interface ChoiceModalProps {
    showChoiceModal: boolean;
    closeChoiceModal: () => void;
    onFirstItemClick: () => void;
    onSecondItemClick: () => void;
}
const ChoiceModal: React.FC<ChoiceModalProps> = ({ showChoiceModal, closeChoiceModal, onFirstItemClick, onSecondItemClick }) => {
    const [isClosing, setIsClosing] = useState(false);

    if (!showChoiceModal) return null;

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // 이벤트가 ModalContent 내부에서 발생했는지 확인
        if ((e.target as HTMLElement).closest('.modal-content')) {
            return; // ModalContent 내부 클릭 시 아무 작업도 하지 않음
        }
        setIsClosing(true); // 페이드아웃 애니메이션 시작
        setTimeout(() => {
            setIsClosing(false); // 상태 초기화
            closeChoiceModal(); // 모달 닫기 함수 호출
        }, 300); // 애니메이션 시간과 동일하게 설정
    };

    const handleFirstItemClick = () => {
        setIsClosing(true); // 페이드아웃 애니메이션 시작
        setTimeout(() => {
            setIsClosing(false); // 상태 초기화
            onFirstItemClick(); // 애니메이션 종료 후 닫기 함수 호출
            closeChoiceModal();
        }, 300); // 애니메이션 시간과 동일하게 설정
    };

    const handleSecondItemClick = () => {
        setIsClosing(true); // 페이드아웃 애니메이션 시작
        setTimeout(() => {
            setIsClosing(false); // 상태 초기화
            onSecondItemClick(); // 애니메이션 종료 후 닫기 함수 호출
        }, 300); // 애니메이션 시간과 동일하게 설정
    };

    return (
        <ModalOverlay onClick={handleOverlayClick}>
            <ModalContent isClosing={isClosing} className="modal-content">
                <ButtonContainer>
                    <GetTicketButton
                        onClick={() => {
                            onFirstItemClick(); closeChoiceModal();
                        }}
                    >
                        <GetTicketIcon src={checkIcon} alt="Check Reservation Icon" />
                        <p className='Podo-Ticket-Headline-H2'>티켓 발권</p>
                        <span className='Podo-Ticket-Body-B5'>사전에 예매한 티켓을 발권받을 수 있어요!</span>
                    </GetTicketButton>
                    <ReserveTicketButton
                        onClick={() => {
                            handleSecondItemClick();
                        }}
                    >
                        <ReserveTicketIcon src={reserveIcon} alt="Reserve Icon" />
                        <p className='Podo-Ticket-Headline-H2'>현장 예매</p>
                        <span className='Podo-Ticket-Body-B5'>티켓을 새로 예매할 수 있어요!</span>
                    </ReserveTicketButton>
                </ButtonContainer>
            </ModalContent>
        </ModalOverlay>
    );
};

export default ChoiceModal;

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    
    display: flex;
    justify-content: center;
    align-items: center;
    
    background: rgba(0, 0, 0, 0.6);

    z-index: 100;
`;

const ModalContent = styled.div<{ isClosing: boolean }>`
    width: 90%;
    background: var(--ect-white);
    border-radius: 10px;

    padding: 12px;
    
    text-align: center;

    animation: ${({ isClosing }) => (isClosing ? fadeOut : fadeIn)} 0.4s ease-in-out;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;

    gap: 12px;
`;

const GetTicketButton = styled.button`
    border-radius: 10px;
    border: 1px solid var(--purple-8);
    background: var(--lightpurple-2);

    padding: 16px;
    padding-top: 19px;

    p {
        margin: 0px;
        color: #282828;
    }

    span {
        display: block;
        color: var(--grey-6);
    }
`;

const ReserveTicketButton = styled.button`
    border-radius: 10px;
    border: 1px solid var(--purple-8);
    background: var(--lightpurple-2);

    padding: 16px;
    padding-top: 22px;

    p {
        margin: 0px;
        color: #282828;
    }

    span {
        display: block;
        color: var(--grey-6);
    }
`;

const GetTicketIcon = styled.img`
    width: 45px;
    height: 42px;
    margin-bottom: 9px;
`;

const ReserveTicketIcon = styled.img`
    width: 35px;
    height: 39px;
    margin-bottom: 9px;
`;