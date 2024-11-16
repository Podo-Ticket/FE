import axios from 'axios';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DeleteModal from '../components/modal/DeleteModal';
import { SERVER_URL } from '../constants/ServerURL';

import '../styles/DeleteList.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import modifyIcon from '../assets/image/modify_icon.png';

function DeleteList() {
    const location = useLocation();
    const navigate = useNavigate();
    const { item } = location.state || {}; // 전달받은 항목 정보   
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [error, setError] = useState(''); // 오류 메시지 상태

    const gotoManage = () => {
        navigate('/manage');
    };

    const gotoModify = () => {
        navigate('/modify', { state: { item } });
    };

    const openDeleteModal = () => {
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`${SERVER_URL}/user/delete`, {
                params: {
                    userId: item.id // 삭제할 사용자의 ID
                },
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

    return (
        <div className="delete-list-container">
            <div className="delete-list-title">
                <div onClick={gotoManage} ><ChevronLeft /></div>
                <div className="delete-list-title-text">예매 명단 확인</div>
                <img src={modifyIcon} className="modify-icon" onClick={gotoModify} />
            </div>

            <div className="delete-form-container">
                <label>이름</label>
                <div className="delete-form-detail">{item.name}</div>

                <label>연락처</label>
                <div className="delete-form-detail">{item.phone_number}</div>

                <label>예매 인원</label>
                <div className="delete-form-detail">{item.head_count}석</div>

                <label>공연 회차</label>
                <div className="delete-form-detail">
                    {item.scheduleId === 1 ? '2024.11.16 (토) 18:00' : '다른 공연 회차'}
                </div>

                <div className="delete-button" >
                    <span onClick={openDeleteModal}>명단 삭제 <ChevronRight size={16} style={{ verticalAlign: 'middle' }} /></span>
                </div>

                <DeleteModal
                    showDeleteModal={isDeleteModalOpen}
                    closeDeleteModal={closeDeleteModal}
                    onDelete={handleDelete} // 삭제 함수 연결
                />
            </div>

        </div>
    );
}

export default DeleteList;

