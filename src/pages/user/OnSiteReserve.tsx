import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

import TopNav from '../../components/nav/TopNav';
import NameInput from '../../components/inputField/DefaultInput';
import PhoneInput from '../../components/inputField/DefaultInput';
import AttendeesInput from '../../components/inputField/DefaultInput';
import PerformanceInput from '../../components/inputField/DefaultInput';
import LoadingModal from '../../components/loading/Loading';
import ErrorModal from '../../components/error/DefaultErrorModal';
import LargeBtn from '../../components/button/LargeBtn';

import goBackIcon from '../../assets/images/left_arrow.png'
import { DateUtil } from '../../utils/DateUtil';
import { fadeIn } from '../../styles/animation/DefaultAnimation.ts'
import { fetchPerformanceSchedules, submitReservation, createApprovalChecker } from '../../api/user/OnSiteReserveApi';

function OnSiteReserve() {
    const navigate = useNavigate();

    const [name, setName] = useState(''); // 이름
    const [phone, setPhone] = useState(''); // 휴대폰 번호
    const [attendees, setAttendees] = useState(''); // 예매 인원
    const [performance, setPerformance] = useState(''); // 공연 회차
    const [performanceSchedules, setPerformanceSchedules] = useState([]);
    const [isWaitAdminModalOpen, setIsWaitAdminModalOpen] = useState(false);
    const [isDuplicatePhoneModalOpen, setIsDuplicatePhoneModalOpen] = useState(false);
    const [invalidErrorMessage, setInvalidErrorMessage] = useState('');
    const [isClosing, setIsClosing] = useState(false);

    //Animation modal declaration
    const [isLoading, setIsLoading] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

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

        setPhone(formattedValue); // 포맷된 전화번호 상태 업데이트
    };

    useEffect(() => {
        console.log(performanceSchedules);
        loadSchedules(); // 컴포넌트가 마운트될 때 공연 회차 정보 가져오기
    }, []);

    // 공연 회차 정보 가져오기
    const loadSchedules = async () => {
        try {
            const schedules = await fetchPerformanceSchedules(1);
            setPerformanceSchedules(schedules);
        } catch (error) {
            console.error('Failed to load schedules:', error);
        }
    };

    // 예매 신청 처리
    const handleSubmit = async () => {
        try {
            const response = await submitReservation({
                name,
                phoneNumber: phone,
                headCount: attendees,
                scheduleId: performance
            });

            if (response.success) {
                handleWaitingApprove();
            } else if (response.error === "이미 예약되었습니다.") {
                setInvalidErrorMessage(response.error);
                setIsDuplicatePhoneModalOpen(true);
            }
        } catch (error) {
            console.log("에러")
        }
    };

    // 예매 승인 상태 확인
    const handleWaitingApprove = () => {
        const approvalChecker = createApprovalChecker();

        approvalChecker.startPolling(
            () => { /* 승인 처리 로직 */ },
            () => { /* 타임아웃 처리 */ },
            (message) => { /* 에러 처리 */ }
        );
    };

    // 버튼 활성화 조건
    const isButtonDisabled = !name || !phone || !attendees || !performance;
    
    const lefter = {
        icon: goBackIcon,
        iconWidth: 13,
        iconHeight: 20,
        text: "현장 예매",
        clickFunc: () => navigate('/')
    }

    return (
        <OnSiteReserveContainer>
            <TopNav lefter={lefter} center={lefter} righter={null} isUnderlined={true}/>

            <InputContainer>
                <NameInput
                    category="이름"
                    placeholder="이름을 입력해주세요."
                    value={name}
                    onChangeFunc={(e) => setName(e.target.value)}
                />

                <PhoneInput
                    category="연락처"
                    placeholder="연락처을 입력해주세요."
                    value={phone}
                    onChangeFunc={handlePhoneChange}
                />

                <AttendeesInput
                    isSelect={true}
                    isNumberSelect={true}
                    category="예매 인원"
                    placeholder="예매 인원을 입력해주세요."
                    value={attendees}
                    onChangeFunc={(e) => setAttendees(e.target.value)}
                />

                <PerformanceInput
                    isSelect={true}
                    options={
                        performanceSchedules.map(schedule => ({
                            value: schedule.id,
                            label: `${DateUtil.formatDate(schedule.date_time)} [여석: ${schedule.available_seats}]`
                        }))}
                    category="공연 회차"
                    placeholder="공연 회차을 입력해주세요."
                    value={performance}
                    onChangeFunc={(e) => setPerformance(e.target.value)}
                />

            </InputContainer>

            <ButtonContainer>
                <LargeBtn
                    content="예매 신청"
                    onClick={handleSubmit}
                    isAvailable={!isButtonDisabled}
                />
            </ButtonContainer>

            <ErrorModal
                showDefaultErrorModal={isDuplicatePhoneModalOpen}
                errorMessage="이미 예매 신청이 완료된 연락처입니다."
                onAcceptFunc={() => setIsDuplicatePhoneModalOpen(false)}
                OnTopSide={true}
            />

        </OnSiteReserveContainer>
    );
}

export default OnSiteReserve;

const OnSiteReserveContainer = styled.div`

`;

const InputContainer = styled.div`
display: flex;
flex-direction: column;

gap: 30px;
padding: 25px 30px;

animation: ${fadeIn} 0.5s ease-in-out;
`;

const ButtonContainer = styled.div`
display: flex;
justify-content: center;
align-items: center;

margin-top: 75px;

animation: ${fadeIn} 0.5s ease-in-out;
`;