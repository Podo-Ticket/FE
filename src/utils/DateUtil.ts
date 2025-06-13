import {Language} from '../constants/text/Language';

export class DateUtil {
  /**
   * Formats an ISO date string into 'YYYY.MM.DD (요일) HH:MM'.
   * @param isoDate - ISO 8601 date string (e.g., '2025-01-12T04:07:29.928354')
   *  * @param language - 'korean' | 'english'
   * @returns Formatted date string in 'YYYY.MM.DD (요일) HH:MM' format.
   */
  static formatDate(isoDate: string, language: Language = Language.Korean): string {
    try {
      const date = new Date(isoDate);

      if (isNaN(date.getTime())) {
        throw new Error('Invalid date format');
      }

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      // 요일 맵핑 (영어 -> 한글)
      const weekdays = {
        [Language.Korean]: ['일', '월', '화', '수', '목', '금', '토'],
        [Language.English]: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      };

      const weekday = weekdays[language][date.getDay()];

      const hour = String(date.getHours()).padStart(2, '0');
      const minute = String(date.getMinutes()).padStart(2, '0');

      return `${year}.${month}.${day} (${weekday}) ${hour}:${minute}`;
    } catch (error) {
      throw error;
    }
  }
}

// 공연 날짜와 시작 시간 분리 함수
export function splitDateTime(
  input: string,
  language: Language = Language.Korean,
): {date: string; time: string} | null {
  // 언어별 요일 정규식 패턴

  const koreanToEnglishWeekday: Record<string, string> = {
    일: 'Sun',
    월: 'Mon',
    화: 'Tue',
    수: 'Wed',
    목: 'Thu',
    금: 'Fri',
    토: 'Sat',
  };

  // 정규식을 사용하여 'YYYY.MM.DD (요일) HH:mm' 형식 매칭
  const pattern = /^(\d{4}\.\d{2}\.\d{2}) \(([가-힣])\) (\d{2}:\d{2})$/;

  const match = input.match(pattern);

  if (match) {
    const datePart = match[1]; // '2025.04.15'
    const weekdayKorean = match[2]; // '화'
    const time = match[3]; // '21:22'

    const weekday =
      language === Language.English
        ? koreanToEnglishWeekday[weekdayKorean] || weekdayKorean
        : weekdayKorean;

    const formattedDate = `${datePart} (${weekday})`;

    return {date: formattedDate, time};
  }

  // 형식이 맞지 않는 경우 null 반환
  return null;
}

interface Schedule {
  id: number;
  date_time: string;
}

export const getClosestDateTime = (schedule: Schedule[]) => {
  const now = new Date(); // 현재 시간

  // 스케줄 중 가장 가까운 시간을 계산
  const closest = schedule.reduce((prev, curr) => {
    const prevTime = new Date(prev.date_time).getTime();
    const currTime = new Date(curr.date_time).getTime();
    const nowTime = now.getTime();

    // 현재 시간과의 차이를 비교하여 더 가까운 시간을 선택
    return Math.abs(currTime - nowTime) < Math.abs(prevTime - nowTime) ? curr : prev;
  });

  return closest.date_time; // 가장 가까운 스케줄의 date_time 반환
};
