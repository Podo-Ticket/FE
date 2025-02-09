import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import TopNav from '../../components/nav/TopNav';
import DefaultInput from '../../components/inputField/DefaultInput';
import LargeBtn from '../../components/button/LargeBtn';
import ErrorModal from '../../components/error/DefaultErrorModal';

import goBackIcon from '../../assets/images/left_arrow.png';
import { DateUtil } from '../../utils/DateUtil';
import { fadeIn } from '../../styles/animation/DefaultAnimation.ts';
import {
    fetchPerformanceSchedules,
    submitReservation,
    createApprovalChecker,
} from '../../api/user/OnSiteReserveApi';

// Define the schema for form validation using Zod
const reservationSchema = z.object({
    name: z.string().min(1, '이름을 입력해주세요.'),
    phone: z
        .string()
        .regex(/^\d{3}-\d{3,4}-\d{4}$/, '올바른 전화번호 형식이 아닙니다.')
        .min(1, '전화번호를 입력해주세요.'),
    attendees: z
        .number()
        .min(1, '최소 1명 이상의 인원을 입력해주세요.')
        .max(10, '최대 10명까지 예매 가능합니다.'),
    performance: z.string().min(1, '공연 회차를 선택해주세요.'),
});

// Define the TypeScript type for form data
type ReservationFormData = z.infer<typeof reservationSchema>;

function OnSiteReserve() {
    const navigate = useNavigate();
    const [performanceSchedules, setPerformanceSchedules] = useState<
        Array<{ id: string; date_time: string; available_seats: number }>
    >([]);
    const [isDuplicatePhoneModalOpen, setIsDuplicatePhoneModalOpen] = useState(false);

    // React Hook Form setup with Zod resolver
    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<ReservationFormData>({
        resolver: zodResolver(reservationSchema),
        defaultValues: {
            name: '',
            phone: '',
            attendees: undefined,
            performance: '',
        },
    });

    // Fetch performance schedules on component mount
    useEffect(() => {
        loadSchedules();
    }, []);

    const loadSchedules = async () => {
        try {
            const schedules = await fetchPerformanceSchedules(1);
            setPerformanceSchedules(schedules);
        } catch (error) {
            console.error('Failed to load schedules:', error);
        }
    };

    // Handle form submission
    const onSubmit = async (data: ReservationFormData) => {
        try {
            const response = await submitReservation({
                name: data.name,
                phoneNumber: data.phone,
                headCount: data.attendees,
                scheduleId: Number(data.performance),
            });

            if (response.success) {
                handleWaitingApprove();
            } else if (response.error === '이미 예약되었습니다.') {
                setIsDuplicatePhoneModalOpen(true);
            }
        } catch (error) {
            console.error('Failed to submit reservation:', error);
        }
    };

    // Handle approval status polling
    const handleWaitingApprove = () => {
        const approvalChecker = createApprovalChecker();

        approvalChecker.startPolling(
            () => {
                /* 승인 처리 로직 */
            },
            () => {
                /* 타임아웃 처리 */
            },
            (message) => {
                /* 에러 처리 */
            }
        );
    };

    const lefter = {
        icon: goBackIcon,
        iconWidth: 13,
        iconHeight: 20,
        text: '현장 예매',
        clickFunc: () => navigate('/'),
    };

    return (
        <OnSiteReserveContainer>
            <TopNav lefter={lefter} center={lefter} righter={null} isUnderlined={true} />

            <InputContainer>
                {/* Name Input */}
                <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                        <DefaultInput
                            category="이름"
                            placeholder="이름을 입력해주세요."
                            value={field.value}
                            onChangeFunc={field.onChange}
                            errorMessage={errors.name?.message}
                        />
                    )}
                />

                {/* Phone Input */}
                <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                        <DefaultInput
                            category="연락처"
                            placeholder="연락처를 입력해주세요."
                            value={field.value}
                            onChangeFunc={(e) => {
                                const rawValue = e.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
                                const formattedValue = rawValue
                                    .slice(0, 11) // Limit raw input to 11 digits (XXX-XXXX-XXXX)
                                    .replace(/(\d{3})(\d{3,4})?(\d{4})?/, (_, p1, p2, p3) =>
                                        [p1, p2, p3].filter(Boolean).join('-')
                                    );

                                field.onChange(formattedValue); // Update the field value
                            }}
                            errorMessage={errors.phone?.message}
                        />
                    )}
                />

                {/* Attendees Input */}
                <Controller
                    name="attendees"
                    control={control}
                    render={({ field }) => (
                        <DefaultInput
                            category="예매 인원"
                            placeholder="예매 인원을 선택해주세요."
                            isSelect={true}
                            isNumberSelect={true}
                            value={field.value}
                            onChangeFunc={(e) => field.onChange(Number(e.target.value))}
                            errorMessage={errors.attendees?.message}
                        />
                    )}
                />

                {/* Performance Selection */}
                <Controller
                    name="performance"
                    control={control}
                    render={({ field }) => (
                        <DefaultInput
                            category="공연 회차"
                            placeholder="공연 회차를 선택해주세요."
                            isSelect={true}
                            options={performanceSchedules.map((schedule) => ({
                                value: schedule.id,
                                label: `${DateUtil.formatDate(schedule.date_time)} [여석: ${schedule.available_seats}]`,
                            }))}
                            value={field.value}
                            onChangeFunc={(e) => field.onChange(e.target.value)}
                            errorMessage={errors.performance?.message}
                        />
                    )}
                />
            </InputContainer>

            {/* Submit Button */}
            <ButtonContainer>
                <LargeBtn content="예매 신청" onClick={handleSubmit(onSubmit)} isAvailable={!Object.keys(errors).length} />
            </ButtonContainer>

            {/* Error Modal */}
            <ErrorModal
                showDefaultErrorModal={isDuplicatePhoneModalOpen}
                errorMessage="이미 예매 신청이 완료된 연락처입니다."
                onAcceptFunc={() => setIsDuplicatePhoneModalOpen(false)}
                OnTopSide={true}
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
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 75px;
  animation: ${fadeIn} 0.5s ease-in-out;
`;
