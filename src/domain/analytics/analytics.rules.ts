import crypto from 'crypto';
import type { UserAgentInfo } from './analytics.types';

/**
 * Pure domain parser for User-Agent strings.
 * Classifies device, browser, and operating system without browser-specific APIs.
 */
export function parseUserAgent(ua?: string | null): UserAgentInfo {
  if (!ua) {
    return { device: 'desktop', browser: 'Other', os: 'Other' };
  }

  const uaLower = ua.toLowerCase();

  // Device classification
  let device: 'desktop' | 'mobile' | 'tablet' = 'desktop';
  if (/mobile|iphone|ipod|android.*mobile|windows phone/i.test(uaLower)) {
    device = 'mobile';
  } else if (/ipad|android(?!.*mobile)|tablet/i.test(uaLower)) {
    device = 'tablet';
  }

  // OS classification
  let os = 'Other';
  if (/windows/i.test(uaLower)) os = 'Windows';
  else if (/macintosh|mac os x/i.test(uaLower)) os = 'macOS';
  else if (/iphone|ipad|ipod/i.test(uaLower)) os = 'iOS';
  else if (/android/i.test(uaLower)) os = 'Android';
  else if (/linux/i.test(uaLower)) os = 'Linux';

  // Browser classification
  let browser = 'Other';
  if (/edg/i.test(uaLower)) browser = 'Edge';
  else if (/chrome|crios/i.test(uaLower) && !/edg/i.test(uaLower)) browser = 'Chrome';
  else if (/safari/i.test(uaLower) && !/chrome|crios/i.test(uaLower)) browser = 'Safari';
  else if (/firefox|fxios/i.test(uaLower)) browser = 'Firefox';
  else if (/opr|opera/i.test(uaLower)) browser = 'Opera';

  return { device, browser, os };
}

/**
 * Extracts and normalizes external referrer domains (e.g. linkedin.com, github.com).
 */
export function extractReferrerHost(referrer?: string | null): string | null {
  if (!referrer || !referrer.trim()) return null;
  try {
    const url = new URL(referrer);
    const host = url.hostname.toLowerCase().replace(/^www\./, '');
    if (host.includes('linkedin')) return 'linkedin.com';
    if (host.includes('github')) return 'github.com';
    if (host.includes('google')) return 'google.com';
    if (host.includes('twitter') || host === 't.co' || host.includes('x.com')) return 'x.com';
    if (host.includes('facebook') || host.includes('fb.')) return 'facebook.com';
    if (host.includes('instagram')) return 'instagram.com';
    if (host.includes('reddit')) return 'reddit.com';
    if (host.includes('youtube')) return 'youtube.com';
    return host;
  } catch {
    return 'Direct / Bookmark';
  }
}

/**
 * Generates an anonymous, deterministic SHA-256 hash from IP address for session tracking.
 */
export function generateIpHash(ip: string, salt: string = 'personal-website'): string {
  return crypto.createHash('sha256').update(`${ip}-${salt}`).digest('hex');
}
