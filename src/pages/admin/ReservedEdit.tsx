import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import TopNav from "../../components/nav/TopNav";
import DefaultInput from "../../components/inputField/DefaultInput";
import ErrorModal from "../../components/error/DefaultErrorModal";
import MoreSmallBtn from "../../components/button/MoreSmallBtn.tsx";
import MoreMediumBtn from "../../components/button/MoreMediumBtn.tsx";
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
  editReservation,
  EditRequest,
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

function ReservedEdit() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, name, phone_number, head_count, schedule_id } =
    location.state || {}; // 바로 state에서 추출

  const [performanceSchedules, setPerformanceSchedules] = useState<Schedule[]>(
    []
  );

  const [isRejectedModalOpen, setIsRejectedModalOpen] = useState(false);
  const [isAdministratorRightsModalOpen, setIsAdministratorRightsModalOpen] =
    useState(false);
  const [isMaximumPersonModalOpen, setIsMaximumPersonModalOpen] =
    useState(false);

  const [isInvalidPhoneModalOpen, setIsInvalidPhoneModalOpen] = useState(false); // 추가된 상태
  const [isIncorrectInfo, setIsIncorrectInfo] = useState(false); // 추가된 상태

  console.log("Received state:", location.state);
  console.log("Extracted userId:", userId);
  console.log("Extracted name:", name);
  console.log("Extracted phone_number:", phone_number);
  console.log("Extracted head_count:", head_count);
  console.log("Extracted date_time:", schedule_id);

  // React Hook Form setup with Zod resolver
  const {
    control,
    handleSubmit,
    formState: { isDirty, isValid },
  } = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
    mode: "onChange",
    defaultValues: {
      name: name || "",
      phoneNumber: phone_number || "",
      headCount: head_count || 0,
      scheduleId: schedule_id || 0,
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

  // 예매 수정 처리 함수
  const handleReservationSubmit = async (data: ReservationFormData) => {
    try {
      if (!data.phoneNumber.startsWith("010")) {
        setIsInvalidPhoneModalOpen(true);
        return;
      }

      const requestData: EditRequest = {
        userId: userId, // 🔥 userId 추가!
        name: data.name,
        phoneNumber: data.phoneNumber,
        headCount: data.headCount,
        scheduleId: data.scheduleId,
      };
      // 예매 수정 API 호출
      const response = await editReservation(requestData);

      console.log("response: ", response);

      if (response.success) {
        navigate("/reserved");
      } else {
        if (response.error === "관리자 권한이 필요합니다.") {
          setIsAdministratorRightsModalOpen(true);
        } else if (response.error === "예약 가능 인원을 초과하였습니다.") {
          setIsMaximumPersonModalOpen(true);
        } else if (response.error === "올바르지 않은 변경 정보") {
          setIsIncorrectInfo(true);
        }
      }
    } catch (error) {
      console.error("Error during reservation submission:", error);
    }
  };

  const lefter = {
    icon: goBackIcon,
    iconWidth: 13,
    iconHeight: 20,
    text: "예매 명단 확인",
    clickFunc: () => navigate("/reserved"),
  };

  return (
    <OnSiteReserveContainer>
      <TopNav
        lefter={lefter}
        center={lefter}
        righter={undefined}
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
        <MoreSmallBtn
          content="취소"
          onClick={() => {
            navigate("/reserved/check", {
              state: {
                scheduleId: schedule_id, // 현재 선택된 공연 회차 ID
                userId, // 선택한 사용자 ID
              },
            });
          }}
          isAvailable={true}
          isGray={true}
        />

        <MoreMediumBtn
          content="수정 완료"
          onClick={handleSubmit(handleReservationSubmit)}
          isAvailable={isDirty && isValid}
        />
      </ButtonContainer>

      <ErrorModal
        showDefaultErrorModal={isAdministratorRightsModalOpen}
        errorMessage="관리자 권한이 필요합니다."
        onAcceptFunc={() => setIsAdministratorRightsModalOpen(false)}
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
      <ErrorModal
        showDefaultErrorModal={isIncorrectInfo}
        errorMessage="올바르지 않은 변경 정보입니다."
        onAcceptFunc={() => setIsIncorrectInfo(false)}
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

export default ReservedEdit;

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
  gap: 10px;
`;
