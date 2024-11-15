import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../styles/OnSiteReserve.css';
import { ChevronLeft } from 'lucide-react';
import WaitAdminModal from '../components/modal/WaitAdminModal';

function OnSiteReserve() {
    const navigate = useNavigate();

    const [name, setName] = useState(''); // 이름
    const [phone, setPhone] = useState(''); // 휴대폰 번호
    const [attendees, setAttendees] = useState(''); // 예매 인원
    const [performance, setPerformance] = useState(''); // 공연 회차
    const [isWaitAdminModalOpen, setIsWaitAdminModalOpen] = useState(false);

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

    const handleSubmit = () => {
        //POST Request//
        console.log({ name, phone, attendees, performance });
        setIsWaitAdminModalOpen(true);
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
                        <option value="회차1">2024.10.09 (수) 19:00</option>
                        <option value="회차2">2024.10.10 (목) 19:00</option>
                        <option value="회차3">2024.10.11 (금) 19:00</option>
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

