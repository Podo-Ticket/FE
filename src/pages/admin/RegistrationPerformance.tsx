import TopNav from '@components/layout/headers/TopNav.tsx';
import styled from 'styled-components';
import {useForm, Controller} from 'react-hook-form';
import DefaultInput from '@components/common/inputs/DefaultInput';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import ScheduleSelector from '@components/pages/admin/registrationPerformance/ScheduleSelector';
import AccessAdminBtn from '@components/common/buttons/LargeBtn';
import PosterUploader from '@/components/pages/admin/registrationPerformance/PosterUploader';
import {postRegistrationPerformance} from '@/api/admin/RegistrationPerformanceApi';
import {formatNumberWithComma} from '@/utils/FormatNumber';

const performanceSchema = z.object({
  title: z.string().min(1, '공연 제목을 입력해주세요.'),
  en_title: z.string().min(1, '공연 제목을 입력해주세요.').optional(),
  location: z.string().min(1, '장소를 입력해주세요.'),
  en_location: z.string().min(1, '장소를 입력해주세요.').optional(),
  price: z.number().refine(val => val !== 0, '가격을 입력해주세요.'),
  runningTime: z.number().refine(val => val !== 0, '공연 시간을 입력해주세요.'),
  poster: z.instanceof(File, {message: '포스터 파일을 등록해주세요.'}),
  schedules: z
    .array(
      z.object({
        date: z.date().nullable(), // 혹은 z.union([z.date(), z.null()])
        time: z.string(),
      }),
    )
    .refine(
      schedules =>
        schedules.filter(
          s => s.date instanceof Date && !isNaN(s.date.getTime()) && s.time.trim() !== '',
        ).length > 0,
      {
        message: '공연 날짜 및 시간을 입력해주세요.',
      },
    ),
});

type PerformanceFormData = z.infer<typeof performanceSchema>;

const RegistrationPerformance = () => {
  const navItem = {
    icon: undefined,
    text: '신규 공연 등록',
    clickFunc: undefined,
  };

  const {
    control,
    handleSubmit,
    formState: {isValid},
  } = useForm<PerformanceFormData>({
    resolver: zodResolver(performanceSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      en_title: undefined,
      location: '',
      en_location: undefined,
      price: 0,
      poster: undefined,
      runningTime: 0,
      schedules: [{date: null, time: ''}],
    },
  });

  const handleRegistration = async (data: PerformanceFormData) => {
    try {
      console.log(data);

      const transformedSchedules = data.schedules
        .filter(s => s.date instanceof Date && !isNaN(s.date.getTime()) && s.time)
        .map(s => {
          const isoDate = s.date?.toISOString().split('T')[0]; // YYYY-MM-DD
          return {
            dateTime: `${isoDate}T${s.time}:00`, // YYYY-MM-DDTHH:mm:00
            availableSeats: 0,
          };
        });

      const formData = new FormData();

      formData.append('poster', data.poster); // File 객체
      formData.append('title', data.title);
      formData.append('en_title', data.en_title);
      formData.append('location', data.location);
      formData.append('en_location', data.en_location);
      formData.append('price', String(data.price));
      formData.append('runningTime', String(data.runningTime));
      formData.append('schedules', JSON.stringify(transformedSchedules)); // 문자열로

      // const payload = {
      //   ...data,
      //   schedules: JSON.stringify(transformedSchedules),
      // };
      // console.log(transformedSchedules);
      // console.log(payload);

      const submit = await postRegistrationPerformance(formData);
      console.log('공연 등록 성공:', submit);
    } catch (error) {
      console.log('실패');
    }
  };

  return (
    <div>
      <TopNav lefter={undefined} center={navItem} righter={undefined} isUnderlined={true} />
      <InputContainer>
        <Controller
          name='title'
          control={control}
          render={({field}) => (
            <DefaultInput
              category='공연 제목 (한글)'
              placeholder='공연 제목을 입력해주세요.'
              value={field.value}
              onChangeFunc={field.onChange}
              isEssential={true}
            />
          )}
        />

        <Controller
          name='en_title'
          control={control}
          render={({field}) => (
            <DefaultInput
              category='공연 제목 (영문)'
              placeholder='공연 제목을 영어로 입력해주세요.'
              value={field.value}
              onChangeFunc={e => {
                const input = e.target.value;
                const onlyEnglish = input.replace(/[^a-zA-Z\s]/g, ''); // 영어와 공백만 허용
                field.onChange(onlyEnglish);
              }}
            />
          )}
        />

        <Controller
          name='schedules'
          control={control}
          render={({field}) => (
            <div>
              <Category className='Podo-Ticket-Body-B3'>
                공연 날짜 및 시간 <Essential>*</Essential>
              </Category>
              <ScheduleSelector value={field.value} onChange={field.onChange} />
            </div>
          )}
        />

        <Controller
          name='location'
          control={control}
          render={({field}) => (
            <DefaultInput
              category='공연 장소 (한글)'
              placeholder='공연 장소를 입력해주세요.'
              value={field.value}
              onChangeFunc={field.onChange}
              isEssential={true}
            />
          )}
        />

        <Controller
          name='en_location'
          control={control}
          render={({field}) => (
            <DefaultInput
              category='공연 장소 (영문)'
              placeholder='공연 장소를 영어로 입력해주세요.'
              value={field.value}
              onChangeFunc={e => {
                const input = e.target.value;
                const onlyEnglish = input.replace(/[^a-zA-Z\s]/g, ''); // 영어와 공백만 허용
                field.onChange(onlyEnglish);
              }}
            />
          )}
        />

        <Controller
          name='price'
          control={control}
          render={({field}) => (
            <DefaultInput
              category='가격'
              placeholder='공연 가격을 입력해주세요.'
              value={field.value === 0 ? '' : formatNumberWithComma(field.value)}
              onChangeFunc={e => {
                const input = e.target.value.replace(/[^0-9]/g, '');
                field.onChange(Number(input)); // 숫자로 변환
              }}
              unitText='원'
              isEssential={true}
            />
          )}
        />

        <Controller
          name='runningTime'
          control={control}
          render={({field}) => (
            <DefaultInput
              category='공연 시간'
              placeholder='공연 시간을 분 단위로 입력해주세요.'
              value={field.value === 0 ? '' : field.value.toString()}
              onChangeFunc={e => {
                const input = e.target.value.replace(/[^0-9]/g, '');
                field.onChange(Number(input)); // 숫자로 변환
              }}
              unitText='분'
              isEssential={true}
            />
          )}
        />

        <Controller
          name='poster'
          control={control}
          render={({field}) => <PosterUploader value={field.value} onChange={field.onChange} />}
        />

        <ButtonContainer>
          <AccessAdminBtn
            content='등록'
            onClick={handleSubmit(handleRegistration)}
            isAvailable={isValid}
          />
        </ButtonContainer>
      </InputContainer>
    </div>
  );
};

export default RegistrationPerformance;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 25px 30px;
`;
const Category = styled.div`
  display: flex;
  flex-direction: row;
  color: var(--grey-7);
  margin-bottom: 13px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Essential = styled.span`
  color: var(--red-1);
  margin-left: 4px;
`;
