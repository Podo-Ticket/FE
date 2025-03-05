import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";

import TopNav from "../../components/nav/TopNav.tsx";

import leftArrow from "../../assets/images/left_arrow.png";
import rightArrow from "../../assets/images/admin/lightGrey_rightArrow.png";
import editIcon from "../../assets/images/admin/mynaui_pencil.png";

import MultipleAcceptModal from "../../components/modal/DefaultModal";

import {
  fetchReservationInfo,
  ReservationInfo,
  deleteReservation,
} from "../../api/admin/ReservedManageApi.ts";

export default function ReservedCheck() {
  const [showMultipleAcceptModal, setShowMultipleAcceptModal] =
    useState<boolean>(false);
  const [reservationInfo, setReservationInfo] =
    useState<ReservationInfo | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const { scheduleId, userId } = location.state || {}; // 바로 state에서 추출

  useEffect(() => {
    const loadReservationInfo = async () => {
      try {
        if (!scheduleId || !userId) return;
        const info: any = await fetchReservationInfo(
          Number(scheduleId),
          BigInt(userId)
        );
        setReservationInfo(info.user);
      } catch (error) {
        console.error("Failed to load reservation info:", error);
      }
    };
    loadReservationInfo();
  }, [scheduleId, userId]);

  const handleDelete = async () => {
    try {
      if (!userId) {
        console.error("userId is missing!");
        return;
      }
      await deleteReservation(BigInt(userId));
      setShowMultipleAcceptModal(false);
      navigate("/reserved");
    } catch (error) {
      console.error("Failed to delete reservation:", error);
    }
  };

  const navItem = {
    icon: leftArrow,
    iconWidth: 13,
    iconHeight: 20,
    text: "예매 명단 확인",
    clickFunc: () => navigate("/reserved"),
  };

  console.log("Received state:", location.state);
  console.log("Extracted scheduleId:", scheduleId);
  console.log("Extracted userId:", userId);

  const rightItem = {
    icon: editIcon,
    iconWidth: 24,
    iconHeight: 24,
    text: "",
    clickFunc: () =>
      navigate("/reserved/check/edit", {
        state: {
          userId,
          name: reservationInfo?.name,
          phone_number: reservationInfo?.phone_number,
          head_count: reservationInfo?.head_count,
          schedule_id: reservationInfo?.schedule_id,
        },
      }),
  };

  return (
    <Container>
      <TopNav
        lefter={navItem}
        center={navItem}
        righter={rightItem}
        isUnderlined={true}
      />
      <Form>
        <div
          style={{
            padding: "0 30px",
            display: "flex",
            flexDirection: "column",
            gap: "30px",
          }}
        >
          <FormContainer>
            <Label>이름</Label>
            <Value>{reservationInfo?.name}</Value>
          </FormContainer>

          <FormContainer>
            <Label>연락처</Label>
            <Value>{reservationInfo?.phone_number}</Value>
          </FormContainer>

          <FormContainer>
            <Label>예매 인원</Label>
            <Value>{reservationInfo?.head_count}석</Value>
          </FormContainer>

          <FormContainer>
            <Label>공연 회차</Label>
            <Value>{reservationInfo?.schedule.date_time}</Value>
          </FormContainer>
        </div>
        <div>
          <DeleteButton
            className="Podo-Ticket-Headline-H5"
            type="button"
            onClick={() => setShowMultipleAcceptModal(true)}
          >
            명단 삭제 <img src={rightArrow} style={{ width: "8px" }}></img>
          </DeleteButton>
        </div>

        
        <MultipleAcceptModal
          showDefaultModal={showMultipleAcceptModal}
          title={"해당 명단을 삭제하시겠습니까?"}
          description={"삭제한 명단은 다시 복구 불가합니다."}
          onAcceptFunc={handleDelete}
          onUnacceptFunc={() => {
            setShowMultipleAcceptModal(false);
          }}
        />
      </Form>
    </Container>
  );
}

const Container = styled.div``;
const Form = styled.div`
  padding-top: 25px;
`;
const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 13px;
`;
const Label = styled.label``;
const DeleteButton = styled.button`
  display: block;
  margin: 90px auto 0; /* auto를 사용해 가로 중앙 정렬 */
  padding: 10px 20px; /* 버튼 내부 여백 추가 */
  border: none;
  background: none;
  cursor: pointer;
  color: var(--grey-5);
`;

const Value = styled.p`
  border: none;
  border-bottom: 1px solid var(--grey-4);
  height: 38px;
`;
