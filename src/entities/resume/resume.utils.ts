/**
 * Calculate age from birth date
 * @param birthDate - Birth date in YYYY-MM-DD format
 * @returns Age in years
 */
export function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

/**
 * Format date to Korean format
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Formatted date string (e.g., "2024년 1월")
 */
export function formatDateKorean(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  return `${year}년 ${month}월`;
}

/**
 * Calculate work duration
 * @param startDate - Start date in YYYY-MM-DD format
 * @param endDate - End date in YYYY-MM-DD format (null if currently working)
 * @returns Duration string (e.g., "2년 3개월", "재직 중")
 */
export function calculateWorkDuration(
  startDate: string,
  endDate?: string | null,
): string {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }

  if (!endDate) {
    if (years > 0 && months > 0) {
      return `${years}년 ${months}개월 (재직 중)`;
    } else if (years > 0) {
      return `${years}년 (재직 중)`;
    } else {
      return `${months}개월 (재직 중)`;
    }
  }

  if (years > 0 && months > 0) {
    return `${years}년 ${months}개월`;
  } else if (years > 0) {
    return `${years}년`;
  } else {
    return `${months}개월`;
  }
}
