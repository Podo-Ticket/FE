import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import '../styles/ListManagement.css';
import BottomNav from '../components/BottomNav';
import { UserPlus, ChevronDown, Search } from 'lucide-react';
import calendarIcon from '../assets/image/calendar_icon.png'


function ListManagement() {
  const navigate = useNavigate();
  const selectRef = useRef(null);

  const data = [
    { id: 1, name: '서 준', phone: '010-5215-5830', seats: 3, status: '발권 완료', session: '2024.10.09 (수) 17:00' },
    { id: 2, name: '박준석', phone: '010-5215-5830', seats: 2, status: '발권 완료', session: '2024.10.09 (수) 17:00' },
    { id: 3, name: '김정윤', phone: '010-5215-5830', seats: 1, status: '미 발권', session: '2024.10.10 (목) 17:00' },
    { id: 4, name: '홍승리', phone: '010-5215-5830', seats: 4, status: '발권 완료', session: '2024.10.11 (금) 17:00' },
    { id: 5, name: '티모시 샬라메', phone: '010-5215-5830', seats: 13, status: '미 발권', session: '2024.10.10 (목) 17:00' },
    { id: 6, name: '봉준호', phone: '010-5215-5830', seats: 10, status: '발권 완료', session: '2024.10.09 (수) 17:00' },
    { id: 7, name: '박찬호', phone: '010-5215-5830', seats: 5, status: '발권 완료', session: '2024.10.10 (목) 17:00' }
  ];

  const [filter, setFilter] = useState('전체');
  const [search, setSearch] = useState('');
  const [selectedSession, setSelectedSession] = useState('2024.10.09 (수) 17:00');

  const handleFilterClick = (newFilter) => {
    setFilter(newFilter);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleChevronClick = () => {
    selectRef.current.focus(); // select 요소에 포커스 주기
    selectRef.current.click(); // select 요소 클릭 트리거
  };

  // 공연 회차 선택 핸들러
  const handleSessionChange = (event) => {
    setSelectedSession(event.target.value);
  };

  const gotoInsert = () => {
    navigate('/insert');
  };

  // 필터에 따라 데이터를 필터링 및 정렬
  const filteredData = data
    .filter(item => item.session === selectedSession) // 세션 필터링
    .filter(item => {
      // 상태 필터링
      if (filter === '전체') return true; // 전체일 경우 필터링 없이 다 보여줌
      return item.status === filter; // 미 발권 또는 발권 완료 필터
    })
    .filter(item => {
      // 검색 필터링 (이름 또는 전화번호)
      const lowerCaseSearch = search.toLowerCase();
      return item.name.toLowerCase().includes(lowerCaseSearch) || item.phone.includes(lowerCaseSearch);
    })
    .sort((a, b) => {
      // 1순위: 이름의 가나다 순 정렬
      const nameA = a.name.charCodeAt(0);
      const nameB = b.name.charCodeAt(0);
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;

      // 2순위: ID의 오름차순 정렬
      return a.id - b.id; // ID로 오름차순 정렬
    });

  // 전체 데이터에서 발권 완료 및 미발권 건수 계산
  const totalCount = filteredData.length;
  const issuedCount = data.filter(item => item.status === '발권 완료' && item.session === selectedSession).length;
  const notIssuedCount = data.filter(item => item.status === '미 발권' && item.session === selectedSession).length;

  const handleDeleteClick = (item) => {
    navigate('/delete', { state: { item } }); // 상태로 해당 항목 전달
  };

  // 검색 버튼 클릭 시 검색어 초기화
  const handleSearchButtonClick = () => {
    setSearch(''); // 검색어 초기화
  };

  return (
    <div className="list-management-container">
      {/* 제목 */}
      <div className="list-management-title-container">
        <div className="list-management-title">예매 명단 관리</div>
        <div className="insert-icon" onClick={gotoInsert}><UserPlus size={21} color="#3C3C3C" /></div>
      </div>

      <div className='list-management-container-top'>
        {/* 공연 회차 선택 버튼 */}
        <div className="session-picker">
          <div className="seesion-picker-left">
            <img src={calendarIcon} className="calendar-icon" />
            <select
              ref={selectRef}
              className="session-select"
              value={selectedSession}
              onChange={handleSessionChange}
            >
              <option value="2024.10.09 (수) 17:00">2024.10.09 (수) 17:00</option>
              <option value="2024.10.10 (목) 17:00">2024.10.10 (목) 17:00</option>
              <option value="2024.10.11 (금) 17:00">2024.10.11 (금) 17:00</option>
            </select>
          </div>
          <div className="session-picker-right" onClick={handleChevronClick} ><ChevronDown size={21} color="#3C3C3C" /></div>
        </div>
      </div>

      <div className="list-management-container-mid">
        {/* 검색 바 */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="이름과 연락처로 검색 가능합니다."
            value={search}
            onChange={handleSearch}
          />
          <button className="search-button" onClick={handleSearchButtonClick}>
            <Search size={21} color="#3C3C3C" />
          </button>
        </div>

        {/* 필터 버튼 */}
        <div className='filter-buttons-container'>
          <div className="filter-buttons">
            <button
              className={filter === '전체' ? 'active' : ''}
              onClick={() => handleFilterClick('전체')}
            >
              전체 {totalCount}건
            </button>
            <button
              className={filter === '미 발권' ? 'active' : ''}
              onClick={() => handleFilterClick('미 발권')}
            >
              미 발권 {notIssuedCount}건
            </button>
            <button
              className={filter === '발권 완료' ? 'active' : ''}
              onClick={() => handleFilterClick('발권 완료')}
            >
              발권 완료 {issuedCount}건
            </button>
          </div>
        </div>
      </div>

      {/* 검색 결과 */}
      <div className="search-results">
        <ul className="result-list">
          {filteredData.map(item => (
            <li key={item.id} className={item.status === '발권 완료' ? 'completed' : ''}
              onClick={() => handleDeleteClick(item)}>

              <div className="info">
                <div className="name">{item.name} <span className="text-divider">|</span><span className="phone">{item.phone}</span></div>
                <div className="status">{item.status}</div>
              </div>

              <div className="info-divider"></div>

              <div className="seat-info">
                <div className='seat-text'>예매 좌석 수</div>
                <div className="seats">{item.seats}석</div>
              </div>

            </li>
          ))}

          <div style={{ height: '60px' }}></div>

        </ul>
      </div>

      {/* 하단 네비게이션 바 */}
      <BottomNav />
    </div>
  );
}

export default ListManagement;
