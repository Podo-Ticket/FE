import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/OnSiteManagement.css';
import BottomNav from '../components/BottomNav';
import { CalendarClock, ChevronDown, Search } from 'lucide-react';
import Checked from '../assets/image/privacy_checked.png'
import Unchecked from '../assets/image/onsite_unckecked.png'
import calendarIcon from '../assets/image/calendar_icon.png'

function OnSiteManagement() {
  const selectRef = useRef(null);

  const data = [
    { id: 1, name: '나루토', phone: '010-1234-1234', seats: 3, status: '수락 완료', session: '2024.10.09 (수) 17:00' },
    { id: 2, name: '사스케', phone: '010-1234-5678', seats: 2, status: '수락 완료', session: '2024.10.09 (수) 17:00' },
    { id: 3, name: '사쿠라', phone: '010-1212-1212', seats: 1, status: '미 수락', session: '2024.10.10 (목) 17:00' },
    { id: 4, name: '루피', phone: '010-1212-3434', seats: 4, status: '수락 완료', session: '2024.10.11 (금) 17:00' },
    { id: 5, name: '조로', phone: '010-3434-3434', seats: 13, status: '미 수락', session: '2024.10.10 (목) 17:00' },
    { id: 6, name: '우솝', phone: '010-3434-5656', seats: 10, status: '수락 완료', session: '2024.10.09 (수) 17:00' },
    { id: 7, name: '상디', phone: '010-5656-5656', seats: 5, status: '수락 완료', session: '2024.10.10 (목) 17:00' }
  ];

  const [filter, setFilter] = useState('전체');
  const [search, setSearch] = useState('');
  const [selectedSession, setSelectedSession] = useState('2024.10.09 (수) 17:00');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isManaging, setIsManaging] = useState(false);
  const [checkedItems, setCheckedItems] = useState(data.map(item => ({ id: item.id, checked: false }))); // 체크 상태 배열

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

  const toggleExpand = () => {
    setIsExpanded(!isExpanded); // 이미지를 클릭할 때마다 상태 변경
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
      // 1순위: "미 수락" 항목을 최상단으로
      if (a.status === '미 수락' && b.status !== '미 수락') return -1; // a가 미 수락이면 a를 먼저
      if (b.status === '미 수락' && a.status !== '미 수락') return 1; // b가 미 수락이면 b를 먼저

      // 2순위: 이름의 가나다 순 정렬
      const nameA = a.name.charCodeAt(0);
      const nameB = b.name.charCodeAt(0);
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;

      // 3순위: ID의 오름차순 정렬
      return a.id - b.id; // ID로 오름차순 정렬
    });

  // 전체 데이터에서 발권 완료 및 미발권 건수 계산
  const totalCount = filteredData.length;
  const acceptCount = data.filter(item => item.status === '수락 완료' && item.session === selectedSession).length;
  const unacceptCount = data.filter(item => item.status === '미 수락' && item.session === selectedSession).length;

  // 검색 버튼 클릭 시 검색어 초기화
  const handleSearchButtonClick = () => {
    setSearch(''); // 검색어 초기화
  };

  const handleManageClick = () => {
    setIsManaging(!isManaging); // 상태 토글
    toggleExpand();
  };

  // 체크 상태 토글 핸들러
  const handleCheckClick = (id) => {
    setCheckedItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  return (
    <div className="onsite-management-container">
      {/* 제목 */}
      <div className="onsite-management-title-container">
        <div className="onsite-management-title">현장 예매 관리</div>
        <div className="checking-button" onClick={handleManageClick}>{isManaging ? '취소' : '전체 관리'} {/* 버튼 텍스트 변경 */}
        </div>
      </div>

      <div className='onsite-management-container-top'>
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

      <div className="onsite-management-container-mid">
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
          <div className="onsite-filter-buttons">
            <button
              className={filter === '전체' ? 'active' : ''}
              onClick={() => handleFilterClick('전체')}
            >
              전체 {totalCount}건
            </button>
            <button
              className={filter === '미 수락' ? 'active' : ''}
              onClick={() => handleFilterClick('미 수락')}
            >
              미 수락 {unacceptCount}건
            </button>
            <button
              className={filter === '수락 완료' ? 'active' : ''}
              onClick={() => handleFilterClick('수락 완료')}
            >
              수락 {acceptCount}건
            </button>
          </div>
        </div>
      </div>

      {/* 검색 결과 */}
      <div className="search-results">
        <ul className="result-list">
          {filteredData.map(item => (
            <li key={item.id} className={item.status === '수락 완료' ? 'completed' : ''}>

              <div className="info">
                <div className="name">{item.name} <span className="text-divider">|</span><span className="phone">{item.phone}</span></div>

                {item.status === '수락 완료' && (<div className="status">
                  {item.status}
                </div>
                )}

                {!isExpanded && item.status === '미 수락' && (
                  <div className="action-buttons">
                    <button className="onsite-accept-button">수락</button>
                    <button className="onsite-reject-button">삭제</button>
                  </div>
                )}

                {isExpanded && item.status === '미 수락' && (
                  <img
                    className="onsite-check-button"
                    src={checkedItems.find(i => i.id === item.id)?.checked ? Checked : Unchecked}
                    alt="상태 이미지"
                    onClick={() => handleCheckClick(item.id)} // 이미지 클릭 시 체크 상태 변경
                  />
                )}

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
      <BottomNav
        showActions={isManaging}
      />
    </div>
  );
}

export default OnSiteManagement;

