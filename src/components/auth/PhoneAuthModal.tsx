import React, { useState } from 'react';
import styled from 'styled-components';

import BackBtn from '../button/SmallBtn'
import NextBtn from '../button/SmallBtn'
import PrivacyPolicyModal from '../modal/TextModal';
import ErrorModal from '../../components/error/DefaultErrorModal.tsx';

import CheckedIcon from '../../assets/images/privacy_checked.png'
import UncheckedIcon from '../../assets/images/privacy_unchecked.png'

import { checkPhoneNumber } from '../../api/user/UserHomeApi';
import { AGREE_CONTENT } from '../../constants/text/InfoText.ts'
import { fadeIn, fadeOut } from '../../styles/animation/DefaultAnimation.ts'

interface PhoneAuthModalProps {
  showPhoneModal: boolean;       // 버튼 동작 여부
  scheduleId: number;
  onAcceptFunc: () => void;
  onUnacceptFunc: () => void;
}

const PhoneAuthModal: React.FC<PhoneAuthModalProps> = ({ showPhoneModal, scheduleId, onAcceptFunc, onUnacceptFunc }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [isChecked, setIsChecked] = useState(false); // 체크박스 상태 관리  
  const [phone, setPhone] = useState(''); // 전화번호 상태 추가

  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const openPrivacyModal = () => setShowPrivacyModal(true);
  const closePrivacyModal = () => setShowPrivacyModal(false);

  const [invalidPhoneError, setInvalidPhoneError] = useState(false);
  const openInvalidPhoneError = () => setInvalidPhoneError(true);
  const closeInvalidPhoneError = () => setInvalidPhoneError(false);

  if (!showPhoneModal) return null;

  const handleUnacceptClick = () => {
    setIsClosing(true); // 페이드아웃 애니메이션 시작
    setTimeout(() => {
      onUnacceptFunc(); // 애니메이션 종료 후 닫기 함수 호출
      setIsClosing(false); // 상태 초기화
    }, 300); // 애니메이션 시간과 동일하게 설정
  };

  const handlePhoneChange = (e) => {
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

  const handleCheckboxChange = () => {
    setIsChecked(prevChecked => !prevChecked);
  };

  const handleCheckboxClick = () => {
    setIsChecked(prevChecked => !prevChecked);
  };

  const isButtonEnabled = isChecked && phone.length === 13; // Assuming formatted phone is "000-0000-0000"

  const handleSubmit = async () => {
    if (isButtonEnabled) {
      if (!phone || !scheduleId) {
        console.error("전화번호 또는 scheduleId 없음");
        return;
      }
      try {
        console.log("전화번호 검증 시작:", phone, scheduleId);
        const result = await checkPhoneNumber(phone, scheduleId);
        console.log("전화번호 검증 성공:", result);

        if (result.data === '예매 내역 확인 불가') {
          openInvalidPhoneError(); // 에러 모달 표시
        }
        else {
          onAcceptFunc(); // 부모 컴포넌트에서 처리할 로직 실행
        }

      } catch (error) {
        console.error("전화번호 검증 실패:", error);
        openInvalidPhoneError(); // 에러 모달 표시
      }
    } else {
      console.log("버튼 비활성화 상태");
    }
  };


  return (

    <ModalOverlay>
      <ModalContent isClosing={isClosing}>

        <ModalTopContainer>

          <HeadText className='Podo-Ticket-Headline-H2'>예매 내역 확인</HeadText>

          <PhoneInput
            className='Podo-Ticket-Body-B1'
            type="text" placeholder="전화번호를 입력해 주세요"
            value={phone}
            onChange={handlePhoneChange} />

          <AgreementContainer className='Podo-Ticket-Body-B5'>

            <AgreementText isChecked={isChecked}>
              <HiddenCheckbox checked={isChecked} onChange={handleCheckboxChange} />
              <CustomCheckbox checked={isChecked} onClick={handleCheckboxClick} ></CustomCheckbox>
              <span onClick={handleCheckboxClick} className='Podo-Ticket-Body-B5'>개인정보 수집 동의</span>
            </AgreementText>

            <AgreementModalLink href="#" className="Podo-Ticket-Body-B10" onClick={openPrivacyModal}>전문보기</AgreementModalLink>
          </AgreementContainer>

        </ModalTopContainer>

        <PhoneModalBtns>
          <BackBtn content="이전" onClick={handleUnacceptClick} isAvailable={true} isGray={true} />
          <NextBtn content="다음" onClick={handleSubmit} isAvailable={isButtonEnabled} />
        </PhoneModalBtns>
      </ModalContent>

      <PrivacyPolicyModal
        showTextModal={showPrivacyModal}
        onAcceptFunc={closePrivacyModal}
        title='개인정보 수집 동의 약관'
        description={AGREE_CONTENT}
      />

      <ErrorModal
        showDefaultErrorModal={invalidPhoneError}
        errorMessage="예매내역을 확인할 수 없습니다."
        onAcceptFunc={closeInvalidPhoneError}
        OnTopSide={true}
      />

    </ModalOverlay>

  );
}

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

const ModalContent = styled.div<{ isClosing: boolean }>`
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

  animation: ${({ isClosing }) => (isClosing ? fadeOut : fadeIn)} 0.4s ease-in-out;
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

const AgreementText = styled.span<{ isChecked: boolean }>`
  display: flex;
  align-items: center;
  color: ${({ isChecked }) => (isChecked ? 'var(--purple-5)' : 'var(--grey-6)')};
`;

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  display: none;
`;

const CustomCheckbox = styled.div <{ checked: boolean }>`
  width: 14px;
  height: 14px; 
  margin-right: 3px;
  background-image: ${props => props.checked ?
    `url(${CheckedIcon})` :
    `url(${UncheckedIcon})`};
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