import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SERVER_URL } from '../../constants/ServerURL';
import { useSchedule } from '../../hook/ScheduleContext';

import '../../styles/user/OnSiteReserve.css';
import { ChevronLeft } from 'lucide-react';
import WaitAdminModal from '../../components/modal/WaitAdminModal';
import LoadingModal from '../../components/modal/LoadingModal';
import CompleteModal from '../../components/modal/CompleteModal';

function OnSiteReserve() {
    const navigate = useNavigate();

    const [name, setName] = useState(''); // 이름
    const [phone, setPhone] = useState(''); // 휴대폰 번호
    const [attendees, setAttendees] = useState(''); // 예매 인원
    const [performance, setPerformance] = useState(''); // 공연 회차
    const { scheduleId, setScheduleId } = useSchedule();
    const [performanceSchedules, setPerformanceSchedules] = useState([]);
    const [isWaitAdminModalOpen, setIsWaitAdminModalOpen] = useState(false);
    const [isDuplicatePhoneModalOpen, setIsDuplicatePhoneModalOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [error, setError] = useState(''); // 오류 메시지 상태

    //Animation modal declaration
    const [isLoading, setIsLoading] = useState(false);
    const [isComplete, setIsComplete] = useState(false);


    const formatDate = (dateString) => {
        // 날짜 문자열을 'YYYY-MM-DD HH:mm:ss' 형식으로 받을 것으로 가정
        const dateParts = dateString.split(' ')[0].split('-');
        const timeParts = dateString.split(' ')[1].split(':');

        const year = dateParts[0];
        const month = dateParts[1].padStart(2, '0'); // 두 자리 수로 만들기
        const day = dateParts[2].padStart(2, '0'); // 두 자리 수로 만들기
        const hours = timeParts[0].padStart(2, '0'); // 두 자리 수로 만들기
        const minutes = timeParts[1].padStart(2, '0'); // 두 자리 수로 만들기

        // 요일 계산
        const date = new Date(`${year}-${month}-${day}T${hours}:${minutes}`);
        const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];

        return `${year}.${month}.${day} (${dayOfWeek}) ${hours}:${minutes}`;
    };

    const gotoUserHome = () => {
        navigate('/');
    };

    const handleDuplicatePhoneOverlayClick = () => {
        setIsClosing(true); // 애니메이션 시작
        setTimeout(() => {
          setIsDuplicatePhoneModalOpen(false); // 모달 닫기
          setIsClosing(false); // 애니메이션 상태 초기화
        }, 300); // 애니메이션과 같은 시간으로 설정
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

        setPhone(formattedValue); // 포맷된 전화번호 상태 업데이트
    };

    const fetchPerformanceSchedules = async () => {
        try {
            const response = await axios.get(`${SERVER_URL}/reservation`, {
                params: { playId : 1 }, // scheduleId를 쿼리 파라미터로 전달
                withCredentials: true, // 세션 쿠키 포함
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setPerformanceSchedules(response.data.schedules); // 공연 회차 목록 설정
            console.log(response.data.schedules);
        } catch (error) {
            console.error('Error fetching performance schedules:', error);
        }
    };

    useEffect(() => {
        console.log(scheduleId);
        console.log(performanceSchedules);
        fetchPerformanceSchedules(); // 컴포넌트가 마운트될 때 공연 회차 정보 가져오기
    }, []);

    // 버튼 활성화 조건
    const isButtonDisabled = !name || !phone || !attendees || !performance;

    const handleSubmit = async () => {
        try {
            const response = await axios.post(`${SERVER_URL}/reservation`, {
                name,
                phoneNumber: phone,
                headCount: attendees,
                scheduleId: performance
            }, {
                withCredentials: true, // 쿠키 포함
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.data.success) {
                console.log("웨이팅 허락 입장");
                handleWaitingApprove(); // 대기 승인 확인 함수 호출
            }

            if (!response.data.success) {
                console.log("웨이팅 금지 입장");
                console.log("(response.data : ",response.data.error);
                if (response.data.error === "이미 예약되었습니다.") {
                    setIsDuplicatePhoneModalOpen(true); // 중복된 전화번호 오류 모달 열기
                }
            }
        } catch (error) {
            if (error.response) {
                setError("예기치 않은 오류가 발생했습니다."); // 일반 오류 메시지
            }
        }
    };

    const handleWaitingApprove = async () => {
        setIsLoading(true); // 로딩 시작

        const intervalId = setInterval(async () => {
            try {
                const response = await axios.get(`${SERVER_URL}/reservation/check`, {
                    withCredentials: true, // 쿠키 포함
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                console.log(response);

                if (response.data.approve) {
                    clearInterval(intervalId); // 수락되면 인터벌 종료
                    setIsLoading(false); // 로딩 종료
                    setIsComplete(true); // 완료 모달 열기
                }
            } catch (error) {
                console.error("Error checking approval:", error);
                clearInterval(intervalId); // 오류 발생 시 인터벌 종료
                setIsLoading(false); // 로딩 종료
                setError("예기치 않은 오류가 발생했습니다.");
            }
        }, 3000); // 3초 간격으로 요청

        setTimeout(() => {
            clearInterval(intervalId);
            setIsLoading(false);
            setError("예매 수락 대기 시간이 초과되었습니다."); // 시간 초과 메시지 설정
        }, 100000); // 100초
    };


    const handleCompleteClose = () => {
        setIsComplete(false); // Hide CompleteModal
        navigate('/select'); // Navigate after closing
    };

    return (
        <div className="on-site-reserve-container">
            <div className="on-site-reserve-title">
                <div onClick={gotoUserHome} ><ChevronLeft /></div>
                <div className="on-site-reserve-title-text">현장 예매 신청</div>
            </div>

            <div className="reserve-form-container">
                <label>이름</label>
                <input
                    type="text"
                    placeholder="이름을 입력해 주세요."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <label>연락처</label>
                <input
                    type="text"
                    placeholder="전화번호를 입력해 주세요."
                    value={phone}
                    onChange={handlePhoneChange}
                />

                <label>예매 인원</label>
                <div className="reserve-select-container">
                    <select value={attendees}
                        onChange={(e) => setAttendees(e.target.value)}>
                        <option value="" className="reserve-select-placeholder">예매 인원을 선택해 주세요.</option>
                        {Array.from({ length: 16 }, (_, index) => (
                            <option key={index + 1} value={index + 1}>
                                {index + 1}명
                            </option>
                        ))}
                    </select>
                </div>

                <div className="reserve-select-container">
                    <label>공연 회차</label>
                    <select value={performance} onChange={(e) => setPerformance(e.target.value)}>
                        <option value="" className="reserve-select-placeholder">공연 회차를 선택해 주세요.</option>
                        {performanceSchedules.map(schedule => (
                            <option key={schedule.id} value={schedule.id}>
                                {formatDate(schedule.date_time)} [여석: <span className="available-seats-number">{schedule.available_seats}</span>] {/* 잔여 좌석 수 표시 */}
                            </option>
                        ))}
                    </select>
                </div>

                <button className="reserve-request-button" onClick={handleSubmit}
                    disabled={isButtonDisabled}>
                    예매 신청
                </button>
            </div>

            <WaitAdminModal
                isOpen={isWaitAdminModalOpen}
                onClose={() => setIsWaitAdminModalOpen(false)}
            />

            <LoadingModal
                isOpen={isLoading}
                isOnSiteReserve={true}
            />

            <CompleteModal
                isOpen={isComplete}
                onClose={handleCompleteClose}
            />

            {isDuplicatePhoneModalOpen && (
                <div className="modal-duplicate-phone-overlay" onClick={handleDuplicatePhoneOverlayClick}>
                    <div className={`modal-duplicate-phone-content ${isClosing ? 'close-animation' : ''}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none" className="error-icon">
                            <path d="M7 10.5C7.19833 10.5 7.3647 10.4328 7.4991 10.2984C7.6335 10.164 7.70046 9.99786 7.7 9.8C7.69953 9.60213 7.63233 9.436 7.4984 9.3016C7.36446 9.1672 7.19833 9.1 7 9.1C6.80166 9.1 6.63553 9.1672 6.5016 9.3016C6.36766 9.436 6.30046 9.60213 6.3 9.8C6.29953 9.99786 6.36673 10.1642 6.5016 10.2991C6.63646 10.434 6.8026 10.5009 7 10.5ZM6.3 7.7H7.7V3.5H6.3V7.7ZM7 14C6.03166 14 5.12166 13.8161 4.27 13.4484C3.41833 13.0807 2.6775 12.582 2.0475 11.9525C1.4175 11.323 0.918867 10.5821 0.551601 9.73C0.184334 8.87786 0.000467552 7.96786 8.86075e-07 7C-0.00046578 6.03213 0.183401 5.12213 0.551601 4.27C0.9198 3.41787 1.41843 2.67703 2.0475 2.0475C2.67657 1.41797 3.4174 0.919333 4.27 0.5516C5.1226 0.183867 6.0326 0 7 0C7.9674 0 8.87739 0.183867 9.72999 0.5516C10.5826 0.919333 11.3234 1.41797 11.9525 2.0475C12.5816 2.67703 13.0804 3.41787 13.4491 4.27C13.8178 5.12213 14.0014 6.03213 14 7C13.9986 7.96786 13.8147 8.87786 13.4484 9.73C13.0821 10.5821 12.5834 11.323 11.9525 11.9525C11.3216 12.582 10.5807 13.0809 9.72999 13.4491C8.87926 13.8173 7.96926 14.0009 7 14Z" fill="#FF1515" />
                        </svg>
                        <span className="duplicate-phone-error-message">이미 예매 신청이 완료된 연락처입니다.</span>
                    </div>
                </div>
            )}

        </div>
    );
}

export default OnSiteReserve;

