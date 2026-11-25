/** All stored timestamps are ISO 8601 UTC strings; the user's zone is kept separately by the client. */
export function nowISO(): string {
  return new Date().toISOString();
}

/** Local calendar day used for the one-check-in-per-day rule (data contract §4.5). */
export function localCalendarDay(isoDate: string, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(isoDate));

  const value = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return `${value("year")}-${value("month")}-${value("day")}`;
}
