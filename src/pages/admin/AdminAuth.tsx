import { useState, useEffect, SetStateAction } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

import AccessAdminBtn from '../../components/button/LargeBtn'
import DefaultErrorModal from '../../components/error/DefaultErrorModal';
import AdminCodeInput from '../../components/inputField/DefaultInput';

import podoIcon from '../../assets/images/podo_icon.png'

import { fadeIn } from '../../styles/animation/DefaultAnimation.ts'
import { verifyAdminCode } from '../../api/admin/AdminAuthApi';

const AdminAuth = () => {
    const navigate = useNavigate();

    const [adminCode, setAdminCode] = useState('');
    const handleInputChange = (e: { target: { value: SetStateAction<string>; }; }) => setAdminCode(e.target.value);
    const handleAccessAdmin = async () => {
        try {
            const response = await verifyAdminCode(adminCode); // 유틸리티 함수 호출

            if (response.success) {
                navigate('/home'); // 인증 성공 시 이동
            }
        } catch (error: any) {
            console.error("Error during API call:", error.message);
            setIsInvalidCodeModalOpen(true); // 인증 실패 시 모달 열기
        }
    };

    const [isInvalidCodeModalOpen, setIsInvalidCodeModalOpen] = useState(false);

    const [isContentVisible, setIsContentVisible] = useState(false);
    const [isHighlightedTextVisible, setIsHighlightedTextVisible] = useState(false);
    const [isInputVisible, setIsInputVisible] = useState(false);

    useEffect(() => {
        // 첫 번째 설명 텍스트를 페이드 인
        const descriptionTimer = setTimeout(() => {
            setIsContentVisible(true);
        }, 300); // 첫 번째 텍스트는 약간의 지연 후 표시

        // "포도티켓"을 나중에 페이드 인
        const highlightedTextTimer = setTimeout(() => {
            setIsHighlightedTextVisible(true);
        }, 1000); // 두 번째 텍스트는 더 긴 지연 후 표시

        // Input을 나중에 페이드 인
        const inputTimer = setTimeout(() => {
            setIsInputVisible(true);
        }, 1500); // 두 번째 텍스트는 더 긴 지연 후 표시

        return () => {
            clearTimeout(descriptionTimer);
            clearTimeout(highlightedTextTimer);
            clearTimeout(inputTimer);
        };
    }, []);

    return (
        <ViewContainer>

            <AdminAuthContent>

                <GraphIcon src={podoIcon} isVisible={isContentVisible} />
                <Description isVisible={isContentVisible}>예매부터 입장까지!</Description>
                <Description isVisible={isContentVisible}>편리한 티켓관리 솔루션,</Description>
                <Description isVisible={isContentVisible}>
                    <HighlightedText className='Podo-Ticket-Headline-H2'
                        style={{ color: 'var(--purple-4)' }}
                        isVisible={isHighlightedTextVisible}>포도티켓</HighlightedText> 입니다.</Description>
                <InputContainer isVisible={isInputVisible}>
                    <AdminCodeInput
                        category="인증코드"
                        placeholder="인증코드를 입력해주세요."
                        value={adminCode}
                        onChangeFunc={handleInputChange}
                    />
                </InputContainer>
            </AdminAuthContent>


            <ButtonContainer isVisible={isInputVisible}>
                <AccessAdminBtn
                    content="접속"
                    onClick={handleAccessAdmin}
                    isAvailable={adminCode.trim() !== ""}
                />
            </ButtonContainer>

            <DefaultErrorModal
                showDefaultErrorModal={isInvalidCodeModalOpen}
                errorMessage="잘못된 인증 코드입니다."
                onAcceptFunc={() => setIsInvalidCodeModalOpen(false)}
                aboveButton={true}
            />

        </ViewContainer >
    );
};

export default AdminAuth;

const ViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  gap: 14px;

`;

const AdminAuthContent = styled.div`
  display: flex;
  flex-direction: column;

  padding: 40px;
`;

const GraphIcon = styled.img<{ isVisible?: boolean }>`
  width: 52px;
  height: 68px;

  margin-top: 70px;
  margin-bottom: 20px;

  opacity: ${({ isVisible }) => (isVisible ? '1' : '0')};
  animation: ${({ isVisible }) => (isVisible ? fadeIn : '')} 0.5s ease-in-out forwards;
`;

const ButtonContainer = styled.div<{ isVisible?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  opacity: ${({ isVisible }) => (isVisible ? '1' : '0')};
  animation: ${({ isVisible }) => (isVisible ? fadeIn : '')} 0.5s ease-in-out forwards;
`;

const Description = styled.div.attrs({ className: 'Podo-Ticket-Body-B1' }) <{ isVisible?: boolean }>`
  color: var(--grey-7);
  opacity: ${({ isVisible }) => (isVisible ? '1' : '0')};
  animation: ${({ isVisible }) => (isVisible ? fadeIn : '')} 0.5s ease-in-out forwards;
`;

const HighlightedText = styled.span <{ isVisible?: boolean }>`
  opacity: ${({ isVisible }) => (isVisible ? '1' : '0')};
  animation: ${({ isVisible }) => (isVisible ? fadeIn : '')} 0.5s ease-in-out forwards;
`;

const InputContainer = styled.div <{ isVisible?: boolean }>`
  margin-top: 146px;

  opacity: ${({ isVisible }) => (isVisible ? '1' : '0')};
  animation: ${({ isVisible }) => (isVisible ? fadeIn : '')} 0.5s ease-in-out forwards;
`;