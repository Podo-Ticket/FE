import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import StarRatings from 'react-star-ratings';

import thanksIcon from '../../assets/images/check_icon.png';
import smileIcon from '../../assets/images/eval_smile.png';
import mehIcon from '../../assets/images/eval_meh.png';
import frownIcon from '../../assets/images/eval_frown.png';

import { submitEvaluation } from '../../api/user/TicketApi'; // API 호출 함수 가져오기
import { fadeIn, fadeOut } from '../../styles/animation/DefaultAnimation.ts'
import SmallBtn from '../button/SmallBtn.tsx';

interface SurveyModalProps {
    showSurveyModal: boolean;
    onAcceptFunc: () => void; // 모달 닫기 함수
}

type IconType = 'frown' | 'meh' | 'smile' | null;

const SurveyModal: React.FC<SurveyModalProps> = ({ showSurveyModal, onAcceptFunc }) => {
    const [selectedIcon, setSelectedIcon] = useState<IconType>(null);
    const [isClosing, setIsClosing] = useState(false);

    const getRatingValue = (icon: IconType): string => {
        switch (icon) {
            case 'frown':
                return '1'; // 더 귀찮아졌음
            case 'meh':
                return '2'; // 비슷해요
            case 'smile':
                return '3'; // 더 편해졌어요
            default:
                return '0'; // 안 함
        }
    };

    const [activeTab, setActiveTab] = useState<string>('1');
    const [selectedRating1, setSelectedRating1] = useState<number | 0>(0); // 첫 번째 별점

    const [selectedRating2, setSelectedRating2] = useState<number | 0>(0); // 초기값 설정

    const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedRating2(Number(event.target.value));
    };

    const handleIconClick = async (icon: IconType) => {
        setSelectedIcon(icon); // 선택된 아이콘 상태 업데이트

        const ratingValue = parseInt(getRatingValue(icon)); // 아이콘에 따른 평가 값 가져오기

        try {
            const success = await submitEvaluation(ratingValue); // API 호출

            if (success) {
                // 성공적으로 평가가 제출된 경우 다음 단계로 이동
                setTimeout(() => setActiveTab('2'), 500); // 0.5초 후 다음 단계로 이동
            } else {
                console.error('Evaluation submission failed');
            }
        } catch (error) {
            console.error('Error during evaluation submission:', error);
        }
    };

    const handleNext = () => {
        setActiveTab((prevTab) => {
            const nextTab = (parseInt(prevTab) + 1).toString(); // 현재 탭 + 1
            return nextTab;
        });
    };

    const handleClose = () => { onAcceptFunc(); };

    // 서베이 모달 자동 닫기 처리
    useEffect(() => {
        if (activeTab === '4') {
            const delayTimer = setTimeout(() => {
                setIsClosing(true);
                const fadeOutTimer = setTimeout(() => {
                    onAcceptFunc();
                    setActiveTab('0');
                }, 400);
                return () => clearTimeout(fadeOutTimer);
            }, 600);
            return () => clearTimeout(delayTimer);
        }
    }, [activeTab, onAcceptFunc]);

    if (!showSurveyModal) return null;

    const renderContent = () => {
        switch (activeTab) {
            case '1': // 첫 번째 설문: 아이콘 선택
                return (
                    <Content isClosing={isClosing} isThanksContent={false}>
                        <EvaluationTitle className="Podo-Ticket-Headline-H3">
                            저희 서비스를 평가해주세요!
                        </EvaluationTitle>
                        <EvaluationContent>
                            <EvaluationChoice onClick={() => handleIconClick('frown')}>
                                <EvaluationImageContainer>
                                    {selectedIcon === 'frown' ? <OverlayCircle /> : <Circle />}
                                    <ChoiceImage src={frownIcon} alt="더 귀찮았어요" />
                                </EvaluationImageContainer>
                                <ChoiceText isSelected={selectedIcon === 'frown'} >더 귀찮았어요</ChoiceText>
                            </EvaluationChoice>

                            <EvaluationChoice onClick={() => handleIconClick('meh')}>
                                <EvaluationImageContainer>
                                    {selectedIcon === 'meh' ? <OverlayCircle /> : <Circle />}
                                    <ChoiceImage src={mehIcon} alt="비슷해요" />
                                </EvaluationImageContainer>
                                <ChoiceText isSelected={selectedIcon === 'meh'}>비슷해요</ChoiceText>
                            </EvaluationChoice>

                            <EvaluationChoice onClick={() => handleIconClick('smile')}>
                                <EvaluationImageContainer>
                                    {selectedIcon === 'smile' ? <OverlayCircle /> : <Circle />}
                                    <ChoiceImage src={smileIcon} alt="더 편해졌어요" />
                                </EvaluationImageContainer>
                                <ChoiceText isSelected={selectedIcon === 'smile'}>더 편해졌어요!</ChoiceText>
                            </EvaluationChoice>
                        </EvaluationContent>
                    </Content>
                );

            case '2': // 두 번째 설문: 첫 번째 별점 선택
                return (
                    <StarContent>
                        <StarContentHeader>
                            <ContentIndex className='Podo-Ticket-Headline-H4'>
                                <span className='Podo-Ticket-Headline-H2' style={{ color: 'var(--purple-4)' }}>1</span>
                                /2
                            </ContentIndex>
                            <StarEvaluationTitle className="Podo-Ticket-Headline-H3">
                                <span style={{ color: 'var(--purple-4)' }}>포도티켓의 전반적인 만족도</span>는<br />어땠는지 알려주세요!
                            </StarEvaluationTitle>
                            <StarEvaluationTitle className="Podo-Ticket-Headline-H3">

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
                            <RatingDescription>{selectedRating1}/5</RatingDescription>
                        </StarRatingContainer>

                        <ButtonContainer>
                            <SmallBtn content="닫기" onClick={handleClose} isAvailable={true} isGray={true} />
                            <SmallBtn content="다음" onClick={handleNext} isAvailable={true} />
                        </ButtonContainer>
                    </StarContent>
                );

            case '3': // 세 번째 설문: 두 번째 별점 선택
                return (
                    <SliderContent>
                        <StarContentHeader>
                            <ContentIndex className='Podo-Ticket-Headline-H4'>
                                <span className='Podo-Ticket-Headline-H2' style={{ color: 'var(--purple-4)' }}>1</span>
                                /2
                            </ContentIndex>
                            <StarEvaluationTitle className="Podo-Ticket-Headline-H3">
                                친구나 동료에게 <span style={{ color: 'var(--purple-4)' }}>추천할 의향</span>이<br />얼마나 있는지 알려주세요!
                            </StarEvaluationTitle>
                            <StarEvaluationTitle className="Podo-Ticket-Headline-H3">

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
                            <SmallBtn content="닫기" onClick={handleClose} isAvailable={true} isGray={true} />
                            <SmallBtn content="완료" onClick={handleNext} isAvailable={true} />
                        </ButtonContainer>
                    </SliderContent>
                );

            case '4': // 마지막 단계: 감사 메시지 표시
                return (
                    <Content isClosing={isClosing} isThanksContent={true}>
                        <ThanksImage src={thanksIcon} alt="감사 아이콘" />
                        <ThankYouMessage className='Podo-Ticket-Headline-H3'>평가에 응해주셔서 감사합니다</ThankYouMessage>
                    </Content>
                );

            default:
                return null;
        }
    };

    return (
        <Overlay>{renderContent()}</Overlay>
    );
};

export default SurveyModal;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);

  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 10000;
`;

const Content = styled.div <{ isClosing: boolean, isThanksContent: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 22.0625rem;
  background-color: var(--ect-white);
  border-radius: 10px;

  gap: 40px;
  padding: ${({ isThanksContent }) => (isThanksContent ? '50px' : '35px')};

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

const ThanksImage = styled.img`
width: 64px;
height: 64px;
`;

const ThankYouMessage = styled.div`
color: var(--grey-7);
`;

const EvaluationTitle = styled.div`
color: var(--purple-4);
`;

const StarContentHeader = styled.div`

`;

const StarEvaluationTitle = styled.div`
color: var(--grey-7);
white-space: pre-line;
`;

const ContentIndex = styled.div`
margin-bottom: 14px;
`;

const EvaluationContent = styled.div`
display: flex;

gap: 41px;
padding-bottom: 10px;
`;

const EvaluationChoice = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const EvaluationImageContainer = styled.div`
position: relative;
`;

const ChoiceImage = styled.img`
width: 45px;
height: 45px;

margin-bottom: 10px;
`;

const ChoiceText = styled.div.attrs({ className: 'Podo-Ticket-Body-B9' }) <{ isSelected: boolean }>`
color: ${({ isSelected }) => (isSelected ? 'var(--purple-4)' : 'var(--grey-7)')};
`;

const Circle = styled.div`
  position: absolute;
  top: -6.5px;
  left: -6.5px;

  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: var(--grey-2);
  opacity: 0.4;
  
  z-index: 2;
`;

const OverlayCircle = styled.div`
  position: absolute;
  top: -6.5px;
  left: -6.5px;

  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: var(--purple-8);
  opacity: 0.4;

  z-index: 2;
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

gap: 11px;
`;