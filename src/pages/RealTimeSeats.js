import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SERVER_URL } from '../constants/ServerURL'

import LockApproveModal from '../components/modal/LockApproveModal'
import UnlockApproveModal from '../components/modal/UnlockApproveModal'

import '../styles/BottomNav.css';
import '../styles/RealTimeSeats.css';
import BottomNav from '../components/BottomNav';
import SeatMap from '../components/SeatMap';
import calendarIcon from '../assets/image/calendar_icon.png'
import personIcon from '../assets/image/person_info_icon.png';
import phoneIcon from '../assets/image/phone_info_icon.png';
import seatIcon from '../assets/image/seat_info_icon.png';
import { ChevronDown, RotateCw } from 'lucide-react';

function RealTimeSeats() {
  const navigate = useNavigate();
  const selectRef = useRef(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [newLockedSeats, setNewLockedSeats] = useState([]);
  const [newUnlockedSeats, setNewUnlockedSeats] = useState([]);
  const [isAlreadySelectedModalOpen, setIsAlreadySelectedModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [selectedSession, setSelectedSession] = useState('1');
  const [availableSeats, setAvailableSeats] = useState(0); // 여석 수
  const [error, setError] = useState(''); // 오류 메시지
  const [bookingInfo, setBookingInfo] = useState(null); // 예매 정보 저장
  const [showInfo, setShowInfo] = useState(false); // 애니메이션을 위한 상태 추가
  const [isEditing, setIsEditing] = useState(false); // 편집 모드 상태 추가
  const [schedules, setSchedules] = useState([]); // 공연 회차 상태 추가
  const [currentLockedSeatsInfo, setCurrentLockedSeatsInfo] = useState([]);
  const [LockApproveModalOpen, setLockApproveModalOpen] = useState(false);
  const [UnlockApproveModalOpen, setUnlockApproveModalOpen] = useState(false);

  const [isLockAvailable, setIsLockAvailable] = useState(false);
  const [isUnlockAvailable, setIsUnlockAvailable] = useState(false);

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

  // 페이지 새로고침
  const handleRefresh = () => {
    window.location.reload(); // 페이지 새로 고침
  };

  // 공연 회차 선택 핸들러
  const handleSessionChange = (event) => {
    setSelectedSession(event.target.value);
  };

  // 아랫 화살표 누르면 공연 회차 선택되는 함수
  const handleChevronClick = () => {
    selectRef.current.focus(); // select 요소에 포커스 주기
    selectRef.current.click(); // select 요소 클릭 트리거
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

  // 공연 회차 정보 가져오기
  useEffect(() => {
    fetchSchedules();
  }, []);

  // 좌석 정보 가져오기
  const fetchSeats = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/seat/realTime`, {
        withCredentials: true, // 세션 쿠키 포함
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          scheduleId: selectedSession, // 선택된 공연 일시 ID
        },
      });
      setAvailableSeats(response.data.availableSeats); // 여석 수 설정
      setError(''); // 오류 초기화
    } catch (error) {
      console.error("Error fetching seats:", error);
      if (error.response && error.response.data.error) {
        setError(error.response.data.error); // 오류 메시지 설정
      } else {
        setError("좌석 정보를 가져오는 데 실패했습니다."); // 일반 오류 메시지
      }
    }
  };

  // 컴포넌트가 마운트될 때 좌석 정보 가져오기
  useEffect(() => {
    const fetchData = async () => {
      fetchSeats(); // fetchSeats를 호출하고 기다림
    };

    fetchData(); // 비동기 함수 호출
  }, []); // 초기 로드 시 한 번만 호출

  // 좌석 클릭 핸들러
  const handleSeatClick = async (seatId) => {
    if (isEditing) {

      console.log("seatId : ", seatId);

      // 편집 모드일 때 선택된 좌석을 LockedSeats에 추가
      setNewLockedSeats((prev) => {
        if (prev.includes(seatId)) {
          return prev.filter(id => id !== seatId); // 이미 잠금된 좌석이라면 제거
        }
        return [...prev, seatId]; // 새로 잠금 추가
      });
      console.log("lockedSeats : ", newLockedSeats);
      console.log("current Seat : ", seatId);
    }
    else {
      // 편집 모드가 아닐 경우 기존 예매 정보 가져오는 로직
      try {
        const response = await axios.get(`${SERVER_URL}/seat/audience`, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
          params: {
            scheduleId: selectedSession,
            seatId: seatId,
          },
        });

        const userInfo = response.data.user;
        const userSeats = response.data.seats;

        setBookingInfo({
          name: userInfo.name,
          phone: userInfo.phone_number,
          headCount: userInfo.head_count,
          seats: userSeats
        });

      } catch (error) {
        console.error("Error fetching booking info:", error);
        setBookingInfo(null);
      }
    }
  };

  // 클릭 이벤트 핸들러
  const handleClickOutside = (event) => {
    if (bookingInfo && !event.target.closest('.seats-button-info-container')) {
      setBookingInfo(null); // 예약 정보 초기화
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [bookingInfo]);

  const handleEditClick = () => {
    if (isEditing) {
      // 편집 모드에서 취소할 때 newLockedSeats 초기화
      setNewLockedSeats([]); // newLockedSeats 초기화
      setNewUnlockedSeats([]); // newLockedSeats 초기화
      setIsLockAvailable(false);
      setIsUnlockAvailable(false);
    }

    setIsEditing(!isEditing); // 편집 모드 토글
  };

  // 좌석 잠금 함수
  const handleLockSeats = async () => {
    if (newLockedSeats.length === 0) {
      return;
    }

    console.log("newLockedSeats(api) : ", newLockedSeats);

    const lockedSeats = newLockedSeats.map(seat => {
      const row = seat.slice(0, 2); // 좌석 ID의 첫 두 문자를 행으로 설정
      const column = parseInt(seat.slice(2)); // 나머지 부분을 숫자로 변환하여 column으로 설정

      return { "row": row, "number": column }; // 객체 형식으로 변환
    });

    const encodedSeats = encodeURIComponent(JSON.stringify(lockedSeats));

    try {
      const response = await axios.post(`${SERVER_URL}/seat/lock`, {
        scheduleId: selectedSession,
        seats: encodedSeats, // 좌석 인코딩
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        // 잠금된 좌석을 lockedSeats에 추가
        setNewLockedSeats((prev) => [...prev, ...selectedSeats]);
        setSelectedSeats([]); // 선택된 좌석 초기화
        window.location.reload(); // 페이지 새로 고침
      }
    } catch (error) {
      console.error("좌석 잠금 오류:", error);
      if (error.response && error.response.data.error) {
      } else {
      }
    }
  };

  // 좌석 잠금 해제 함수
  const handleUnlockSeats = async () => {
    if (newUnlockedSeats.length === 0) {
      return;
    }

    // currentLockedSeatsInfo에서 row와 number를 합쳐서 새로운 배열을 생성
    const createLockedSeatIdentifiers = () => {
      return currentLockedSeatsInfo.map(seatInfo => ({
        id: seatInfo.id, // ID를 저장
        identifier: `${seatInfo.row}${seatInfo.number}` // row와 number를 합친 값
      }));
    };

    // unlockedSeats와 비교하여 잠금 해제된 좌석 찾기
    const findUnlockedSeats = () => {
      const lockedSeatIdentifiers = createLockedSeatIdentifiers();

      // newUnlockedSeats와 비교하여 ID를 추출
      const matchedUnlockedSeats = lockedSeatIdentifiers.filter(lockedSeat =>
        newUnlockedSeats.includes(lockedSeat.identifier)
      ).map(lockedSeat => lockedSeat.id); // ID만 추출

      console.log("잠금 해제된 좌석 ID:", matchedUnlockedSeats);
      return matchedUnlockedSeats;
    };

    // 호출 예시
    const matchedSeats = findUnlockedSeats();

    console.log("matchedSeats:", matchedSeats);



    try {
      const response = await axios.delete(`${SERVER_URL}/seat/unlock`, {
        data: {
          scheduleId: selectedSession,
          seatIds: matchedSeats, // 잠금 해제할 좌석 ID
        },
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        // 잠금 해제된 좌석을 lockedSeats에서 제거
        setNewLockedSeats((prev) => prev.filter(seat => !newLockedSeats.includes(seat)));
        window.location.reload(); // 페이지 새로 고침
      }
    } catch (error) {
      console.error("좌석 잠금 해제 오류:", error);
      if (error.response && error.response.data.error) {
      } else {
      }
    }
  };

  // 페이지 새로고침
  const openLockApproveModal = () => {
    setLockApproveModalOpen(true); // 페이지 새로 고침
  };

  // 페이지 새로고침
  const openUnlockApproveModal = () => {
    setUnlockApproveModalOpen(true); // 페이지 새로 고침
  };

  // 페이지 새로고침
  const closeLockApproveModal = () => {
    setLockApproveModalOpen(false); // 페이지 새로 고침
  };

  // 페이지 새로고침
  const closeUnlockApproveModal = () => {
    setUnlockApproveModalOpen(false); // 페이지 새로 고침
  };

  return (
    <div className="admin-real-time-seats-container">

      <div className="seat-header">
        <button className="refresh-button" onClick={handleRefresh}>
          <RotateCw size={18} color="#3C3C3C" />
        </button>
        <p className="seat-header-text">{isEditing ? '실시간 좌석 편집' : '실시간 좌석 현황'}</p>
        <button className="seat-header-edit" onClick={handleEditClick} >{isEditing ? '취소' : '편집'}</button>
      </div>

      <div className='seats-time-select-container'>
        {/* 공연 회차 선택 버튼 */}
        <div className="session-picker">
          <div className="seesion-picker-left">
            <img src={calendarIcon} className="calendar-icon" />
            <select
              ref={selectRef}
              className="session-select"
              value={selectedSession}
              onChange={handleSessionChange}
              disabled={isEditing}
            >
              {schedules.map(schedule => (
                <option key={schedule.id} value={schedule.id}>
                  {formatDate(schedule.date_time)}
                </option>
              ))}
            </select>
          </div>

          {!isEditing &&
            <div className="session-picker-right" onClick={handleChevronClick} ><ChevronDown size={21} color="#3C3C3C" />
            </div>
          }

        </div>
      </div>

      {bookingInfo && (
        <div className={`seats-button-info-container ${showInfo ? 'show' : ''}`}>
          <div className='seats-button-info-item'>
            <img src={personIcon} className='seats-button-info-icon' />
            <p>예매자</p>
            <span>{bookingInfo.name}</span>
          </div>

          <div className="seats-button-info-divider"></div>

          <div className='seats-button-info-item'>
            <img src={phoneIcon} className='seats-button-info-icon' />
            <p>연락처</p>
            <span>{bookingInfo.phone}</span>
          </div>

          <div className="seats-button-info-divider"></div>

          <div className='seats-button-info-item'>
            <img src={seatIcon} className='seats-button-info-icon' />
            <p>좌석 수</p>
            <span>{bookingInfo.headCount}석</span>
          </div>
        </div>
      )}

      <SeatMap
        selectedSeats={selectedSeats}
        setSelectedSeats={setSelectedSeats}
        newLockedSeats={newLockedSeats}
        newUnlockedSeats={newUnlockedSeats}
        setNewUnlockedSeats={setNewUnlockedSeats}
        setNewLockedSeats={setNewLockedSeats}
        setCurrentLockedSeatsInfo={setCurrentLockedSeatsInfo}
        setIsAlreadySelectedModalOpen={setIsAlreadySelectedModalOpen}
        scheduleId={selectedSession}
        selectedSession={0}
        isRealTime={true}
        onSeatClick={handleSeatClick} // 좌석 클릭 핸들러 전달
        bookingInfo={bookingInfo}
        onSeatEdit={isEditing}
        setIsLockAvailable={setIsLockAvailable}
        setIsUnlockAvailable={setIsUnlockAvailable}
      />

      <div className="admin-seat-legend">
        <span className="admin-legend">
          <span className="admin-available-icon"></span>
          발권 가능
        </span>
        <span className="admin-legend">
          <span className="admin-booked-icon"></span>
          발권 완료
        </span>

        <div className="admin-legend-rest-seat">
          여석 {availableSeats}석
        </div>
      </div>

      <LockApproveModal
        isOpen={LockApproveModalOpen}
        onClose={closeLockApproveModal}
        onConfirm={handleLockSeats}
      />

      <UnlockApproveModal
        isOpen={UnlockApproveModalOpen}
        onClose={closeUnlockApproveModal}
        onConfirm={handleUnlockSeats}
      />

      <BottomNav
        showActions={false} // 편집 모드에 따라 showActions 전달
        onSeatEdit={isEditing}
        onLockSeats={openLockApproveModal} // 잠금 핸들러 전달
        onUnlockSeats={openUnlockApproveModal} // 잠금 해제 핸들러 전달
        isLockAvailable={isLockAvailable}
        isUnlockAvailable={isUnlockAvailable}
      /> {/* 항상 하단에 고정된 네비게이션 바 */}

    </div>

  );
}

export default RealTimeSeats;