// src/components/common/Modal.tsx
import React from 'react';
import styled from 'styled-components';

import SingleManageBtn from '@components/common/buttons/SmallBtn';
import MultipleManageBtn from '@components/common/buttons/SmallBtn';

interface ModalProps {
  setMenu: (menu: string) => void;
  currentPageIndex: number; // 부모로부터 현재 페이지 인덱스 받음
  setCurrentPageIndex: (index: number | ((prevIndex: number) => number)) => void; // 부모로부터 페이지 인덱스 변경 함수 받음
  currentMenuContent: {
    steps: {
      title: React.ReactNode;
      image: string;
      nextTitle?: React.ReactNode;
      imgStyle?: React.CSSProperties;
      overlayImage?: string;
      overlayImgStyle?: React.CSSProperties;
    }[];
  }; // 부모로부터 전체 메뉴 콘텐츠 정보 받음
}

const OnboardingContents: React.FC<ModalProps> = ({
  setMenu,
  currentPageIndex,
  setCurrentPageIndex,
  currentMenuContent,
}) => {
  if (!currentMenuContent) return null;

  const currentStep = currentMenuContent.steps[currentPageIndex];
  if (!currentStep) return null;

  const isLastPage = currentPageIndex === currentMenuContent.steps.length - 1;

  const handleNext = () => {
    if (!isLastPage) {
      // 마지막 페이지가 아니라면 다음 페이지로 이동
      setCurrentPageIndex(prevIndex => prevIndex + 1);
    } else {
      // 마지막 페이지라면 메뉴로 돌아가고 상태 초기화
      setMenu('');
      setCurrentPageIndex(0);
    }
  };

  const handleBack = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(prevIndex => prevIndex - 1);
    } else {
      setMenu('');
    }
  };
  return (
    <ModalContentWrapper>
      <ModalContent>
        <ModalTitle>{currentStep.title}</ModalTitle>
        <ModalDiv>
          <ModalImg src={currentStep.image} style={currentStep.imgStyle}></ModalImg>
          {currentStep.overlayImage && (
            <ModalOverlayImg src={currentStep.overlayImage} style={currentStep.overlayImgStyle} />
          )}
        </ModalDiv>
      </ModalContent>
      <ButtonContainer>
        <SingleManageBtn content={'뒤로'} onClick={handleBack} isGray={true} isAvailable={true} />
        <MultipleManageBtn
          content={isLastPage ? '확인' : '다음'}
          onClick={handleNext}
          isGray={false}
          isAvailable={true}
        />
      </ButtonContainer>
    </ModalContentWrapper>
  );
};

export default OnboardingContents;

const ModalContentWrapper = styled.div`
  height: 84.4%;
  display: grid;
  grid-template-rows: 86.9% 13.1%;

  margin-top: 6.8%;

  width: 100%;
`;

const ModalContent = styled.div`
  display: grid;
  grid-template-rows: 13.1% 86.9%;

  align-items: center;

  width: 87.5%;
  box-sizing: border-box;
`;

const ModalTitle = styled.div`
  display: flex;
  flex-direction: column;

  gap: 5px;
`;

const ModalDiv = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;

  position: relative;
`;

const ModalImg = styled.img``;
const ModalOverlayImg = styled.img``;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  gap: 2.54vw;
  width: 87.5%;
`;
