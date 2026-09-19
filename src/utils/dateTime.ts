/**
 * Standard Timezone & Formatting Utilities for TechFix Peshawar
 * Timezone: Asia/Karachi (Pakistan Standard Time, PKT, UTC+5)
 */

export const PKT_TIMEZONE = 'Asia/Karachi';

/**
 * Returns formatted 12-hour time in Pakistan Standard Time (e.g. "1:21 PM" or "1:21:25 PM")
 */
export function formatPKTTime(
  date: Date | string | number = new Date(),
  includeSeconds: boolean = false
): string {
  try {
    const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '';
    return d.toLocaleTimeString('en-US', {
      timeZone: PKT_TIMEZONE,
      hour: 'numeric',
      minute: '2-digit',
      second: includeSeconds ? '2-digit' : undefined,
      hour12: true
    });
  } catch (e) {
    return '';
  }
}

/**
 * Returns formatted Date in Pakistan Standard Time (e.g. "13 Sep 2026" or "Sep 13, 2026")
 */
export function formatPKTDate(
  date: Date | string | number = new Date(),
  style: 'short' | 'medium' | 'long' = 'medium'
): string {
  try {
    const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-US', {
      timeZone: PKT_TIMEZONE,
      year: 'numeric',
      month: style === 'short' ? 'numeric' : 'short',
      day: 'numeric'
    });
  } catch (e) {
    return '';
  }
}

/**
 * Returns full date and time in Pakistan Standard Time (e.g. "13 Sep 2026, 1:21 PM")
 */
export function formatPKTDateTime(
  date: Date | string | number = new Date(),
  includeSeconds: boolean = false
): string {
  try {
    const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '';
    const dateStr = formatPKTDate(d, 'medium');
    const timeStr = formatPKTTime(d, includeSeconds);
    return `${dateStr}, ${timeStr}`;
  } catch (e) {
    return '';
  }
}
