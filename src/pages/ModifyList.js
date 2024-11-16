import axios from 'axios';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SERVER_URL } from '../constants/ServerURL';

import '../styles/ModifyList.css';
import { ChevronLeft } from 'lucide-react';

function ModifyList() {
    const location = useLocation();
    const navigate = useNavigate();


    const { item } = location.state || {}; // 전달받은 항목 정보 
    const [name, setName] = useState(item?.name || ''); // 초기값으로 item.name 사용
    const [phone, setPhone] = useState(item?.phone_number || '');
    const [attendees, setAttendees] = useState(item?.head_count || ''); // 예매 인원
    const [performance, setPerformance] = useState(item?.scheduleId || ''); // 공연 회차
    const [error, setError] = useState(''); // 오류 메시지 상태


    const gotoDelete = () => {
        navigate('/delete', { state: { item } }); // 삭제 페이지로 이동
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

    const handleSubmit = async () => {
        try {
            const response = await axios.patch(`${SERVER_URL}/user/update`, {
                userId: item.id, // 수정할 사용자의 ID
                name,
                phoneNumber: phone, // 하이픈 제거한 전화번호
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
        <div className="modify-list-container">
            <div className="modify-list-title">
                <div className="modify-list-title-text">예매 명단 확인</div>
            </div>

            <div className="modify-form-container">
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
                        <option value="1">2024.11.16 (토) 18:00</option>
                    </select>
                </div>

                <div className="modify-button-container" >
                    <button className="cancel-modify-button" onClick={gotoDelete}>취소</button>
                    <button className="modify-button" onClick={handleSubmit}
                        disabled={isButtonDisabled}>
                        수정완료
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ModifyList;

