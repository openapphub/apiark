/**
 * Locale-aware formatting utilities using Intl APIs.
 * These adapt automatically to the user's system locale.
 */

const locale = navigator.language || "en-US";

const dateFormatter = new Intl.DateTimeFormat(locale, {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

const dateShortFormatter = new Intl.DateTimeFormat(locale, {
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const relativeFormatter = new Intl.RelativeTimeFormat(locale, {
  numeric: "auto",
});

const numberFormatter = new Intl.NumberFormat(locale);

const bytesFormatter = new Intl.NumberFormat(locale, {
  maximumFractionDigits: 1,
});

/** Format a date string or Date to locale date-time. */
export function formatDateTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return dateFormatter.format(d);
}

/** Format a date string or Date to short date-time. */
export function formatDateTimeShort(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return dateShortFormatter.format(d);
}

/** Format a number with locale grouping (e.g. 1,234,567). */
export function formatNumber(n: number): string {
  return numberFormatter.format(n);
}

/** Format bytes to human-readable size. */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${bytesFormatter.format(bytes / 1024)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${bytesFormatter.format(bytes / (1024 * 1024))} MB`;
  return `${bytesFormatter.format(bytes / (1024 * 1024 * 1024))} GB`;
}

/** Format milliseconds to human-readable duration. */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60_000) return `${bytesFormatter.format(ms / 1000)}s`;
  const minutes = Math.floor(ms / 60_000);
  const seconds = Math.round((ms % 60_000) / 1000);
  return `${minutes}m ${seconds}s`;
}

/** Format a relative time (e.g. "2 hours ago"). */
export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const diffMs = d.getTime() - Date.now();
  const diffSecs = Math.round(diffMs / 1000);

  if (Math.abs(diffSecs) < 60) return relativeFormatter.format(diffSecs, "second");
  const diffMins = Math.round(diffSecs / 60);
  if (Math.abs(diffMins) < 60) return relativeFormatter.format(diffMins, "minute");
  const diffHours = Math.round(diffMins / 60);
  if (Math.abs(diffHours) < 24) return relativeFormatter.format(diffHours, "hour");
  const diffDays = Math.round(diffHours / 24);
  return relativeFormatter.format(diffDays, "day");
}
