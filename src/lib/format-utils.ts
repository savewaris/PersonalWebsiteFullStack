/**
 * Safe formatting utilities for resilient rendering across Client & Server components.
 */

/**
 * Safely formats any date-like input (Date object, string, or number) into a human-readable month/year or localized string.
 * Never throws RangeError: Invalid time value.
 */
export function formatSafeDate(
  dateInput: string | Date | number | null | undefined,
  options: Intl.DateTimeFormatOptions = { month: 'short', year: 'numeric' },
  fallback = 'Present'
): string {
  if (!dateInput) return fallback;

  try {
    const d = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) {
      return fallback;
    }
    return d.toLocaleDateString('en-US', options);
  } catch {
    return fallback;
  }
}

/**
 * Safely extracts the year from a date-like input without crashing on invalid values.
 */
export function getSafeYear(
  dateInput: string | Date | number | null | undefined,
  fallback = 'Present'
): string {
  if (!dateInput) return fallback;

  try {
    const d = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) {
      return fallback;
    }
    return String(d.getFullYear());
  } catch {
    return fallback;
  }
}
