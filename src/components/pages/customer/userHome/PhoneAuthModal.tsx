import React, {useState} from 'react';
import styled from 'styled-components';

import BackBtn from '@components/common/buttons/SmallBtn';
import NextBtn from '@components/common/buttons/SmallBtn';
import PrivacyPolicyModal from '@components/common/modals/TextModal';
import Loading from '@components/common/loadings/Loading.tsx';

import ErrorModal from '@components/common/errors/DefaultErrorModal.tsx';
import NoticeModal from '@components/common/modals/NoticeModal';

import CheckedIcon from '@assets/images/privacy_checked.png';
import UncheckedIcon from '@assets/images/privacy_unchecked.png';

import {USER_HOME, PERSONAL_INFORMATION_AGREE_CONTENT} from '@/constants/text/UIText.ts';
import {useNavigateTo} from '../../../../utils/NavigateUtil.ts';
import {checkPhoneNumber} from '../../../../api/user/UserHomeApi';
import {fadeIn, fadeOut} from '../../../../styles/animation/DefaultAnimation.ts';

interface PhoneAuthModalProps {
  showPhoneModal: boolean; // 버튼 동작 여부
  scheduleId: number;
  onAcceptFunc: () => void;
  onUnacceptFunc: () => void;
}

const PhoneAuthModal: React.FC<PhoneAuthModalProps> = ({
  showPhoneModal,
  scheduleId,
  onAcceptFunc,
  onUnacceptFunc,
}) => {
  const navigateTo = useNavigateTo();

  const language = localStorage.getItem('language');

  const [phone, setPhone] = useState('');

  const [isClosing, setIsClosing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxChange = () => {
    setIsChecked(prevChecked => !prevChecked);
  };
  const handleCheckboxClick = () => {
    setIsChecked(prevChecked => !prevChecked);
  };

  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const openPrivacyModal = () => setShowPrivacyModal(true);
  const closePrivacyModal = () => setShowPrivacyModal(false);

  const [invalidPhoneError, setInvalidPhoneError] = useState(false);
  const openInvalidPhoneError = () => setInvalidPhoneError(true);
  const closeInvalidPhoneError = () => setInvalidPhoneError(false);

  const [waitingForReservationError, setWaitingForReservationError] = useState(false);
  const openWaitingForReservationError = () => setWaitingForReservationError(true);
  const closeWaitingForReservationError = () => setWaitingForReservationError(false);

  if (!showPhoneModal) return null;

  const handleUnacceptClick = () => {
    setIsClosing(true); // 페이드아웃 애니메이션 시작
    setTimeout(() => {
      onUnacceptFunc(); // 애니메이션 종료 후 닫기 함수 호출
      setIsClosing(false); // 상태 초기화
    }, 300); // 애니메이션 시간과 동일하게 설정
  };

  const handlePhoneChange = (e: any) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // 숫자만 남기기
    let formattedValue = '';

    // 전화번호 형식에 맞게 하이픈 추가
    if (value.length > 0) {
      formattedValue += value.slice(0, 3);
    }
    if (value.length > 3) {
      formattedValue += '-' + value.slice(3, 7);
    }
    if (value.length > 7) {
      formattedValue += '-' + value.slice(7, 11);
    }

    setPhone(formattedValue);
  };

  const isButtonEnabled = isChecked && phone.length === 13;

  const handleSubmit = async () => {
    if (!isButtonEnabled) {
      return;
    }

    if (!phone || !scheduleId) {
      return;
    }

    try {
      setIsLoading(true);
      await delay(500);
      const result = await checkPhoneNumber(phone, scheduleId);

      if (localStorage.getItem('isForceLogout') === 'true') {
        navigateTo('/confirm');
      } else if (result.data === '예매 내역 확인 불가') {
        setShowNoticeModal(true);
      } else if (result.data === '이미 발권한 사용자') {
        navigateTo('/ticket'); // 티켓 페이지로 이동
      } else if (result.data === '현장 예매 수락 대기 중') {
        openWaitingForReservationError();
      } else {
        onAcceptFunc();
      }
    } catch (error) {
      openInvalidPhoneError(); // 에러 모달 표시
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalOverlay>
      <ModalContent isClosing={isClosing}>
        <ModalTopContainer>
          <HeadText className='Podo-Ticket-Headline-H2'>
            {language === 'english'
              ? USER_HOME.english.authModalTitle
              : USER_HOME.korean.authModalTitle}
          </HeadText>

          <PhoneInput
            className='Podo-Ticket-Body-B1'
            type='text'
            placeholder={
              language === 'english'
                ? USER_HOME.english.authInputPlaceholder
                : USER_HOME.korean.authInputPlaceholder
            }
            value={phone}
            onChange={handlePhoneChange}
          />

          <AgreementContainer className='Podo-Ticket-Body-B5'>
            <AgreementText isChecked={isChecked}>
              <HiddenCheckbox checked={isChecked} onChange={handleCheckboxChange} />
              <CustomCheckbox checked={isChecked} onClick={handleCheckboxClick}></CustomCheckbox>
              <span onClick={handleCheckboxClick} className='Podo-Ticket-Body-B5'>
                {language === 'english'
                  ? USER_HOME.english.authCheckbox
                  : USER_HOME.korean.authCheckbox}
              </span>
            </AgreementText>

            <AgreementModalLink
              href='#'
              className='Podo-Ticket-Body-B10'
              onClick={openPrivacyModal}
            >
              {language === 'english'
                ? USER_HOME.english.authShowMore
                : USER_HOME.korean.authShowMore}
            </AgreementModalLink>
          </AgreementContainer>
        </ModalTopContainer>

        <PhoneModalBtns>
          <BackBtn
            content={
              language === 'english'
                ? USER_HOME.english.authModalCancel
                : USER_HOME.korean.authModalCancel
            }
            onClick={handleUnacceptClick}
            isAvailable={true}
            isGray={true}
          />
          <NextBtn
            content={
              language === 'english'
                ? USER_HOME.english.authModalAccept
                : USER_HOME.korean.authModalAccept
            }
            onClick={handleSubmit}
            isAvailable={isButtonEnabled}
          />
        </PhoneModalBtns>
      </ModalContent>

      <PrivacyPolicyModal
        showTextModal={showPrivacyModal}
        onAcceptFunc={closePrivacyModal}
        title={
          language === 'english'
            ? USER_HOME.english.personalDataModalTitle
            : USER_HOME.korean.personalDataModalTitle
        }
        description={
          language === 'english'
            ? PERSONAL_INFORMATION_AGREE_CONTENT.english.detail
            : PERSONAL_INFORMATION_AGREE_CONTENT.korean.detail
        }
      />

      <Loading showLoading={isLoading} />

      <NoticeModal
        showNoticeModal={showNoticeModal}
        title={
          language === 'english'
            ? USER_HOME.english.noReserveDataModalTitle
            : USER_HOME.korean.noReserveDataModalTitle
        }
        description={
          language === 'english'
            ? USER_HOME.english.noReserveDataModalSubtitle
            : USER_HOME.korean.noReserveDataModalSubtitle
        }
        buttonContent={
          language === 'english'
            ? USER_HOME.english.noReserveDataModalAccept
            : USER_HOME.korean.noReserveDataModalAccept
        }
        onAcceptFunc={() => {
          setShowNoticeModal(false);
          navigateTo('/reserve');
        }}
      />

      <ErrorModal
        showDefaultErrorModal={invalidPhoneError}
        errorMessage='예매내역을 확인할 수 없습니다.'
        onAcceptFunc={closeInvalidPhoneError}
        OnTopSide={true}
      />

      <ErrorModal
        showDefaultErrorModal={waitingForReservationError}
        errorMessage='현장 예매 수락 대기 중 입니다.'
        onAcceptFunc={closeWaitingForReservationError}
        OnTopSide={true}
      />
    </ModalOverlay>
  );
};

export default PhoneAuthModal;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);

  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

const ModalContent = styled.div<{isClosing: boolean}>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 90%;
  background-color: var(--ect-white);
  border-radius: 10px;

  padding: 0 21px;
  padding-top: 30px;
  padding-bottom: 25px;
  gap: 20px;

  text-align: center;

  animation: ${({isClosing}) => (isClosing ? fadeOut : fadeIn)} 0.4s ease-in-out;
`;

const ModalTopContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  gap: 50px;
`;

const HeadText = styled.span`
  color: var(--charcoal-black);
`;

const PhoneInput = styled.input`
  width: 100%;

  border: none;
  border-bottom: 1px solid var(--grey-4);
  background: var(--ect-white);

  padding: 8px 28px;

  text-align: center;
  color: var(--grey-7);

  &:focus {
    outline: none;
    border-bottom: 1px solid var(--grey-7);
  }

  &::placeholder {
    color: var(--grey-5);
  }
`;

const AgreementContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 6px;
`;

const AgreementText = styled.span<{isChecked: boolean}>`
  display: flex;
  align-items: center;
  color: ${({isChecked}) => (isChecked ? 'var(--purple-5)' : 'var(--grey-6)')};
`;

const HiddenCheckbox = styled.input.attrs({type: 'checkbox'})`
  display: none;
`;

const CustomCheckbox = styled.div<{checked: boolean}>`
  width: 14px;
  height: 14px;
  margin-right: 3px;
  background-image: ${props => (props.checked ? `url(${CheckedIcon})` : `url(${UncheckedIcon})`)};
  background-size: contain;
  background-repeat: no-repeat;
  display: inline-block;
`;

const AgreementModalLink = styled.a`
  color: var(--grey-6);
`;

const PhoneModalBtns = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;

  gap: 11px;
`;
