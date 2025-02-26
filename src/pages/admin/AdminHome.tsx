import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';

import FooterNav from '../../components/nav/FooterNav.tsx'

const AdminHome = () => {
    const navigate = useNavigate();

    // 홈 화면 진입 시에 
    useEffect(() => {
        localStorage.setItem("currentScheduleId", '5'); // 홈 화면에서 로컬스토리지에 스케쥴 아이디 저장
    }, []);

    return (
        <ViewContainer>

            <button onClick={() => { navigate('realtime') }}>실시간 좌석 현황으로 이동</button>
            <button onClick={() => { navigate('lock') }}>좌석 잠금으로 이동</button>
            <button onClick={() => { navigate('lock') }}>좌석 잠금 해제로 이동</button>

            <FooterNav />
        </ViewContainer >
    );
};

export default AdminHome;

const ViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;