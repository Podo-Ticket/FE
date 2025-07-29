import {forwardRef} from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import scheduleIcon from '@/assets/icons/ic_schedule.svg';
import {ko} from 'date-fns/locale';

interface ScheduleSelectorProps {
  value: {date: Date | null; time: string}[];
  onChange: (schedules: {date: Date | null; time: string}[]) => void;
}
const CustomInput = forwardRef<HTMLInputElement, React.ComponentPropsWithoutRef<'input'>>(
  ({value, onClick}, ref) => {
    return (
      <StyledInputWrapper onClick={onClick}>
        <StyledInput
          className='Podo-Ticket-Body-B5'
          ref={ref}
          value={value || ''}
          placeholder='YYYY-MM-DD'
        />
        <CalendarIcon />
      </StyledInputWrapper>
    );
  },
);

const ScheduleSelector = ({value, onChange}: ScheduleSelectorProps) => {
  const addSchedule = () => {
    onChange([...value, {date: null, time: ''}]);
  };

  const removeSchedule = (index: number) => {
    const updated = value.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleDateChange = (index: number, date: Date | null) => {
    const updated = [...value];
    updated[index].date = date;
    onChange(updated);
  };

  const handleTimeChange = (index: number, time: string) => {
    const numeric = time.replace(/[^0-9]/g, '').slice(0, 4);

    let formatted = '';
    if (numeric.length >= 3) {
      const hours = numeric.slice(0, 2);
      const minutes = numeric.slice(2);
      const h = Number(hours);
      const m = Number(minutes);

      if (h > 23 || m > 59) {
        // 유효하지 않은 시간 → 리셋
        formatted = '';
      } else {
        formatted = `${hours}:${minutes}`;
      }
    } else {
      formatted = numeric;
    }

    const updated = [...value];
    updated[index].time = formatted;
    onChange(updated);
  };

  return (
    <>
      {value.map((schedule, index) => (
        <ScheduleRow key={index}>
          <div
            style={{display: 'flex', flexDirection: 'row', gap: '3.186vw'}}
            className='Podo-Ticket-Body-B5'
          >
            <DatePicker
              customInput={<CustomInput />}
              dateFormat='yyyy.MM.dd (eee)'
              selected={schedule.date}
              locale={ko} // 로케일 설정
              onChange={date => handleDateChange(index, date)}
              popperPlacement='bottom-end'
              popperContainer={({children}) => (
                <div style={{position: 'absolute', zIndex: 9999}}>{children}</div>
              )}
            ></DatePicker>

            <TimeSelect
              value={schedule.time}
              onChange={e => {
                handleTimeChange(index, e.target.value);
              }}
              placeholder='HH:MM'
              type='text'
            >
              {/* <option value=''>00:00</option>

              {Array.from({length: 24}, (_, h) => (
                <option key={h} value={`${h.toString().padStart(2, '0')}:00`}>
                  {`${h.toString().padStart(2, '0')}:00`}
                </option>
              ))} */}
            </TimeSelect>
          </div>
          <RemoveBtn onClick={() => removeSchedule(index)}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='20'
              height='20'
              viewBox='0 0 20 20'
              fill='none'
            >
              <path
                d='M14.1248 5.87479L5.87521 14.1244M5.87521 5.87479L14.1248 14.1244'
                stroke='#9E9E9E'
                stroke-width='1.5'
                stroke-linecap='round'
                stroke-linejoin='round'
              />
            </svg>
          </RemoveBtn>
        </ScheduleRow>
      ))}

      <AddBtn onClick={addSchedule}>회차 추가 +</AddBtn>
    </>
  );
};

export default ScheduleSelector;

const ScheduleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 5.85vw;
`;

const TimeSelect = styled.input`
  width: 29.5vw;
  border: none;
  border-bottom: 1px solid #ccc;
  background: transparent;
`;

const RemoveBtn = styled.button`
  background: none;
  border: none;
  width: 5.1vw;
  cursor: pointer;
`;

const AddBtn = styled.button`
  border: none;
  border-radius: 10px;
  background: var(--grey-3);
  width: 100%;
  height: 6.1svh;
  margin-top: 3svh;
  cursor: pointer;

  color: var(--grey-6);
`;

const StyledInputWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 40.46vw;
  padding: 0.45svh 0 1.51svh 0;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
  position: relative;
`;

const StyledInput = styled.input`
  width: 100%;
  border: none;
  background: transparent;
  outline: none;
`;

const CalendarIcon = styled.div`
  position: absolute;
  right: 2.8%;
  width: 1rem;
  height: 1rem;
  background-image: url(${scheduleIcon}); // 원하시는 svg나 아이콘 경로
  background-size: contain;
  background-repeat: no-repeat;
`;
