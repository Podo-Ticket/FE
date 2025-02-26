export class DateUtil {
  /**
   * Formats an ISO date string into 'YYYY.MM.DD (요일) HH:MM'.
   * @param isoDate - ISO 8601 date string (e.g., '2025-01-12T04:07:29.928354')
   * @returns Formatted date string in 'YYYY.MM.DD (요일) HH:MM' format.
   */
  static formatDate(isoDate: string): string {
    try {
      const date = new Date(isoDate);

      if (isNaN(date.getTime())) {
        throw new Error("Invalid date format");
      }

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      // 요일 맵핑 (영어 -> 한글)
      const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
      const weekday = weekdays[date.getDay()];

      const hour = String(date.getHours()).padStart(2, "0");
      const minute = String(date.getMinutes()).padStart(2, "0");

      return `${year}.${month}.${day} (${weekday}) ${hour}:${minute}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      throw error;
    }
  }
}

// 공연 날짜와 시작 시간 분리 함수
export function splitDateTime(input: string): { date: string; time: string } | null {
  // 정규식을 사용하여 'YYYY.MM.DD (요일) HH:mm' 형식 매칭
  const pattern = /^(\d{4}\.\d{2}\.\d{2} \([가-힣]\)) (\d{2}:\d{2})$/;
  const match = input.match(pattern);

  if (match) {
    const date = match[1]; // 'YYYY.MM.DD (요일)' 추출
    const time = match[2]; // 'HH:mm' 추출
    return { date, time };
  }

  // 형식이 맞지 않는 경우 null 반환
  return null;
}