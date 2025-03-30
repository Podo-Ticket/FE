import React from 'react'
import styled from 'styled-components'

interface ModalLargeBtnProps {
    content: string;        // 버튼 안 내용
    onClick: () => void;        // 온 클릭 함수
    isAvailable: boolean;       // 버튼 동작 여부
}

const ModalLargeBtn: React.FC<ModalLargeBtnProps>  = ({ content, onClick, isAvailable }) => {
    return (

        <ModalLargeBtnContainer
            className='text-lg-300'
            onClick={onClick}
            disabled={!isAvailable}
            isAvailable={isAvailable}
        >{content}</ModalLargeBtnContainer>

    )
}

export default ModalLargeBtn

const ModalLargeBtnContainer = styled.button<{ isAvailable: boolean }>`
width: 17.4375rem;
height: 3.125rem;

padding: 15px 0px;
border-radius: 15px;
border: 1px solid ${({ isAvailable }) => (isAvailable ? 'var(--orange-70)' : 'var(--orange-90)')};
background: ${({ isAvailable }) => (isAvailable ? 'var(--orange-70)' : 'var(--orange-90)')};

gap: 6px;

color: var(--gray-0);
text-align: center;

transition: background 0.3s ease-in-out;

user-select: none; /* 텍스트 선택 방지 */
-webkit-user-select: none; /* Safari에서 드래그 방지 */
-moz-user-select: none; /* Firefox에서 드래그 방지 */
-ms-user-select: none;
`;