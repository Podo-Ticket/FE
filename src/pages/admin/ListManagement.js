import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SERVER_URL } from '../../constants/ServerURL';

import '../../styles/admin/ListManagement.css';
import BottomNav from '../../components/BottomNav';
import { UserPlus, ChevronDown, Search } from 'lucide-react';
import calendarIcon from '../../assets/images/calendar_icon.png'


function ListManagement() {
  const navigate = useNavigate();
  const selectRef = useRef(null);
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('전체');
  const [search, setSearch] = useState('');
  const [selectedSession, setSelectedSession] = useState(1);
  const [schedules, setSchedules] = useState([]); // 공연 회차 상태 추가
  const [error, setError] = useState(''); // 오류 메시지

  // 날짜 지정된 형식으로 변환
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

  // 공연 회차 정보 가져오기
  const fetchSchedules = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/user/schedule`, {
        withCredentials: true, // 세션 쿠키 포함
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setSchedules(response.data.schedules); // 공연 회차 상태 업데이트
      if (response.data.schedules.length > 0) {
        setSelectedSession(response.data.schedules[0].id.toString()); // 첫 번째 회차 선택
      }
    } catch (error) {
      console.error("Error fetching schedules:", error);
      setError("공연 회차 정보를 가져오는 데 실패했습니다."); // 오류 메시지
    }
  };

  useEffect(() => {
    fetchSchedules(); // 공연 회차 정보 가져오기
  }, []);

  const fetchUserList = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/user/list`, {
        withCredentials: true, // 세션 쿠키 포함
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          scheduleId: selectedSession, // 공연일시 ID (여기서는 session을 사용)
        },
      });
      setData(response.data.users); // API 응답에서 사용자 데이터 설정
      console.log("Fetched Data:", response.data.users); // API 호출 후 데이터 출력
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
  };

  useEffect(() => {
    fetchUserList(); // 컴포넌트가 마운트될 때 사용자 목록 가져오기
  }, [selectedSession]); // selectedSession이 변경될 때마다 호출

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
    .filter(item => {
      // 상태 필터링
      if (filter === '전체') return true; // 전체일 경우 필터링 없이 다 보여줌
      return item.state === (filter === '발권 완료'); // 미 발권 또는 발권 완료 필터
    })
    .filter(item => {
      // 검색 필터링 (이름 또는 전화번호)
      const lowerCaseSearch = search.toLowerCase();
      return item.name?.toLowerCase().includes(lowerCaseSearch) || item.phone?.includes(lowerCaseSearch);
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
  const totalCount = data.length;
  const issuedCount = data.filter(item => item.state === true).length;
  const notIssuedCount = data.filter(item => item.state === false).length;

  const handleDeleteClick = (item) => {
    item.scheduleId = selectedSession;
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
              {schedules.map(schedule => (
                <option key={schedule.id} value={schedule.id}>
                  {formatDate(schedule.date_time)}
                </option>
              ))}
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
            <li key={item.id} className={item.state === true ? 'completed' : ''}
              onClick={() => handleDeleteClick(item)}>

              <div className="info">
                <div className="name">{item.name} <span className="text-divider">|</span><span className="phone">{item.phone_number}</span></div>
                <div className="status">{item.state ? '발권 완료' : '미 발권'}</div>
              </div>

              <div className="info-divider"></div>

              <div className="seat-info">
                <div className='seat-text'>예매 좌석 수</div>
                <div className="seats">{item.head_count}석</div>
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
