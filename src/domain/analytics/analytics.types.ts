/**
 * Domain types for Analytics entities and events.
 * Framework-agnostic and decoupled from web routing.
 */

export interface UserAgentInfo {
  device: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
}

export interface AnalyticsTrackPayload {
  eventType?: 'PAGE_VIEW' | 'CLICK' | 'INTERACTION';
  path: string;
  referrer?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, unknown>;
}

export interface AnalyticsSessionRecord {
  id: string;
  sessionId: string;
  ipHash: string;
  device: string;
  browser: string;
  os: string;
  country?: string | null;
  city?: string | null;
  referrerHost?: string | null;
  firstSeen: Date;
  lastSeen: Date;
}
