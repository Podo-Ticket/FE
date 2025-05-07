import React, { useState } from "react";
import {
  USER_HOME,
  PERSONAL_INFORMATION_AGREE_CONTENT,
} from "../../constants/text/UIText.ts";
import { useNavigateTo } from "../../utils/NavigateUtil.ts";
import styled from "styled-components";
import TopNav from "@components/layout/headers/TopNav";
import ReservationCheckLabel from "@/components/pages/customer/userHome/ReservationCheckLabel.tsx";
import MediumBtn from "@components/common/buttons/MediumBtn.tsx";
import CheckedIcon from "@assets/icons/ic_privacy_checked.svg";
import UncheckedIcon from "@assets/icons/ic_privacy_unchecked.svg";
import Loading from "@components/common/loadings/Loading.tsx";

import ErrorModal from "@components/common/errors/DefaultErrorModal.tsx";
import NoticeModal from "@components/common/modals/NoticeModal";
import Success from "@components/common/loadings/Success.tsx";
import PhoneActiveIcon from "@assets/icons/ic_phone_active.svg";
import PhoneDefaultIcon from "@assets/icons/ic_phone_default.svg";
import { checkPhoneNumber } from "../../api/user/UserHomeApi";

const IssueTicket: React.FC = () => {
  const scheduleId = Number(localStorage.getItem("scheduleId"));
  const language = localStorage.getItem("language");

  const [phone, setPhone] = useState("");
  const [step, setStep] = useState(1);
  const [isChecked, setIsChecked] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [invalidPhoneError, setInvalidPhoneError] = useState(false);
  const [waitingForReservationError, setWaitingForReservationError] =
    useState(false);

  const isValidPhone = /^\d{3}-\d{4}-\d{4}$/.test(phone);

  const closeInvalidPhoneError = () => setInvalidPhoneError(false);
  const closeWaitingForReservationError = () =>
    setWaitingForReservationError(false);
  const openInvalidPhoneError = () => setInvalidPhoneError(true);
  const openWaitingForReservationError = () =>
    setWaitingForReservationError(true);

  const navigateTo = useNavigateTo();
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const agreementTitle =
    language === "english"
      ? PERSONAL_INFORMATION_AGREE_CONTENT.english.title
      : PERSONAL_INFORMATION_AGREE_CONTENT.korean.title;
  const description =
    language === "english"
      ? PERSONAL_INFORMATION_AGREE_CONTENT.english.detail
      : PERSONAL_INFORMATION_AGREE_CONTENT.korean.detail;
  const navTitle =
    language === "english"
      ? USER_HOME.english.pickupBtn
      : USER_HOME.korean.pickupBtn;

  const checkReservation =
    language === "english"
      ? USER_HOME.english.checkReservation
      : USER_HOME.korean.checkReservation;

  const acceptTerms =
    language === "english"
      ? USER_HOME.english.acceptTerms
      : USER_HOME.korean.acceptTerms;

  const preveButton =
    language === "english"
      ? USER_HOME.english.authModalCancel
      : USER_HOME.korean.authModalCancel;

  const NextButton =
    language === "english"
      ? USER_HOME.english.authModalAccept
      : USER_HOME.korean.authModalAccept;

  const topNav = {
    text: navTitle,
  };

  const handlePhoneChange = (e: any) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // 숫자만 남기기
    let formattedValue = "";

    // 전화번호 형식에 맞게 하이픈 추가
    if (value.length > 0) {
      formattedValue += value.slice(0, 3);
    }
    if (value.length > 3) {
      formattedValue += "-" + value.slice(3, 7);
    }
    if (value.length > 7) {
      formattedValue += "-" + value.slice(7, 11);
    }

    setPhone(formattedValue);
  };

  const handlePrevButton = () => {
    if (step === 1) {
      navigateTo("/");
    } else setStep(1);
  };

  const handleCheckboxClick = () => {
    setIsChecked((prevChecked) => !prevChecked);
  };

  const handleActivateNextButton = () => {
    switch (step) {
      case 1:
        return isValidPhone;

      case 2:
        return isChecked;

      default:
        return false;
    }
  };
  const handleAuthModalAccept = (nav: string) => {
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      navigateTo(nav);
    }, 1000);
  };

  const handleSubmit = async () => {
    if (!phone || !scheduleId) {
      console.error("전화번호 또는 scheduleId 없음");
      return;
    }

    try {
      setIsLoading(true);
      await delay(500);
      const result = await checkPhoneNumber(phone, scheduleId);

      if (localStorage.getItem("isForceLogout") === "true") {
        setIsSuccess(true);
        navigateTo("/confirm");
      } else if (result.data === "예매 내역 확인 불가") {
        setShowNoticeModal(true);
      } else if (result.data === "이미 발권한 사용자") {
        handleAuthModalAccept("/ticket");
      } else if (result.data === "현장 예매 수락 대기 중") {
        openWaitingForReservationError();
      } else handleAuthModalAccept("/select");
    } catch (error) {
      openInvalidPhoneError(); // 에러 모달 표시
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextButton = () => {
    switch (step) {
      case 1:
        return setStep(2);
      case 2:
        return handleSubmit();
    }
  };

  return (
    <Container>
      {" "}
      <TopNav center={topNav} isUnderlined={true} />
      <Contents>
        <Step>
          <ReservationCheckLabel isActive={true} labelText={checkReservation} />
          <LabelLine></LabelLine>
          <ReservationCheckLabel
            isActive={step === 2}
            labelText={acceptTerms}
          />
        </Step>
        {step === 1 && (
          <PhoneNumberContainer>
            <PhoneImg
              src={phone ? PhoneActiveIcon : PhoneDefaultIcon}
              alt="전화번호 입력 아이콘"
            ></PhoneImg>{" "}
            <PhoneInput
              className="Podo-Ticket-Body-B4"
              type="text"
              placeholder={
                language === "english"
                  ? USER_HOME.english.authInputPlaceholder
                  : USER_HOME.korean.authInputPlaceholder
              }
              value={phone}
              onChange={handlePhoneChange}
            />
          </PhoneNumberContainer>
        )}

        {step === 2 && (
          <AgreementContainer>
            <AgreementContainerHeader>
              <AgreementContainerTitle className="Podo-Ticket-Body-B4">
                {agreementTitle}
              </AgreementContainerTitle>
              <CustomCheckbox
                checked={isChecked}
                onClick={handleCheckboxClick}
              ></CustomCheckbox>
            </AgreementContainerHeader>
            <ContentPrivacy className="Podo-Ticket-Body-B8">
              {description}
            </ContentPrivacy>
          </AgreementContainer>
        )}
      </Contents>
      <ButtonContainer>
        <MediumBtn
          content={preveButton}
          onClick={handlePrevButton}
          isAvailable={true}
          isGray={true}
        />
        <MediumBtn
          content={NextButton}
          onClick={handleNextButton}
          isAvailable={handleActivateNextButton()}
        />
      </ButtonContainer>
      <Loading showLoading={isLoading} />
      <Success showSuccess={isSuccess} />
      <NoticeModal
        showNoticeModal={showNoticeModal}
        title={
          language === "english"
            ? USER_HOME.english.noReserveDataModalTitle
            : USER_HOME.korean.noReserveDataModalTitle
        }
        description={
          language === "english"
            ? USER_HOME.english.noReserveDataModalSubtitle
            : USER_HOME.korean.noReserveDataModalSubtitle
        }
        buttonContent={
          language === "english"
            ? USER_HOME.english.noReserveDataModalAccept
            : USER_HOME.korean.noReserveDataModalAccept
        }
        onAcceptFunc={() => {
          setShowNoticeModal(false);
          navigateTo("/reserve");
        }}
      />
      <ErrorModal
        showDefaultErrorModal={invalidPhoneError}
        errorMessage="예매내역을 확인할 수 없습니다."
        onAcceptFunc={closeInvalidPhoneError}
        OnTopSide={true}
      />
      <ErrorModal
        showDefaultErrorModal={waitingForReservationError}
        errorMessage="현장 예매 수락 대기 중 입니다."
        onAcceptFunc={closeWaitingForReservationError}
        OnTopSide={true}
      />
    </Container>
  );
};

export default IssueTicket;

const Container = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100svh;
`;
const Step = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 1%;
`;

const Contents = styled.div`
  width: 100%;
  height: 100%;
  min-width: 347px;
  display: flex;
  flex-direction: column;
  padding: 2svh 5.8vw;
  gap: 2svh;
`;

const PhoneNumberContainer = styled.div`
  display: flex;
  position: relative;
`;
const PhoneImg = styled.img`
  position: absolute;
  top: 50%;

  transform: translateY(-50%);
  margin: 0 5%;
`;
const PhoneInput = styled.input`
  border: 1px solid var(--grey-grey-4, #bababa);
  border-radius: 10px;
  height: 8.9svh;
  max-height: 64px;
  width: 100%;
  background: var(--ect-white);

  padding: 8px 15.8%;

  color: var(--grey-7);

  &:focus {
    outline: none;
    border: 1px solid var(--purple-6);
  }

  &::placeholder {
    color: var(--grey-5);
  }
`;

const LabelLine = styled.span`
  display: flex;
  width: 20px;
  height: 1px;
  align-items: center;
  justify-content: center;
  background: #bababa;
`;

const ButtonContainer = styled.div`
  display: flex;

  width: 100%;

  gap: 10px;

  padding: 0 5.8vw;
  margin-bottom: 5.44svh;
`;

const AgreementContainer = styled.div`
  max-height: 60svh;
`;
const ContentPrivacy = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;

  height: 89%;

  border-radius: 10px;
  background-color: var(--grey-2);

  margin-bottom: 23px;
  padding: 10px;
  padding-right: 20px;

  color: var(--grey-6);

  overflow-y: auto;
`;
const AgreementContainerHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const AgreementContainerTitle = styled.p`
  padding-left: 1.27vw;
  margin-bottom: 15px;
`;
const CustomCheckbox = styled.div<{ checked: boolean }>`
  width: 20px;
  height: auto;
  margin-right: 3px;
  background-image: ${(props) =>
    props.checked ? `url(${CheckedIcon})` : `url(${UncheckedIcon})`};
  background-size: contain;
  background-repeat: no-repeat;
  display: inline-block;
`;
