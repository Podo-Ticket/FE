import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SERVER_URL } from '../constants/ServerURL';

import '../styles/OnSiteReserve.css';
import { ChevronLeft } from 'lucide-react';
import WaitAdminModal from '../components/modal/WaitAdminModal';

function OnSiteReserve() {
    const navigate = useNavigate();

    const [name, setName] = useState(''); // 이름
    const [phone, setPhone] = useState(''); // 휴대폰 번호
    const [attendees, setAttendees] = useState(''); // 예매 인원
    const [performance, setPerformance] = useState(''); // 공연 회차
    const [performanceSchedules, setPerformanceSchedules] = useState([]);
    const [isWaitAdminModalOpen, setIsWaitAdminModalOpen] = useState(false);
    const [error, setError] = useState(''); // 오류 메시지 상태

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
                params: { playId: 1 }, // 공연 ID를 적절히 설정
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setPerformanceSchedules(response.data.schedules); // 공연 회차 목록 설정
        } catch (error) {
            console.error('Error fetching performance schedules:', error);
        }
    };

    useEffect(() => {
        fetchPerformanceSchedules(); // 컴포넌트가 마운트될 때 공연 회차 정보 가져오기
    }, []);

    const handleSubmit = async () => {
        try {
            const response = await axios.post(`${SERVER_URL}/reservation`, {
                name,
                phoneNumber: phone,
                headCount: attendees,
                scheduleId: performance // 공연 회차 ID
            });

            if (response.data.success) {
                setIsWaitAdminModalOpen(true); // 예약 성공 시 대기 모달 열기
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data.error); // 오류 메시지 설정
            } else {
                setError("예기치 않은 오류가 발생했습니다."); // 일반 오류 메시지
            }
        }
    };

    // 버튼 활성화 조건
    const isButtonDisabled = !name || !phone || !attendees || !performance;

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
                                {formatDate(schedule.date_time)} [여석: {schedule.available_seats}] {/* 잔여 좌석 수 표시 */}
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
        </div>
    );
}

export default OnSiteReserve;

