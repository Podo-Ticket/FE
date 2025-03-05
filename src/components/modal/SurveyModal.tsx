import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import StarRatings from 'react-star-ratings';

import thanksIcon from '../../assets/images/check_icon.png';
import surveyImage1 from '../../assets/images/admin/landing_character_1.png'
import surveyImage2 from '../../assets/images/admin/landing_character_2.png'

import { submitEvaluation, submitRecommand } from '../../api/user/TicketApi'; // API 호출 함수 가져오기
import { fadeIn, fadeOut } from '../../styles/animation/DefaultAnimation.ts'
import SmallBtn from '../button/ModalSmallBtn.tsx';
import TopNav from '../nav/TopNav.tsx';
import LargeBtn from '../button/LargeBtn.tsx';

interface SurveyModalProps {
    showSurveyModal: boolean;
    onAcceptFunc: () => void; // 모달 닫기 함수
}


const SurveyModal: React.FC<SurveyModalProps> = ({ showSurveyModal, onAcceptFunc }) => {
    const [isClosing, setIsClosing] = useState(false);

    const center = {
        text: '포도티켓 서비스 평가',
    };

    const [activeTab, setActiveTab] = useState<string>('1');
    const [selectedRating1, setSelectedRating1] = useState<number | 0>(0); // 첫 번째 별점
    const [selectedRating2, setSelectedRating2] = useState<number | 0>(0); // 초기값 설정

    const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedRating2(Number(event.target.value));
    };

    const handleNext = () => {
        setActiveTab((prevTab) => {
            const nextTab = (parseInt(prevTab) + 1).toString(); // 현재 탭 + 1
            return nextTab;
        });
    };

    const handleClose = () => {
        setActiveTab((prevTab) => {
            const nextTab = (parseInt(prevTab) - 1).toString(); // 현재 탭 + 1
            return nextTab;
        });
    };

    const handleSubmit1 = async () => {
        try {
            if (selectedRating1 !== 0) {
                const result = await submitEvaluation(selectedRating1); // API 호출
                console.log('응답 성공:', result);
                handleNext(); // 다음 단계로 이동
            }
        } catch (error) {
            console.error('응답 실패:', error.message);
        }
    };

    const handleSubmit2 = async () => {
        try {
            if (selectedRating1 !== 0) {
                const result = await submitRecommand(selectedRating2); // API 호출
                console.log('응답 성공:', result);
                handleNext(); // 다음 단계로 이동
            }
        } catch (error) {
            console.error('응답 실패:', error.message);
        }
    };

    if (!showSurveyModal) return null;

    const renderContent = () => {
        switch (activeTab) {
            case '1': // 두 번째 설문: 첫 번째 별점 선택
                return (
                    <StarContent>

                        <StarContentHeader>
                            <ContentIndex className='Podo-Ticket-Headline-H4'>
                                <span className='Podo-Ticket-Headline-H2' style={{ color: 'var(--purple-4)' }}>1</span>
                                /2
                            </ContentIndex>
                            <ContentImage src={surveyImage1} />
                            <StarEvaluationTitle className="Podo-Ticket-Headline-H3">
                                <span style={{ color: 'var(--purple-4)' }}>포도티켓의 전반적인 만족도</span>는<br />어땠는지 알려주세요!
                            </StarEvaluationTitle>
                        </StarContentHeader>

                        <StarRatingContainer>
                            <StarRatings
                                rating={selectedRating1}                     // 현재 별점 값
                                starRatedColor="#B489FF"                     // --purple-7               
                                starHoverColor="#B489FF"                     // --purple-7 
                                changeRating={(newRating) => setSelectedRating1(newRating)}
                                numberOfStars={5}                   // 전체 별의 개수
                                name="rating1"                       // 별점 컴포넌트의 이름
                                starDimension="41px"                // 각 별의 크기
                                starSpacing="9px"                   // 별 사이의 간격
                            />
                            <RatingDescription>
                                {selectedRating1}/5 (
                                <span className='Podo-Ticket-Body-B7'>
                                    {selectedRating1 === 1
                                        ? "진짜 별로에요"
                                        : selectedRating1 === 2
                                            ? "좀 아쉬워요"
                                            : selectedRating1 === 3
                                                ? "흠"
                                                : selectedRating1 === 4
                                                    ? "쓸만해요"
                                                    : "최고에요"}
                                </span>
                                )</RatingDescription>
                        </StarRatingContainer>

                        <ButtonContainer>
                            <LargeBtn content="다음" onClick={handleSubmit1} isAvailable={selectedRating1 !== 0} />
                        </ButtonContainer>
                    </StarContent>
                );

            case '2': // 세 번째 설문: 두 번째 별점 선택
                return (
                    <SliderContent>
                        <StarContentHeader>
                            <ContentIndex className='Podo-Ticket-Headline-H4'>
                                <span className='Podo-Ticket-Headline-H2' style={{ color: 'var(--purple-4)' }}>2</span>
                                /2
                            </ContentIndex>
                            <ContentImage src={surveyImage2} />
                            <StarEvaluationTitle className="Podo-Ticket-Headline-H3">
                                친구나 동료에게 <span style={{ color: 'var(--purple-4)' }}>추천할 의향</span>이<br />얼마나 있는지 알려주세요!
                            </StarEvaluationTitle>
                        </StarContentHeader>

                        <SliderContainer>
                            <SliderInput
                                type="range"
                                min="0"
                                max="10"
                                value={selectedRating2}
                                onChange={handleSliderChange}
                            />
                            <SliderLabels>
                                {Array.from({ length: 11 }, (_, index) => (
                                    <Label key={index} isActive={index === selectedRating2}>
                                        {index}
                                    </Label>
                                ))}
                            </SliderLabels>
                        </SliderContainer>

                        <ButtonContainer>
                            <SmallBtn content="이전" onClick={handleClose} isAvailable={true} isDarkblue={true} />
                            <SmallBtn content="완료" onClick={handleSubmit2} isAvailable={selectedRating2 !== 0} />
                        </ButtonContainer>
                    </SliderContent>
                );

            case '3': // 마지막 단계: 감사 메시지 표시
                return (
                    <Content isClosing={isClosing} isThanksContent={true}>
                        <ThanksContentContainer>
                            <ThanksImage src={thanksIcon} alt="감사 아이콘" />
                            <ThankYouMessageContainer>
                                <ThankYouMessage className='Podo-Ticket-Headline-H3'>서비스 평가에 응해주셔서 감사합니다!</ThankYouMessage>
                                <ThankYouMessage className='Podo-Ticket-Headline-H3'>더 나은 서비스로 보답하겠습니다!</ThankYouMessage>
                            </ThankYouMessageContainer>
                        </ThanksContentContainer>

                        <ButtonContainer>
                            <LargeBtn content="처음으로" onClick={() => { onAcceptFunc(); setActiveTab('1'); setSelectedRating1(0); setSelectedRating2(0); }} isAvailable={true} />
                        </ButtonContainer>
                    </Content>
                );

            default:
                return null;
        }
    };

    return (
        <Overlay>
            <TopNav lefter={null} center={center} righter={null} />
            {renderContent()}
        </Overlay>
    );
};

export default SurveyModal;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--ect-white);

  display: flex;
  flex-direction: column;
  align-items: center;

  z-index: 10000;
`;

const Content = styled.div <{ isClosing: boolean, isThanksContent: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  height: 100%;
  background-color: var(--ect-white);

  text-align: center;

  animation: ${({ isClosing, isThanksContent }) => isThanksContent ? isClosing ? fadeOut : 'none' : isClosing ? fadeOut : fadeIn} 0.4s ease-in-out;
`;

const StarContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 22.0625rem;
  background-color: var(--ect-white);
  border-radius: 10px;

  gap: 25px;
  padding: 15px;
  padding-bottom: 25px;

  text-align: center;
`;

const ContentImage = styled.img`
width: 200px;
height: 200px;
`;

const ThanksContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
    
  flex-grow: 1;

  gap: 40px;
`;

const ThanksImage = styled.img`
width: 121px;
height: 121px;
`;

const ThankYouMessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

gap: 5px;
`;

const ThankYouMessage = styled.div`
color: var(--grey-7);
`;

const EvaluationTitle = styled.div`
color: var(--purple-4);
`;

const StarContentHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 20px;
`;

const StarEvaluationTitle = styled.div`
color: var(--grey-7);
white-space: pre-line;
`;

const ContentIndex = styled.div`
margin-bottom: 14px;
`;

const StarRatingContainer = styled.div`
display: flex;
flex-direction: column;

gap: 5px;
`;

const SliderContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 22.0625rem;
  background-color: var(--ect-white);
  border-radius: 10px;

  gap: 35px;
  padding: 15px;
  padding-bottom: 25px;

  text-align: center;
`;

const SliderContainer = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;

  gap: 8px;
  padding: 0 9px;
`;

interface SliderProps {
    value: number; // value는 숫자 타입
}

const SliderInput = styled.input.attrs<SliderProps>(props => ({
    type: 'range', // input의 기본 속성을 설정
}))`
  -webkit-appearance: none; /* 기본 브라우저 스타일 제거 */
  
  width: 100%;
  height: 19px;
  background: linear-gradient(
    to right,
    #f5f4ff 0%, /* 그라디언트 시작 색상 */
    #dfcdff ${props => props.value * 10}%, /* 채워진 부분 끝 */
    var(--grey-2) ${props => props.value * 10}% /* 비활성화된 부분 시작 */
  );
  border-radius: 13px;

  outline: none;
  transition: background 0.2s ease;

  &::-webkit-slider-thumb {
    -webkit-appearance: none; /* 기본 브라우저 스타일 제거 */
    appearance: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: #fff;
    cursor: pointer;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s ease-in-out;

    &:hover {
      transform: scale(1.1); /* 호버 시 크기 확대 */
    }
  }

  &::-moz-range-thumb {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: #fff;
    cursor: pointer;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s ease-in-out;

    &:hover {
      transform: scale(1.1); /* 호버 시 크기 확대 */
    }
  }
`;

const SliderLabels = styled.div`
  display: flex;
  justify-content: space-between;

  padding-left: 7px;
  padding-right: 1px;
`;


const Label = styled.span.attrs<{ isActive?: boolean }>(props => ({ className: props.isActive ? 'Podo-Ticket-Headline-H5' : 'Podo-Ticket-Headline-H6', }))
    <{ isActive?: boolean }>`
  color: ${props => (props.isActive ? 'var(--purple-4)' : 'var(--grey-5)')};
`;


const RatingDescription = styled.div.attrs({ className: 'Podo-Ticket-Headline-H6' })`
color: var(--grey-5);
`;

const ButtonContainer = styled.div`
  display: flex;

  gap: 20px;
  padding-bottom: 35px;
`;