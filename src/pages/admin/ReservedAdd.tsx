import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";


import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import TopNav from "../../components/nav/TopNav";
import DefaultInput from "../../components/inputField/DefaultInput";
import LargeBtn from "../../components/button/LargeBtn";
import ErrorModal from "../../components/error/DefaultErrorModal";

import goBackIcon from "../../assets/images/left_arrow.png";
import { DateUtil } from "../../utils/DateUtil";
import { fadeIn } from "../../styles/animation/DefaultAnimation.ts";
// import {
//   fetchPerformanceSchedules,
//   submitReservation,
//   ReservationRequest,
// } from "../../api/user/OnSiteReserveApi";
import {
  fetchSchedules,
  Schedule,
  addReservation,
  ReservationRequest,
} from "../../api/admin/ReservedManageApi.ts";

import NoticeModal from "../../components/modal/NoticeModal.tsx";

// Define the schema for form validation using Zod
const reservationSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요."),
  phoneNumber: z
    .string()
    .regex(/^\d{3}-\d{3,4}-\d{4}$/, "올바른 전화번호 형식이 아닙니다.")
    .min(1, "전화번호를 입력해주세요."),
  headCount: z
    .number()
    .min(1, "최소 1명 이상의 인원을 입력해주세요.")
    .max(16, "최대 10명까지 예매 가능합니다."),
  scheduleId: z.number().min(1, "공연 회차를 선택해주세요."),
});

// Define the TypeScript type for form data
type ReservationFormData = z.infer<typeof reservationSchema>;


function ReservedAdd() {

  const navigate = useNavigate();

  const [performanceSchedules, setPerformanceSchedules] = useState<Schedule[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false); // 승인 대기 로딩 상태

  const [isRejectedModalOpen, setIsRejectedModalOpen] = useState(false);
  const [isDuplicatePhoneModalOpen, setIsDuplicatePhoneModalOpen] =
    useState(false);
  const [isMaximumPersonModalOpen, setIsMaximumPersonModalOpen] =
    useState(false);

  const [isInvalidPhoneModalOpen, setIsInvalidPhoneModalOpen] = useState(false); // 추가된 상태

  // React Hook Form setup with Zod resolver
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      phoneNumber: "",
      headCount: 0,
      scheduleId: 0,
    },
  });

  // 공연 일정 정보 반영
  useEffect(() => {
    const loadSchedules = async () => {
      try {
        const schedules = await fetchSchedules();
        setPerformanceSchedules(schedules);
      } catch (error) {
        console.error("Failed to load schedules:", error);
      }
    };
    loadSchedules();
  }, []);

  // 예매 명단 추가 처리 함수
  const handleReservationSubmit = async (data: ReservationRequest) => {
    try {
      if (!data.phoneNumber.startsWith("010")) {
        setIsInvalidPhoneModalOpen(true);
        return;
      }
      // 예매 신청 API 호출
      const response = await addReservation(data);

      console.log("response: ", response);

      if (response.success) {
        navigate("/reserved");
      } else {
        setIsLoading(false);
        if (response.error === "이미 예약되었습니다.") {
          setIsDuplicatePhoneModalOpen(true);
        } else if (response.error === "예약 가능 인원을 초과하였습니다.") {
          setIsMaximumPersonModalOpen(true);
        }
      }
    } catch (error) {
      console.error("Error during reservation submission:", error);
      setIsLoading(false); // 오류 발생 시 로딩 상태 해제
    }
  };

  const lefter = {
    icon: goBackIcon,
    iconWidth: 13,
    iconHeight: 20,
    text: "예매 명단 추가",
    clickFunc: () => navigate("/reserved"),
  };

  return (
    <OnSiteReserveContainer>
      <TopNav
        lefter={lefter}
        center={lefter}
        righter={null}
        isUnderlined={true}
      />

      <InputContainer>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <DefaultInput
              category="이름"
              placeholder="이름을 입력해주세요."
              value={field.value}
              onChangeFunc={field.onChange}
            />
          )}
        />

        <Controller
          name="phoneNumber"
          control={control}
          render={({ field }) => (
            <DefaultInput
              category="연락처"
              placeholder="연락처를 입력해주세요."
              value={field.value}
              onChangeFunc={(e) => {
                const rawValue = e.target.value.replace(/[^0-9]/g, "");
                const formattedValue = rawValue
                  .slice(0, 11)
                  .replace(/(\d{3})(\d{3,4})?(\d{4})?/, (_, p1, p2, p3) =>
                    [p1, p2, p3].filter(Boolean).join("-")
                  );
                field.onChange(formattedValue);
              }}
            />
          )}
        />

        <Controller
          name="headCount"
          control={control}
          render={({ field }) => (
            <DefaultInput
              category="예매 인원"
              placeholder="예매 인원을 선택해주세요."
              isSelect={true}
              isNumberSelect={true}
              value={field.value.toString()}
              onChangeFunc={(e) => field.onChange(Number(e.target.value))}
            />
          )}
        />

        <Controller
          name="scheduleId"
          control={control}
          render={({ field }) => (
            <DefaultInput
              category="공연 회차"
              placeholder="공연 회차를 선택해주세요."
              isSelect={true}
              options={performanceSchedules.map((schedule) => ({
                value: schedule.id,
                label: `${DateUtil.formatDate(schedule.date_time)} [여석: ${
                  schedule.free_seats
                }]`,
              }))}
              value={field.value.toString()}
              onChangeFunc={(e) => field.onChange(Number(e.target.value))}
            />
          )}
        />
      </InputContainer>

      <ButtonContainer>
        <LargeBtn
          content="추가"
          onClick={handleSubmit(handleReservationSubmit)}
          isAvailable={isDirty && isValid}
        />
      </ButtonContainer>

      <ErrorModal
        showDefaultErrorModal={isDuplicatePhoneModalOpen}
        errorMessage="이미 예매 신청이 완료된 연락처입니다."
        onAcceptFunc={() => setIsDuplicatePhoneModalOpen(false)}
        aboveButton={true}
      />

      <ErrorModal
        showDefaultErrorModal={isMaximumPersonModalOpen}
        errorMessage="예약 가능 인원을 초과하였습니다."
        onAcceptFunc={() => setIsMaximumPersonModalOpen(false)}
        aboveButton={true}
      />
      <ErrorModal
        showDefaultErrorModal={isInvalidPhoneModalOpen}
        errorMessage="잘못된 형식의 전화번호 입니다."
        onAcceptFunc={() => setIsInvalidPhoneModalOpen(false)}
        aboveButton={true}
      />

      <NoticeModal
        showNoticeModal={isRejectedModalOpen}
        title="예매 거절"
        description="예매가 거절되었습니다."
        onAcceptFunc={() => setIsRejectedModalOpen(false)}
      />
    </OnSiteReserveContainer>
  );
}

export default ReservedAdd;


const OnSiteReserveContainer = styled.div``;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 25px 30px;
  animation: ${fadeIn} 0.5s ease-in-out;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 75px;
  animation: ${fadeIn} 0.5s ease-in-out;
`;
