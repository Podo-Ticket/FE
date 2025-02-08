import React from 'react'
import styled from 'styled-components'

interface SmallBtnProps {
    content: string;        // 버튼 안 내용
    onClick: () => void;        // 온 클릭 함수
    isAvailable: boolean;       // 버튼 동작 여부
    isDarkblue: boolean;        // 남색 버튼 여부
}

const ModalSmallBtn: React.FC<SmallBtnProps> = ({ content, onClick, isAvailable, isDarkblue }) => {
    return (
        <ModalSmallBtnContainer
            className='text-lg-300'
            onClick={onClick}
            disabled={!isAvailable}
            isAvailable={isAvailable}
            isDarkblue={isDarkblue}
        >{content}</ModalSmallBtnContainer>
    )
}

export default ModalSmallBtn

const ModalSmallBtnContainer = styled.button<{ isAvailable: boolean, isDarkblue: boolean }>`
display: flex;
justify-content: center;
align-items: center;

width: 8.4375rem;
height: 3.125rem;

padding: 11px 48px;
border-radius: 15px;
background: ${({ isAvailable, isDarkblue }) => isDarkblue ? 'var(--gray-20)' : (isAvailable ? 'var(--orange-70)' : 'var(--orange-90)')};
border: none;

gap: 10px;

color: ${({ isAvailable, isDarkblue }) => isDarkblue ? 'var(--gray-80)' : (isAvailable ? 'var(--gray-100)' : 'var(--gray-40)')};
text-align: center;

user-select: none; /* 텍스트 선택 방지 */
-webkit-user-select: none; /* Safari에서 드래그 방지 */
-moz-user-select: none; /* Firefox에서 드래그 방지 */
-ms-user-select: none;
`;