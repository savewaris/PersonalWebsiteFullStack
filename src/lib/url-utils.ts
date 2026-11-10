/**
 * Client-safe URL normalization utilities
 */
export function ensureHttps(url?: string | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('#') ||
    // Site-relative path (e.g. /uploads/certificates/x.pdf); "//host" is protocol-relative, so excluded
    (trimmed.startsWith('/') && !trimmed.startsWith('//'))
  ) {
    return trimmed;
  }
  return `https://${trimmed}`;
}
