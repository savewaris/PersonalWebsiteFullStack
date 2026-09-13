import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { parseUserAgent, extractReferrerHost, classifyTraffic } from '@/domain/analytics';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    if (!rawBody) {
      return NextResponse.json({ ok: true });
    }

    const payload = JSON.parse(rawBody);
    const {
      type,
      path,
      referrer,
      targetUrl,
      eventType,
      elementText,
      sourcePath,
      hostname,
      isTestFlag,
    } = payload;

    const headers = request.headers;
    const clientIp =
      headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      headers.get('x-real-ip') ||
      '127.0.0.1';
    const userAgent = headers.get('user-agent') || '';
    const origin = headers.get('origin') || headers.get('host') || '';
    const cookieHeader = headers.get('cookie') || '';
    const hasAdminSession = cookieHeader.includes('admin_token=');

    // Run multi-signal domain classifier
    const { trafficType, isTest } = classifyTraffic({
      hostname: hostname || origin,
      userAgent,
      clientIp,
      hasAdminSession,
      isTestFlag: Boolean(isTestFlag),
      origin,
    });

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
      const referrerHost = extractReferrerHost(referrer);
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
          isTest,
          trafficType,
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
            isTest,
            trafficType,
          },
        });
      }
    }

    return NextResponse.json(
      { ok: true, trafficType },
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
