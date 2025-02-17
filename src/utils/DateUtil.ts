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