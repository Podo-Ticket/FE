import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import socket from "../../api/socket";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import TopNav from "@components/layout/headers/TopNav";
import DefaultInput from "@components/common/inputs/DefaultInput";
import LargeBtn from "@components/common/buttons/LargeBtn";
import ErrorModal from "@components/common/errors/DefaultErrorModal";
import Loading from "@components/common/loadings/Loading.tsx";
import NoticeModal from "@components/common/modals/NoticeModal.tsx";
import PrivacyPolicyModal from "@components/common/modals/TextModal.tsx";

import goBackIcon from "../../assets/images/left_arrow.png";
import CheckedIcon from "../../assets/images/privacy_checked.png";
import UncheckedIcon from "../../assets/images/privacy_unchecked.png";

import { DateUtil } from "../../utils/DateUtil";
import { fadeIn } from "../../styles/animation/DefaultAnimation.ts";
import {
  fetchPerformanceSchedules,
  submitReservation,
  ReservationRequest,
} from "../../api/user/OnSiteReserveApi";
import {
  ONSITE_RESERVE,
  PERSONAL_INFORMATION_AGREE_CONTENT,
} from "@/constants/text/UIText.ts";

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

type ReservationFormData = z.infer<typeof reservationSchema>;

function OnSiteReserve() {
  const navigate = useNavigate();
  const language = localStorage.getItem("language");

  const [performanceSchedules, setPerformanceSchedules] = useState<
    Array<{ id: number; date_time: string; free_seats: number }>
  >([]);

  const [isLoading, setIsLoading] = useState(false);

  const [isPrivacyChecked, setIsPrivacyChecked] = useState(false);
  const handleCheckboxChange = () => {
    setIsPrivacyChecked((prevChecked) => !prevChecked);
  };
  const handleCheckboxClick = () => {
    setIsPrivacyChecked((prevChecked) => !prevChecked);
  };
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const openPrivacyModal = () => setShowPrivacyModal(true);
  const closePrivacyModal = () => setShowPrivacyModal(false);

  const [isRejectedModalOpen, setIsRejectedModalOpen] = useState(false);
  const [isDuplicatePhoneModalOpen, setIsDuplicatePhoneModalOpen] =
    useState(false);
  const [isMaximumPersonModalOpen, setIsMaximumPersonModalOpen] =
    useState(false);

  const [value, setValue] = useState<number>(0);

  const {
    control,
    handleSubmit,
    formState: { isDirty, isValid },
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

  useEffect(() => {
    const loadSchedules = async () => {
      try {
        const schedules = await fetchPerformanceSchedules(1);
        setPerformanceSchedules(schedules);
      } catch (error: any) {}
    };
    loadSchedules();
  }, []);

  useEffect(() => {
    const storedScheduleId = localStorage.getItem("scheduleId");
    if (storedScheduleId) {
      setValue(Number(storedScheduleId));
      console.log(storedScheduleId, "andand", value);
    }

    console.log(performanceSchedules);
    console.log(performanceSchedules);
  }, [setValue]);

  const handleReservationSubmit = async (data: ReservationRequest) => {
    try {
      // 예매 신청 API 호출
      const response = await submitReservation(data);

      console.log("response: ", response);

      if (response.success) {
        console.log("Reservation request sent successfully.");
        console.log("current user id: ", response.userId);
        setIsLoading(true); // 로딩 상태 활성화

        const userId = response.userId; // 예매 신청한 사용자 ID

        socket.off(`user:${userId}`);
        socket.off("error");
        socket.off("disconnect");

        socket.on(`user:${userId}`, (messageData: { type: string }) => {
          console.log(`Message received for user ${userId}:`, messageData);

          if (messageData.type === "approval") {
            console.log("Reservation approved");
            localStorage.setItem("scheduleId", data.scheduleId.toString());
            setIsLoading(false);
            navigate("/select"); // 성공 시 이동
          } else if (messageData.type === "reject") {
            console.log("Reservation rejected");
            setIsLoading(false);
            setIsRejectedModalOpen(true);
          } else {
            console.warn("Unknown message type:", messageData.type);
          }
        });

        socket.on("error", (error: any) => {
          console.error("WebSocket error occurred:", error);
          setIsLoading(false);
        });

        socket.on("disconnect", () => {
          console.log("WebSocket connection closed");
          setIsLoading(false);
        });

        console.log("Waiting for approval...");
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
      setIsLoading(false);
    }
  };

  const navTitle =
    language === "english"
      ? ONSITE_RESERVE.english.pageTitle
      : ONSITE_RESERVE.korean.pageTitle;
  const lefter = {
    icon: goBackIcon,
    iconWidth: 13,
    iconHeight: 20,
    text: navTitle,
    clickFunc: () => navigate("/"),
  };

  const filteredSchedules = performanceSchedules.filter(
    (schedule) => schedule.id === value
  );

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
              category={
                language === "english"
                  ? ONSITE_RESERVE.english.firstInputName
                  : ONSITE_RESERVE.korean.firstInputName
              }
              placeholder={
                language === "english"
                  ? ONSITE_RESERVE.english.firstInputPlaceholder
                  : ONSITE_RESERVE.korean.firstInputPlaceholder
              }
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
              category={
                language === "english"
                  ? ONSITE_RESERVE.english.secondInputName
                  : ONSITE_RESERVE.korean.secondInputName
              }
              placeholder={
                language === "english"
                  ? ONSITE_RESERVE.english.secondInputPlaceholder
                  : ONSITE_RESERVE.korean.secondInputPlaceholder
              }
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
              category={
                language === "english"
                  ? ONSITE_RESERVE.english.thirdInputName
                  : ONSITE_RESERVE.korean.thirdInputName
              }
              placeholder={
                language === "english"
                  ? ONSITE_RESERVE.english.thirdInputPlaceholder
                  : ONSITE_RESERVE.korean.thirdInputPlaceholder
              }
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
              category={
                language === "english"
                  ? ONSITE_RESERVE.english.fourthInputName
                  : ONSITE_RESERVE.korean.fourthInputName
              }
              placeholder={
                language === "english"
                  ? ONSITE_RESERVE.english.fouthInputPlaceholder
                  : ONSITE_RESERVE.korean.fouthInputPlaceholder
              }
              isSelect={true}
              options={filteredSchedules.map((schedule) => ({
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
        <AgreementContainer className="Podo-Ticket-Body-B5">
          <AgreementText isChecked={isPrivacyChecked}>
            <HiddenCheckbox
              checked={isPrivacyChecked}
              onChange={handleCheckboxChange}
            />
            <CustomCheckbox
              checked={isPrivacyChecked}
              onClick={handleCheckboxClick}
            ></CustomCheckbox>
            <span onClick={handleCheckboxClick} className="Podo-Ticket-Body-B5">
              {language === "english"
                ? ONSITE_RESERVE.english.authCheckbox
                : ONSITE_RESERVE.korean.authCheckbox}
            </span>
          </AgreementText>

          <AgreementModalLink
            href="#"
            className="Podo-Ticket-Body-B10"
            onClick={openPrivacyModal}
          >
            {language === "english"
              ? ONSITE_RESERVE.english.authShowMore
              : ONSITE_RESERVE.korean.authShowMore}
          </AgreementModalLink>
        </AgreementContainer>

        <LargeBtn
          content={
            language === "english"
              ? ONSITE_RESERVE.english.submitBtn
              : ONSITE_RESERVE.korean.submitBtn
          }
          onClick={handleSubmit(handleReservationSubmit)}
          isAvailable={isDirty && isValid && isPrivacyChecked}
        />
      </ButtonContainer>

      <Loading showLoading={isLoading} isOnSiteReserve={true} />

      <PrivacyPolicyModal
        showTextModal={showPrivacyModal}
        onAcceptFunc={closePrivacyModal}
        title={
          language === "english"
            ? ONSITE_RESERVE.english.personalDataModalTitle
            : ONSITE_RESERVE.korean.peronalDataModalAccept
        }
        description={
          language === "english"
            ? PERSONAL_INFORMATION_AGREE_CONTENT.english.detail
            : PERSONAL_INFORMATION_AGREE_CONTENT.korean.detail
        }
        overlaied={true}
      />

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

      <NoticeModal
        showNoticeModal={isRejectedModalOpen}
        title="예매 신청이 승인되지 않았습니다."
        description="관리자에게 문의 부탁드립니다."
        buttonContent="확인"
        onAcceptFunc={() => setIsRejectedModalOpen(false)}
      />
    </OnSiteReserveContainer>
  );
}

export default OnSiteReserve;

const OnSiteReserveContainer = styled.div``;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 25px 30px;
  animation: ${fadeIn} 0.5s ease-in-out;

  @media (max-resolution: 2dppx) {
    gap: 45px;
    padding: 37.5px 45px;
  }
  @media (min-resolution: 3dppx) {
    gap: 30px;
    padding: 25px 30px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  gap: 35px;
  margin-top: 40px;
  padding: 0 20px;

  animation: ${fadeIn} 0.5s ease-in-out;

  @media (max-resolution: 2dppx) {
    gap: 52.5px;
    margin-top: 60px;
  }
  @media (min-resolution: 3dppx) {
    gap: 35px;
    margin-top: 40px;
  }
`;

const AgreementContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 6px;

  @media (max-resolution: 2dppx) {
    gap: 9px;
  }
  @media (min-resolution: 3dppx) {
    gap: 6px;
  }
`;

const AgreementText = styled.span<{ isChecked: boolean }>`
  display: flex;
  align-items: center;
  color: ${({ isChecked }) =>
    isChecked ? "var(--purple-5)" : "var(--grey-6)"};
`;

const HiddenCheckbox = styled.input.attrs({ type: "checkbox" })`
  display: none;
`;

const CustomCheckbox = styled.div<{ checked: boolean }>`
  width: 14px;
  height: 14px;
  margin-right: 3px;
  background-image: ${(props) =>
    props.checked ? `url(${CheckedIcon})` : `url(${UncheckedIcon})`};
  background-size: contain;
  background-repeat: no-repeat;
  display: inline-block;

  @media (max-resolution: 2dppx) {
    width: 21px;
    height: 21px;
    margin-right: 4.5px;
  }
  @media (min-resolution: 3dppx) {
    width: 14px;
    height: 14px;
    margin-right: 3px;
  }
`;

const AgreementModalLink = styled.a`
  color: var(--grey-6);
`;
