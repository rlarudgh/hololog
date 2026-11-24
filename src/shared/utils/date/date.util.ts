/**
 * 'YYYY-MM-DD'(또는 ISO 문자열)을 'YYYY.MM.DD'로 바꾼다.
 * 문자열만 다뤄서 서버/클라이언트 시간대 차이로 날짜가 바뀌지 않는다.
 * 형식이 맞지 않으면 원본을 그대로 반환한다.
 *
 * @example formatPostDate('2026-01-12') // '2026.01.12'
 */
export function formatPostDate(date: string): string {
  const match = date.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return date;
  const [, year, month, day] = match;
  return `${year}.${month}.${day}`;
}
