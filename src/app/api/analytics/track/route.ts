import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

function extractHost(referrer?: string | null): string | null {
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

function parseUserAgent(ua: string): { device: string; browser: string; os: string } {
  const uaLower = ua.toLowerCase();

  // Device
  let device = 'desktop';
  if (/mobile|iphone|ipod|android.*mobile|windows phone/i.test(uaLower)) {
    device = 'mobile';
  } else if (/ipad|android(?!.*mobile)|tablet/i.test(uaLower)) {
    device = 'tablet';
  }

  // OS
  let os = 'Other';
  if (/windows/i.test(uaLower)) os = 'Windows';
  else if (/macintosh|mac os x/i.test(uaLower)) os = 'macOS';
  else if (/iphone|ipad|ipod/i.test(uaLower)) os = 'iOS';
  else if (/android/i.test(uaLower)) os = 'Android';
  else if (/linux/i.test(uaLower)) os = 'Linux';

  // Browser
  let browser = 'Other';
  if (/edg/i.test(uaLower)) browser = 'Edge';
  else if (/chrome|crios/i.test(uaLower) && !/edg/i.test(uaLower)) browser = 'Chrome';
  else if (/safari/i.test(uaLower) && !/chrome|crios/i.test(uaLower)) browser = 'Safari';
  else if (/firefox|fxios/i.test(uaLower)) browser = 'Firefox';
  else if (/opr|opera/i.test(uaLower)) browser = 'Opera';

  return { device, browser, os };
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    if (!rawBody) {
      return NextResponse.json({ ok: true });
    }

    const payload = JSON.parse(rawBody);
    const { type, path, referrer, targetUrl, eventType, elementText, sourcePath } = payload;

    const headers = request.headers;
    const clientIp =
      headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      headers.get('x-real-ip') ||
      '127.0.0.1';
    const userAgent = headers.get('user-agent') || '';
    const today = new Date().toISOString().split('T')[0];
    const salt = process.env.ADMIN_PASSWORD || 'portfolio-analytics-salt';

    // Daily salted SHA-256 hash (Zero PII stored)
    const visitorHash = crypto
      .createHash('sha256')
      .update(`${clientIp}-${userAgent}-${salt}-${today}`)
      .digest('hex')
      .substring(0, 16);

    const country =
      headers.get('x-vercel-ip-country') ||
      headers.get('cf-ipcountry') ||
      headers.get('x-country-code') ||
      null;
    const city = headers.get('x-vercel-ip-city') || null;
    const { device, browser, os } = parseUserAgent(userAgent);

    if (type === 'pageview') {
      const referrerHost = extractHost(referrer);
      await prisma.pageView.create({
        data: {
          path: path || '/',
          referrer: referrer ? referrer.slice(0, 500) : null,
          referrerHost,
          visitorHash,
          country,
          city,
          device,
          browser,
          os,
        },
      });
    } else if (type === 'click') {
      if (targetUrl) {
        await prisma.clickEvent.create({
          data: {
            targetUrl: targetUrl.slice(0, 500),
            eventType: eventType || 'outbound_link',
            elementText: elementText ? elementText.slice(0, 100) : null,
            sourcePath: sourcePath || '/',
            visitorHash,
            country,
          },
        });
      }
    }

    return NextResponse.json(
      { ok: true },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  } catch (error) {
    console.error('[ANALYTICS_TRACK_ERROR]:', error);
    // Always return 200 to ensure client beacon never fails or retries aggressively
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
