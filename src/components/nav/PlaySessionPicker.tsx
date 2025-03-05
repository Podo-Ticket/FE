import React, { useRef } from "react";
import styled from "styled-components";

import calendarIcon from "../../assets/images/admin/calendar.png";
import arrowDownIcon from "../../assets/images/admin/arrow_down.png";

import { DateUtil } from '../../utils/DateUtil';

// Schedule 타입 정의
export interface Schedule {
  id: number;
  date_time: string; // 공연 날짜 및 시간
  free_seats: number; // 남은 좌석 수
}

// PlaySessionPicker Props 타입 정의
interface PlaySessionPickerProps {
  schedules: Schedule[]; // 스케줄 목록
  selectedSession: string; // 선택된 세션 ID
  onContentChange: (event: React.ChangeEvent<HTMLSelectElement>) => void; // 드롭다운 변경 핸들러
  isEllipse?: boolean; // 컨테이너 모양 (타원형 여부)
  isDisabled?: boolean; // 드롭다운 비활성화 여부
  isRounded?: boolean;
}

const PlaySessionPicker: React.FC<PlaySessionPickerProps> = ({
  schedules,
  selectedSession,
  onContentChange,
  isEllipse = false,
  isDisabled = false,
  isRounded = false
}) => {
  // Ref for the select element
  const selectRef = useRef<HTMLSelectElement>(null);

  // 아이콘을 클릭해도 선택 상자에 포커스가 가도록 처리
  const handleIconClick = () => {
    console.log("Icon clicked");

    if (selectRef.current) {
      selectRef.current.focus(); // 포커스 설정
      // ArrowDown 키 이벤트를 트리거하여 드롭다운 열기
      const event = new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true });
      selectRef.current.dispatchEvent(event);
    }
  };

  return (
    <SessionPickerContainer isEllipse={isEllipse} isRounded={isRounded}>
      <SessionPickerContent>
        <SessionPickerContentLeft>
          <IconContainer src={calendarIcon} onClick={handleIconClick} />
          <SessionSelector
            className="Podo-Ticket-Body-B5"
            ref={selectRef}
            value={selectedSession}
            onChange={onContentChange}
            disabled={isDisabled}
          >
            {schedules.map((schedule) => (
              <option key={schedule.id} value={schedule.id.toString()}>
                {DateUtil.formatDate(schedule.date_time)}
              </option>
            ))}
          </SessionSelector>
        </SessionPickerContentLeft>

        {!isDisabled && (
          <SessionPickerContentRight onClick={handleIconClick}>
            <IconContainer src={arrowDownIcon} />
          </SessionPickerContentRight>
        )}
      </SessionPickerContent>
    </SessionPickerContainer>
  );
};

export default PlaySessionPicker;

const SessionPickerContainer = styled.div<{ isEllipse?: boolean, isRounded: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;

  width: ${({ isEllipse }) => (isEllipse ? "90%" : "100%")};
  border-radius: ${({ isEllipse, isRounded }) => (isEllipse || isRounded ? "10px" : "0")};
  border: 1px solid var(--grey-3);
  background: var(--background-1);
  box-shadow: ${({ isRounded }) => (isRounded ? "0px 0px 5px 3px rgba(0, 0, 0, 0.02)" : "none")};

  user-select: none; /* 텍스트 선택 방지 */
`;

const SessionPickerContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;

  width: 100%;
  padding: 0px 20px;

  color: var(--grey-7);
`;

const SessionPickerContentLeft = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
`;

const IconContainer = styled.img`
  width: 15px;
`;

const SessionSelector = styled.select`
  appearance: none;
  
  width: 100%;
  border: none;
  background: transparent;

  padding: 8px;

  color: var(--grey-7);

  -webkit-appearance: none; /* Safari 기본 스타일 제거 */
  -moz-appearance: none; /* Firefox 기본 스타일 제거 */

  &:focus {
    outline: none; /* 포커스 상태에서 아웃라인 제거 */
    box-shadow: none; /* 브라우저 기본 포커스 그림자 제거 */
    border: none; /* 포커스 시 추가 테두리 제거 */
  }
`;

const SessionPickerContentRight = styled.div``;