import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DeleteModal from '../components/modal/DeleteModal';

import '../styles/DeleteList.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import modifyIcon from '../assets/image/modify_icon.png';

function DeleteList() {
    const location = useLocation();
    const navigate = useNavigate();
    const { item } = location.state || {}; // 전달받은 항목 정보   
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

    const handleDelete = () => {
        // 여기에 삭제 로직을 추가합니다. (예: API 호출)
        console.log(`삭제할 항목: ${item.name}`);
        // 여기서 실제 삭제 요청을 처리할 수 있습니다.

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
                <div className="delete-form-detail">{item.phone}</div>

                <label>예매 인원</label>
                <div className="delete-form-detail">{item.seats}석</div>

                <label>공연 회차</label>
                <div className="delete-form-detail">{item.session}</div>

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

