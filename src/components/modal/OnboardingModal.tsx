import React, { useState } from 'react';
import styled from 'styled-components';

import onboardingHomeImage from '../../assets/images/admin/onboarding_home.png';
import onboardingOnsiteImage from '../../assets/images/admin/onboarding_onsite.png';
import onboardingRealtimeImage from '../../assets/images/admin/onboarding_realtime.png';
import onboardingReservedImage from '../../assets/images/admin/onboarding_reserved.png';
import dontpresentChecked from '../../assets/images/admin/dont_present_checked.png';
import dontpresentUnchecked from '../../assets/images/admin/dont_present_unchecked.png';
import closeImage from '../../assets/images/admin/white_x.png';

import { fadeIn, fadeOut } from '../../styles/animation/DefaultAnimation.ts'

interface OnboardingModalProps {
  showOnboardingModal: boolean;
  pageType: number;
  onDismissFunc: () => void;
  isDontShowAgainChecked: boolean;
  setIsDontShowAgainChecked: (checked: boolean) => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ showOnboardingModal, pageType,
  onDismissFunc, isDontShowAgainChecked, setIsDontShowAgainChecked, }) => {
  const [isClosing] = useState(false);

  if (!showOnboardingModal && !isClosing) return null;

  const imageMap: Record<number, string> = {
    0: onboardingHomeImage,
    1: onboardingOnsiteImage,
    2: onboardingRealtimeImage,
    3: onboardingReservedImage,
  };

  const getImageSrc = () => imageMap[pageType] || ''; // 기본값 처리

  const handleCheckboxClick = () => {
    setIsDontShowAgainChecked(!isDontShowAgainChecked); // 체크 상태 토글
  };

  return (
    <Overlay>
      <Content isClosing={isClosing}>
        <PageTypeImage src={getImageSrc()} />

        <CheckBoxContainer>
          <CheckBoxContent>
            <AgreementText>
              <HiddenCheckbox checked={isDontShowAgainChecked} onChange={(e) => setIsDontShowAgainChecked(e.target.checked)} />
              <CustomCheckbox checked={isDontShowAgainChecked} onClick={handleCheckboxClick} />
              <span onClick={handleCheckboxClick} className='Podo-Ticket-Headline-H5'>다시 보지 않기</span>
            </AgreementText>
          </CheckBoxContent>
          <CloseButton src={closeImage} onClick={onDismissFunc} />
        </CheckBoxContainer>
      </Content>
    </Overlay>
  );
};

export default OnboardingModal;

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

  pointer-events: auto;
`;

const Content = styled.div <{ isClosing: boolean }>`
  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;

  animation: ${({ isClosing }) => (isClosing ? fadeOut : fadeIn)} 0.3s ease-in-out;
`;

const PageTypeImage = styled.img`
width: 100%;
height: 100%;
`;

const CheckBoxContainer = styled.div`
  position: absolute;
  top: 92%;
  left: 0;

  display: flex;

  align-items: center;

  width: 100%;
  background: rgba(0, 0, 0, 0.60);
  padding: 15px 25px;

  color: var(--ect-white);
`;

const CheckBoxContent = styled.div`
  display: flex;
  align-items: center;

  flex-grow: 1;
`;

const CloseButton = styled.img`
  width: 14px;
  height: 14px;
`;

const AgreementText = styled.span`
  display: flex;
  align-items: center;
  color: var(--ect-white);

  gap: 10px;
`;

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  display: none;
`;

const CustomCheckbox = styled.div <{ checked: boolean }>`
  width: 14px;
  height: 14px; 
  margin-right: 3px;
  background-image: ${props => props.checked ?
    `url(${dontpresentChecked})` :
    `url(${dontpresentUnchecked})`};
  background-size: contain;
  background-repeat: no-repeat;
  display: inline-block;
`;