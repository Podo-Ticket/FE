import React, { useState } from "react";
import styled from "styled-components";
import StarRatings from "react-star-ratings";

import SmallBtn from "@components/common/buttons/ModalSmallBtn.tsx";
import TopNav from "@components/layout/headers/TopNav.tsx";
import LargeBtn from "@components/common/buttons/LargeBtn.tsx";

import thanksIcon from "@assets/images/check_icon.png";
import surveyImage1 from "@assets/images/admin/landing_character_1.png";
import surveyImage2 from "@assets/images/admin/landing_character_2.png";

import {
  submitEvaluation,
  submitRecommand,
} from "../../../../api/user/TicketApi";
import {
  fadeIn,
  fadeOut,
} from "../../../../styles/animation/DefaultAnimation.ts";
import { SURVEY_PODO_TICKET } from "@/constants/text/UIText.ts";

interface SurveyModalProps {
  showSurveyModal: boolean;
  onAcceptFunc: () => void;
}

const SurveyModal: React.FC<SurveyModalProps> = ({
  showSurveyModal,
  onAcceptFunc,
}) => {
  const [isClosing] = useState(false);
  const language = localStorage.getItem("language");

  const center = {
    text:
      language === "english"
        ? SURVEY_PODO_TICKET.english.SurveyPageTitle
        : SURVEY_PODO_TICKET.korean.SurveyPageTitle,
  };

  const [activeTab, setActiveTab] = useState<string>("1");
  const [selectedRating1, setSelectedRating1] = useState<number | 0>(0);
  const [selectedRating2, setSelectedRating2] = useState<number | 0>(0);

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedRating2(Number(event.target.value));
  };

  const handleNext = () => {
    setActiveTab((prevTab) => {
      const nextTab = (parseInt(prevTab) + 1).toString();
      return nextTab;
    });
  };

  const handleClose = () => {
    setActiveTab((prevTab) => {
      const nextTab = (parseInt(prevTab) - 1).toString();
      return nextTab;
    });
  };

  const handleSubmit1 = async () => {
    try {
      if (selectedRating1 !== 0) {
        await submitEvaluation(selectedRating1);
        handleNext();
      }
    } catch (error: any) {}
  };

  const handleSubmit2 = async () => {
    try {
      if (selectedRating1 !== 0) {
        await submitRecommand(selectedRating2);
        handleNext();
      }
    } catch (error: any) {}
  };

  if (!showSurveyModal) return null;

  const renderContent = () => {
    switch (activeTab) {
      case "1":
        return (
          <StarContent>
            <StarContentHeader>
              <ContentIndex className="Podo-Ticket-Headline-H4">
                <span
                  className="Podo-Ticket-Headline-H2"
                  style={{ color: "var(--purple-4)" }}
                >
                  1
                </span>
                /2
              </ContentIndex>
              <ContentImage src={surveyImage1} />
              <StarEvaluationTitle className="Podo-Ticket-Headline-H3">
                <span style={{ color: "var(--purple-4)" }}>
                  {language === "english"
                    ? SURVEY_PODO_TICKET.english.SatisfactionPageDescription1
                    : SURVEY_PODO_TICKET.korean.SatisfactionPageDescription1}
                </span>
                <br />
                {language === "english"
                  ? SURVEY_PODO_TICKET.english.SatisfactionPageDescription2
                  : SURVEY_PODO_TICKET.korean.SatisfactionPageDescription2}
              </StarEvaluationTitle>
            </StarContentHeader>

            <StarRatingContainer>
              <StarRatings
                rating={selectedRating1}
                starRatedColor="#B489FF" // --purple-7
                starHoverColor="#B489FF" // --purple-7
                changeRating={(newRating) => setSelectedRating1(newRating)}
                numberOfStars={5}
                name="rating1"
                starDimension="41px"
                starSpacing="9px"
              />
              <RatingDescription>
                {selectedRating1}/5 (
                <span className="Podo-Ticket-Body-B7">
                  {selectedRating1 === 1
                    ? language === "english"
                      ? SURVEY_PODO_TICKET.english.SatisfactionLevel1
                      : SURVEY_PODO_TICKET.korean.SatisfactionLevel1
                    : selectedRating1 === 2
                    ? language === "english"
                      ? SURVEY_PODO_TICKET.english.SatisfactionLevel2
                      : SURVEY_PODO_TICKET.korean.SatisfactionLevel2
                    : selectedRating1 === 3
                    ? language === "english"
                      ? SURVEY_PODO_TICKET.english.SatisfactionLevel3
                      : SURVEY_PODO_TICKET.korean.SatisfactionLevel3
                    : selectedRating1 === 4
                    ? language === "english"
                      ? SURVEY_PODO_TICKET.english.SatisfactionLevel4
                      : SURVEY_PODO_TICKET.korean.SatisfactionLevel4
                    : selectedRating1 === 5
                    ? language === "english"
                      ? SURVEY_PODO_TICKET.english.SatisfactionLevel5
                      : SURVEY_PODO_TICKET.korean.SatisfactionLevel5
                    : "🙂"}
                </span>
                )
              </RatingDescription>
            </StarRatingContainer>

            <ButtonContainer>
              <LargeBtn
                content={
                  language === "english"
                    ? SURVEY_PODO_TICKET.english.SatisfactionPageButton
                    : SURVEY_PODO_TICKET.korean.SatisfactionPageButton
                }
                onClick={handleSubmit1}
                isAvailable={selectedRating1 !== 0}
              />
            </ButtonContainer>
          </StarContent>
        );

      case "2":
        return (
          <SliderContent>
            <StarContentHeader>
              <ContentIndex className="Podo-Ticket-Headline-H4">
                <span
                  className="Podo-Ticket-Headline-H2"
                  style={{ color: "var(--purple-4)" }}
                >
                  2
                </span>
                /2
              </ContentIndex>
              <ContentImage src={surveyImage2} />
              <StarEvaluationTitle className="Podo-Ticket-Headline-H3">
                <span style={{ color: "var(--purple-4)" }}>
                  {language === "english"
                    ? SURVEY_PODO_TICKET.english.NPSPageDescription1
                    : SURVEY_PODO_TICKET.korean.NPSPageDescription1}
                </span>
                <br />
                {language === "english"
                  ? SURVEY_PODO_TICKET.english.NPSPageDescription2
                  : SURVEY_PODO_TICKET.korean.NPSPageDescription2}
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
              <SmallBtn
                content={
                  language === "english"
                    ? SURVEY_PODO_TICKET.english.NPSPagePreviousButton
                    : SURVEY_PODO_TICKET.korean.NPSPagePreviousButton
                }
                onClick={handleClose}
                isAvailable={true}
                isDarkblue={true}
              />
              <SmallBtn
                content={
                  language === "english"
                    ? SURVEY_PODO_TICKET.english.NPSPageButton
                    : SURVEY_PODO_TICKET.korean.NPSPageButton
                }
                onClick={handleSubmit2}
                isAvailable={selectedRating2 !== 0}
              />
            </ButtonContainer>
          </SliderContent>
        );

      case "3":
        return (
          <Content isClosing={isClosing} isThanksContent={true}>
            <ThanksContentContainer>
              <ThanksImage src={thanksIcon} alt="감사 아이콘" />
              <ThankYouMessageContainer>
                <ThankYouMessage className="Podo-Ticket-Headline-H3">
                  {language === "english"
                    ? SURVEY_PODO_TICKET.english.ThanksPageDescription1
                    : SURVEY_PODO_TICKET.korean.ThanksPageDescription1}
                </ThankYouMessage>
                <ThankYouMessage className="Podo-Ticket-Headline-H3">
                  {language === "english"
                    ? SURVEY_PODO_TICKET.english.ThanksPageDescription2
                    : SURVEY_PODO_TICKET.korean.ThanksPageDescription2}
                </ThankYouMessage>
              </ThankYouMessageContainer>
            </ThanksContentContainer>

            <ButtonContainer>ƒ
              <LargeBtn
                content={
                  language === "english"
                    ? SURVEY_PODO_TICKET.english.ThanksPageButton
                    : SURVEY_PODO_TICKET.korean.ThanksPageButton
                }
                onClick={() => {
                  onAcceptFunc();
                  setActiveTab("1");
                  setSelectedRating1(0);
                  setSelectedRating2(0);
                }}
                isAvailable={true}
              />
            </ButtonContainer>
          </Content>
        );

      default:
        return null;
    }
  };

  return (
    <Overlay>
      <TopNav lefter={undefined} center={center} righter={undefined} />
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

const Content = styled.div<{ isClosing: boolean; isThanksContent: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  height: 100%;
  background-color: var(--ect-white);

  text-align: center;

  animation: ${({ isClosing, isThanksContent }) =>
      isThanksContent
        ? isClosing
          ? fadeOut
          : "none"
        : isClosing
        ? fadeOut
        : fadeIn}
    0.4s ease-in-out;
`;

const StarContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 22.0625rem;
  height: 100%;
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

  flex-grow: 1;

  gap: 5px;
`;

const SliderContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 22.0625rem;
  height: 100%;
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
  flex-grow: 1;

  width: 100%;

  gap: 8px;
  padding: 0 9px;
`;

interface SliderProps {
  value: number;
}

const SliderInput = styled.input.attrs<SliderProps>(() => ({
  type: "range",
}))`
  -webkit-appearance: none; /* 기본 브라우저 스타일 제거 */

  width: 100%;
  height: 19px;
  background: linear-gradient(
    to right,
    #f5f4ff 0%,
    /* 그라디언트 시작 색상 */ #dfcdff ${(props) => props.value * 10}%,
    /* 채워진 부분 끝 */ var(--grey-2) ${(props) => props.value * 10}%
      /* 비활성화된 부분 시작 */
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

const Label = styled.span.attrs<{ isActive?: boolean }>((props) => ({
  className: props.isActive
    ? "Podo-Ticket-Headline-H6"
    : "Podo-Ticket-Headline-H6",
}))<{ isActive?: boolean }>`
  color: ${(props) => (props.isActive ? "var(--purple-4)" : "var(--grey-5)")};
`;

const RatingDescription = styled.div.attrs({
  className: "Podo-Ticket-Headline-H6",
})`
  color: var(--grey-5);
`;

const ButtonContainer = styled.div`
  display: flex;

  width: 100%;

  gap: 20px;
  padding-bottom: 35px;
`;
