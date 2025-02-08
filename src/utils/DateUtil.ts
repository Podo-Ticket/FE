export class DateUtil {
    /**
     * Formats an ISO date string into 'YYYY.MM.DD'.
     * @param isoDate - ISO 8601 date string (e.g., '2025-01-12T04:07:29.928354')
     * @returns Formatted date string in 'YYYY.MM.DD' format.
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
  
        return `${year}.${month}.${day}`;
      } catch (error) {
        console.error("Error formatting date:", error);
        throw error;
      }
    }
  }
  
  // Example usage:
  const formattedDate = DateUtil.formatDate("2025-01-12T04:07:29.928354");
  console.log(formattedDate); // Output: '2025.01.12'