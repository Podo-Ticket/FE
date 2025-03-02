import React from 'react'
import styled from 'styled-components'

interface SmallBtnProps {
    content: string;        // 버튼 안 내용
    onClick: () => void;        // 온 클릭 함수
    isAvailable: boolean;       // 버튼 동작 여부
    isGray?: boolean;        // 남색 버튼 여부
}

const SmallBtn: React.FC<SmallBtnProps>  = ({ content, onClick, isAvailable, isGray = false }) => {
    return (
        <SmallBtnContainer
            className='Podo-Ticket-Body-B4'
            onClick={onClick}
            disabled={!isAvailable}
            isAvailable={isAvailable}
            isGray={isGray}
        >{content}</SmallBtnContainer>
    )
}

export default SmallBtn

const SmallBtnContainer = styled.button<{ isAvailable: boolean, isGray: boolean }>`
display: flex;
justify-content: center;
align-items: center;

width: 10.6875rem; 
height: 3.4375rem;

padding: 11px 0;
border-radius: 10px;
background: ${({ isAvailable, isGray }) => isGray ? 'var(--grey-3)' : (isAvailable ? 'var(--purple-4)' : 'var(--purple-9)')};
border: none;

gap: 10px;

color: ${({ isAvailable, isGray }) => isGray ? 'var(--grey-6)' : (isAvailable ? 'var(--ect-white)' : 'var(--ect-white)')};
text-align: center;

transition: background 0.3s ease-in-out, color 0.3s ease-in-out;

user-select: none; /* 텍스트 선택 방지 */
-webkit-user-select: none; /* Safari에서 드래그 방지 */
-moz-user-select: none; /* Firefox에서 드래그 방지 */
-ms-user-select: none;
`;