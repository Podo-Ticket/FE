// src/components/common/Modal.tsx
import React from 'react';
import styled from 'styled-components';
import ReactDOM from 'react-dom';

interface ModalProps {
  onClose: () => void;
  children?: React.ReactNode;
  isPage?: boolean;
  currentPage?: number;
  totalPage?: number;
}

const OnboardingModalLayout: React.FC<ModalProps> = ({
  onClose,
  children,
  isPage = false,
  currentPage,
  totalPage,
}) => {
  // Portal을 사용하여 body에 직접 렌더링

  console.log('모달 열림');
  return ReactDOM.createPortal(
    <ModalOverlay>
      <ModalDefault>
        <ModelHead>
          {isPage ? (
            <Page>
              <p style={{color: 'var(--purple-4)'}} className='Podo-Ticket-Headline-H2'>
                {' '}
                {currentPage}
              </p>
              <p style={{color: 'var(--grey-5)'}} className='Podo-Ticket-Headline-H4'>
                /
              </p>
              <p style={{color: 'var(--grey-5)'}} className='Podo-Ticket-Headline-H4'>
                {totalPage}
              </p>
            </Page>
          ) : (
            <div></div>
          )}
          <XButton onClick={onClose}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='14'
              height='14'
              viewBox='0 0 14 14'
              fill='none'
            >
              <g clip-path='url(#clip0_4753_128247)'>
                <path d='M1 1L13 13' stroke='#3C3C3C' stroke-width='2' stroke-linecap='round' />
                <path d='M1 13L13 1' stroke='#3C3C3C' stroke-width='2' stroke-linecap='round' />
              </g>
              <defs>
                <clipPath id='clip0_4753_128247'>
                  <rect width='14' height='14' fill='white' />
                </clipPath>
              </defs>
            </svg>
          </XButton>
        </ModelHead>

        {children}
      </ModalDefault>
    </ModalOverlay>,
    document.body, // body 태그에 렌더링
  );
};

export default OnboardingModalLayout;

const ModalOverlay = styled.div`
  position: fixed; /* ← 이 줄이 필요 */
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  z-index: 9999;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalDefault = styled.div`
  width: 90vw;

  aspect-ratio: 353 / 442;

  border-radius: 10px;

  background: var(--ect-white, #fff);
  padding: 5.66%;
`;

const ModelHead = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Page = styled.span`
  display: flex;
  flex-direction: row;
  gap: 2px;
`;

const XButton = styled.button`
  background: none;
  border: none;
`;
