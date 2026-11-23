/**
 * Returns the user's local calendar date as `YYYY-MM-DD`.
 *
 * "Today" is always the user's local date, computed on the client and passed
 * explicitly to the server (e.g. `return_overdue_captures(today)`).
 * Never use `toISOString()` for this: it converts to UTC and can shift the day.
 */
export function toLocalISODate(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
