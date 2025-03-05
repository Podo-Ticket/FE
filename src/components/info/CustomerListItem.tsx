import React from 'react'
import styled from 'styled-components'

interface User {
  id: number; // 사용자 ID
  name: string; // 사용자 이름
  phone_number: string; // 연락처
  head_count: number; // 좌석 수
  state: boolean; // 발권 상태 (true: 발권 완료, false: 미발권)
}

interface OnsiteApprovalRequest {
  userIds: number[];
  scheduleId: number;
  check: boolean;
}

interface CustomerListItemProps {
  data: any[];
  scheduleId: number;
  onBtnClick?: (item: User) => void;
  isOnsite: boolean;
  /* 아래는 Onsite reserve일 경우 사용 */
  canControll?: boolean;
  isExpanded?: boolean;
  checkedItems?: number[];
  onApprovalRequest?: (request: OnsiteApprovalRequest) => void;
  onCheckClick?: (userId: number) => void;
}

import Checked from "../../assets/images/privacy_checked.png"; // 체크된 이미지 경로
import Unchecked from "../../assets/images/onsite_unckecked.png"; // 체크 해제된 이미지 경로

const CustomerListItem: React.FC<CustomerListItemProps> = ({
  data,
  scheduleId,
  onBtnClick,
  isOnsite,
  canControll,
  isExpanded = false,
  checkedItems = [],
  onApprovalRequest = undefined,
  onCheckClick = undefined,
}) => {

  const handleApproveClick = async (userId: number) => {
    try {
      // 요청 데이터 생성
      const request: OnsiteApprovalRequest = {
        userIds: [userId], // 단일 사용자 ID를 배열로 전달
        scheduleId: scheduleId, // 예시로 사용되는 공연 일정 ID
        check: true, // 승인 여부
      };

      onApprovalRequest?.(request);

    } catch (error: any) {
      console.error("Error while sending approval request:", error);
      alert(error.message || "승인 요청 중 오류가 발생했습니다.");
    }
  };

  const handleRejectClick = async (userId: number) => {
    try {
      // 요청 데이터 생성
      const request: OnsiteApprovalRequest = {
        userIds: [userId], // 단일 사용자 ID를 배열로 전달
        scheduleId: scheduleId, // 예시로 사용되는 공연 일정 ID
        check: false, // 승인 여부
      };

      onApprovalRequest?.(request);

    } catch (error: any) {
      console.error("Error while sending approval request:", error);
      alert(error.message || "승인 요청 중 오류가 발생했습니다.");
    }
  };

  return (
    <ResultContent>
      {data.map((item) => {
        // isOnsite에 따라 데이터 구조 처리
        const user = isOnsite ? item.user : item; // UserWithApproval의 user 또는 User
        const approve = isOnsite ? item.approve : item.state; // 승인 여부 또는 발권 상태

        return (
          <ResultContentItems
            key={user.id}
            completed={approve}
            onClick={onBtnClick ? () => onBtnClick(item) : undefined}
          >
            <PersonInfo>
              <NameContainer className="Podo-Ticket-Headline-H5">
                {user.name}
                <TextDivider>|</TextDivider>
                <Phone className="Podo-Ticket-Body-B11">
                  {user.phone_number}
                </Phone>
              </NameContainer>

              {!canControll && (
                <Status completed={approve} className="Podo-Ticket-Body-B12">
                  {approve ? "발권 완료" : "미 발권"}
                </Status>
              )}

              {canControll && approve && (
                <Status completed={approve} className="Podo-Ticket-Body-B12">수락 완료</Status>
              )}

              {canControll && !isExpanded && !approve && (
                <ActionButtons>
                  <ApproveButton className="Podo-Ticket-Body-B9" onClick={() => handleApproveClick?.(user.id)}>
                    수락
                  </ApproveButton>
                  <DeleteButton className="Podo-Ticket-Body-B9" onClick={() => handleRejectClick?.(user.id)}>
                    삭제
                  </DeleteButton>
                </ActionButtons>
              )}

              {canControll && isExpanded && !approve && (
                <CheckButton
                  src={checkedItems.includes(user.id) ? Checked : Unchecked}
                  alt="상태 이미지"
                  onClick={() => { onCheckClick?.(user.id); console.log("passed user.id: ", user.id) }}
                />
              )}
            </PersonInfo>

            <Divider completed={approve} />

            <SeatInfo completed={approve}>
              <SeatText className="Podo-Ticket-Body-B11">예매 좌석 수</SeatText>
              <Seats className="Podo-Ticket-Body-B9">{user.head_count}석</Seats>
            </SeatInfo>
          </ResultContentItems>
        );
      })}

      <div style={{ height: "100px" }}></div>
    </ResultContent>
  );
};

export default CustomerListItem

const ResultContent = styled.ul`
  display: flex;
  flex-direction: column;
  list-style-type: none; /* 기본 목록 스타일 제거 */

  gap: 10px;
  padding: 10px;
  margin: 0;
`;

interface ResultContentItemsProps {
  completed?: boolean;
}

const ResultContentItems = styled.li<ResultContentItemsProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;

  width: 100%;
  border: 0.5px solid ${({ completed }) => completed ? "var(--grey-4)" : "var(--purple-7)"};
  border-radius: 10px;
  background-color: var(--ect-white);
`;

const PersonInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  width: 99%;

  padding: 10px 20px;
`;

const NameContainer = styled.div`
  color: var(--grey-7);
`;

const TextDivider = styled.span`
  margin: 0 9px;

  color: var(--grey-4);
  font-size: 18px;
`;

const Phone = styled.span`
  color: var(--grey-7);
`;

interface StatusProps {
  completed?: boolean;
}

const Status = styled.div<StatusProps>`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 46px;
  height: 18px;
  padding: 10px 3px;

  color: var(--ect-white);
  text-align: center;

  border-radius: 30px;
  background: ${({ completed }) =>
    completed ? "var(--grey-5)" : "var(--purple-4)"};;
`;

const ActionButtons = styled.div`
  display: flex;

  gap: 5px;

`;

const ApproveButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 50px;
  height: 24px;
  padding: 10px;

  border: none;
  border-radius: 30px;

  background-color: var(--purple-4);
  color: var(--ect-white);

  cursor: pointer;

  &:hover {
    background-color: var(--purple-4);
    transition: background-color 0.2s ease-in-out;
  }
`;

const DeleteButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 50px;
  height: 24px;
  padding: 10px;

  border: none; /* 기본 테두리 제거 */
  border-radius: 30px; /* 버튼 테두리 둥글게 */

  background-color: var(--grey-3); /* 삭제 버튼 색상 */
  color: var(--grey-6); /* 텍스트 색상 */

  cursor: pointer;

  &:hover {
    background-color: var(--grey-4); /* 호버 시 더 어두운 색상 */
    color: var(--ect-white); /* 호버 시 텍스트 색상 변경 */
    transition: background-color, color, ease-in-out, .2s
`;

const CheckButton = styled.img`
  width: 20px; /* 체크 버튼 이미지 크기 */
  height: 20px; /* 체크 버튼 이미지 크기 */
  margin-top: 5px; /* 마진 추가 */
  cursor: pointer;

  &:hover {
    transform: scale(1.1); /* 호버 시 크기 확대 효과 */
    transition: transform 0.2s ease-in-out;
  }
`;

interface DividerProps {
  completed?: boolean;
}

const Divider = styled.div<DividerProps>`
  width: 100%;
  border-bottom: 0.5px solid
    ${({ completed }) =>
    completed ? "var(--grey-4)" : "var(--purple-7)"};
`;

interface SeatInfoProps {
  completed?: boolean;
}

const SeatInfo = styled.div<SeatInfoProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  height: 100%;
  padding: 6px 20px;

  border-radius: 0px 0px 10px 10px;

  background: ${({ completed }) =>
    completed ? "var(--grey-2)" : "var(--lightpurple-2)"};

  color: ${({ completed }) =>
    completed ? "var(--grey-6)" : "var(--grey-7)"};
`;

const SeatText = styled.div`
`;

const Seats = styled.div`
  text-align: right;
`;