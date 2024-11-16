import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SERVER_URL } from '../constants/ServerURL';

import '../styles/InsertList.css';
import { ChevronLeft } from 'lucide-react';

function InsertList() {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [attendees, setAttendees] = useState(''); // 예매 인원
    const [performance, setPerformance] = useState(''); // 공연 회차
    const [performanceSchedules, setPerformanceSchedules] = useState([]); // 공연 회차 정보
    const [error, setError] = useState(''); // 오류 메시지 상태
    const navigate = useNavigate();

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
    

    const gotoManage = () => {
        navigate('/manage');
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

    // 공연 회차 정보 가져오기
    const fetchPerformanceSchedules = async () => {
        try {
            const response = await axios.get(`${SERVER_URL}/user/schedule`, {
                withCredentials: true, // 쿠키 포함
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // 응답에서 공연 회차 정보를 가져와 상태 업데이트
            if (response.data.schedules) {
                setPerformanceSchedules(response.data.schedules);
            } else {
                console.error("Unexpected response format:", response.data);
                setError("공연 회차 정보를 가져오는 데 실패했습니다.");
            }
        } catch (error) {
            console.error("Error fetching performance schedules:", error);
            setError("공연 회차 정보를 가져오는 데 실패했습니다."); // 오류 메시지 설정
        }
    };

    useEffect(() => {
        fetchPerformanceSchedules(); // 컴포넌트 마운트 시 공연 회차 정보 가져오기
    }, []);


    const handleSubmit = async () => {
        try {
            const response = await axios.post(`${SERVER_URL}/user/admin`, {
                name,
                phoneNumber: phone,
                headCount: attendees,
                scheduleId: performance // 공연 회차 ID
            }, {
                withCredentials: true, // 세션 쿠키 포함
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.data.success) {
                navigate('/manage'); // 성공 시 관리 페이지로 이동
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
        <div className="insert-list-container">
            <div className="insert-list-title">
                <div onClick={gotoManage} ><ChevronLeft /></div>
                <div className="insert-list-title-text">예매 명단 추가</div>
            </div>

            <div className="insert-form-container">
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
                <div className="select-container">
                    <select value={attendees}
                        onChange={(e) => setAttendees(e.target.value)}>
                        <option value="" className="select-placeholder">예매 인원을 선택해 주세요.</option>
                        {Array.from({ length: 16 }, (_, index) => (
                            <option key={index + 1} value={index + 1}>
                                {index + 1}명
                            </option>
                        ))}
                    </select>
                </div>

                <div className="select-container">
                    <label>공연 회차</label>
                    <select value={performance} onChange={(e) => setPerformance(e.target.value)}>
                        <option value="" className="select-placeholder">공연 회차를 선택해 주세요.</option>
                        {performanceSchedules.map(schedule => (
                            <option key={schedule.id} value={schedule.id}>
                                {formatDate(schedule.date_time)} [여석: {schedule.available_seats}] {/* 잔여 좌석 수 표시 */}
                            </option>
                        ))}
                    </select>
                </div>

                <button className="insert-button" onClick={handleSubmit}
                    disabled={isButtonDisabled}>
                    추가하기
                </button>
            </div>
        </div>
    );
}

export default InsertList;

