import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { SERVER_URL } from '../../constants/ServerURL';

import BottomNav from '../../components/BottomNav';

import '../../styles/admin/OnSiteManagement.css';
import { ChevronDown, Search } from 'lucide-react';
import Checked from '../../assets/images/privacy_checked.png'
import Unchecked from '../../assets/images/onsite_unckecked.png'
import calendarIcon from '../../assets/images/calendar_icon.png'

function OnSiteManagement() {
  const selectRef = useRef(null);

  const [filter, setFilter] = useState('전체');
  const [search, setSearch] = useState('');
  const [selectedSession, setSelectedSession] = useState('1');
  const [data, setData] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isManaging, setIsManaging] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]); // 체크 상태 배열
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

  useEffect(() => {
    fetchReservations(); // 컴포넌트가 마운트될 때 예약 리스트 가져오기
  }, [selectedSession]); // 선택된 공연 회차가 변경될 때마다 호출

  const fetchReservations = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/reservation/admin`, {
        withCredentials: true, // 세션 쿠키 포함
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          scheduleId: selectedSession, // 공연 일시 ID를 API에 전달
        },
      });
      const users = response.data.users.map(user => ({
        ...user,
        userId: user.user.id, // 실제 userId
        name: user.user.name,
        phone: user.user.phone_number,
        seats: user.user.head_count,
      }));
      setData(users); // 사용자 데이터를 상태에 저장
      // 체크 상태를 사용자 데이터에 맞게 초기화
      setCheckedItems(users.map(item => ({ userId: item.userId, checked: false })));
    } catch (error) {
      console.error("Error fetching reservations:", error);
      setError("예매 리스트를 가져오는 데 실패했습니다."); // 오류 메시지 설정
    }
  };


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
    .filter(item => {
      // 상태 필터링
      if (filter === '전체') return true; // 전체일 경우 필터링 없이 다 보여줌
      return item.approve === (filter === '수락 완료'); // '수락 완료'일 경우 true, 미 수락일 경우 false
    })
    .filter(item => {
      // 검색 필터링 (이름 또는 전화번호)
      const lowerCaseSearch = search.toLowerCase();
      return item.name?.toLowerCase().includes(lowerCaseSearch) || item.phone?.includes(lowerCaseSearch);
    })
    .sort((a, b) => {
      // 1순위: "미 수락" 항목을 최상단으로
      if (a.approve === false && b.approve !== false) return -1; // a가 미 수락이면 a를 먼저
      if (b.approve === false && a.approve !== false) return 1; // b가 미 수락이면 b를 먼저

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
  const acceptCount = data.filter(item => item.approve === true).length;
  const unacceptCount = data.filter(item => item.approve === false).length;

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
    console.log("체크한 아이디")
    console.log(id)
    setCheckedItems(prev =>
      prev.map(item =>
        item.userId === id ? { ...item, checked: !item.checked } : item
      )
    );

  };

  const handleSelectApproveClick = async () => {
    const userIds = checkedItems.filter(item => item.checked).map(item => item.userId); // userId로 변경
    if (userIds.length === 0) {
      return;
    }
    try {
      const response = await axios.patch(`${SERVER_URL}/reservation/approve`, {
        userIds,
        scheduleId: selectedSession,
      }, {
        withCredentials: true, // 세션 쿠키 포함
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.data.success) {
        fetchReservations(); // 예약 리스트 새로 고침
      }
    } catch (error) {
      console.error("Error approving reservations:", error);
      setError("예약 수락에 실패했습니다.");
    }
  };

  const handleSelectDeleteClick = async () => {
    const userIds = checkedItems.filter(item => item.checked).map(item => item.userId);
    if (userIds.length === 0) {
      return;
    }
    try {
      const response = await axios.delete(`${SERVER_URL}/reservation/delete`, {
        data: { userIds: userIds }, // 체크된 사용자 ID를 요청 본문으로 전달
        withCredentials: true, // 세션 쿠키 포함
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        fetchReservations(); // 예약 리스트 새로 고침
      }
    } catch (error) {
      console.error("Error deleting reservations:", error);
      setError("예약 삭제에 실패했습니다.");
    }
  };

  const handleIndividualApproveClick = async (userId) => {
    try {
      const response = await axios.patch(`${SERVER_URL}/reservation/approve`, {
        userIds: [userId],
        scheduleId: selectedSession,
      }, {
        withCredentials: true, // 세션 쿠키 포함
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        fetchReservations(); // 예약 리스트 새로 고침
      }

    } catch (error) {
      console.error("Error approving reservations:", error);
      setError("예약 수락에 실패했습니다.");
    }
  };

  const handleIndividualDeleteClick = async (userId) => {
    try {
      console.log("아래는 userId다");
      console.log(userId);
      const response = await axios.delete(`${SERVER_URL}/reservation/delete`, {
        data: { userIds: [userId] }, // userIds를 요청 본문으로 전달
        withCredentials: true, // 세션 쿠키 포함
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        fetchReservations(); // 예약 리스트 새로 고침
      }

    } catch (error) {
      console.log(userId);
      console.error("Error deleting reservations:", error);
      setError("예약 삭제에 실패했습니다.");
    }
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
            <li key={item.id} className={item.approve === true ? 'completed' : ''}>

              <div className="info">
                <div className="name">{item.name} <span className="text-divider">|</span><span className="phone">{item.phone}</span></div>

                {item.approve && (
                  <div className="status">
                    수락 완료
                  </div>
                )}

                {!isExpanded && !item.approve && (
                  <div className="action-buttons">
                    <button className="onsite-accept-button"
                      onClick={() => handleIndividualApproveClick(item.userId)}
                    >
                      수락
                    </button>
                    <button className="onsite-reject-button"
                      onClick={() => handleIndividualDeleteClick(item.userId)}
                    >
                      삭제
                    </button>
                  </div>
                )}

                {isExpanded && !item.approve && (
                  <img
                    className="onsite-check-button"
                    src={checkedItems.find(i => i.userId === item.userId)?.checked ? Checked : Unchecked}
                    alt="상태 이미지"
                    onClick={() => handleCheckClick(item.userId)} // 이미지 클릭 시 체크 상태 변경
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
        onApprove={handleSelectApproveClick} // 수락 함수 전달
        onDelete={handleSelectDeleteClick}   // 삭제 함수 전달
      />
    </div>
  );
}

export default OnSiteManagement;

