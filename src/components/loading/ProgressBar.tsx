import React from 'react';
import styled from 'styled-components';

interface ProgressBarProps {
    progress: number;
}  

const ProgressBar: React.FC<ProgressBarProps>= ({ progress }) => {
    return (
        <ProgressContainer>
            <BarContainer>
                <BarFill progress={progress} />
                <Circle position={progress} />
                <ProgressText position={progress}>{progress}%으아아아아</ProgressText>
            </BarContainer>
            <ProgressSubText className='Podo-Ticket-Body-B11'>발권 진행률</ProgressSubText>
        </ProgressContainer>
    );
};

export default ProgressBar;

const ProgressContainer = styled.div`
    width: 100%;
    max-width: 600px; /* 최대 너비 설정 */
    margin: 20px auto; /* 중앙 정렬 */
    text-align: center;
`;

const BarContainer = styled.div`
    width: 100%;
    height: 19px; /* 게이지 바 높이 */
    background-color: var(--grey-grey-2); /* 배경 색상 */
    border-radius: 13px; /* 모서리 둥글게 */
    overflow: hidden; /* 바가 컨테이너를 넘지 않도록 */
    position: relative; /* 자식 요소의 절대 위치를 사용할 수 있도록 설정 */
`;

const ProgressText = styled.div`
    position: absolute; /* 절대 위치로 설정 */
    left: ${props => `calc(${props.position}% - 10px)`}; /* 원의 중앙에 맞춰 위치 조정 */
    top: 50%; /* 세로 중앙 정렬 */
    transform: translateY(35%); /* 원 아래로 이동 */
    font-size: 50px;
    font-weight: bold;
    color: #6A39C0; /* 텍스트 색상 */
`;

const BarFill = styled.div`
    width: ${props => props.progress}%; /* 진행률에 따라 너비 조정 */
    height: 100%;
    background: linear-gradient(90deg, #B3A4E0, #6A39C0); /* 그라데이션 색상 */
    border-radius: 10px; /* 모서리 둥글게 */
    transition: width 0.3s ease; /* 애니메이션 효과 */
`;

const Circle = styled.div`
    position: absolute;
    left: ${props => `calc(${props.position}% - 10px)`};
    top: 50%; /* 세로 중앙 정렬 */
    transform: translateY(-50%); /* 세로 중앙 정렬 */
    width: 23px; /* 원의 크기 */
    height: 23px; /* 원의 크기 */
    background-color: white; /* 원의 색상 */
    border: none;
    border-radius: 50%; /* 원형으로 만들기 */

fill: var(--ect-white);
filter: drop-shadow(0px 1px 6px rgba(0, 0, 0, 0.15));
`;

const ProgressSubText = styled.div`
display: flex;
justify-content: left;

margin-top: 8px;
padding-left: 3px;

color: var(--grey-grey-6);
`;