import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuthSession, apiSuccess, apiError } from '@/lib/api-utils';

export async function GET(request: Request) {
  const authError = await requireAuthSession();
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '30d';

    let startDate: Date;
    const now = new Date();

    if (range === '7d') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (range === '90d') {
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    } else if (range === 'all') {
      startDate = new Date(0);
    } else {
      // Default 30d
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const whereClause = {
      createdAt: { gte: startDate },
    };

    // Parallel fetch
    const [
      pageViews,
      clicks,
      recentPageViews,
      recentClicks,
    ] = await Promise.all([
      prisma.pageView.findMany({
        where: whereClause,
        select: {
          id: true,
          path: true,
          referrerHost: true,
          visitorHash: true,
          country: true,
          device: true,
          browser: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'asc' },
      }),
      prisma.clickEvent.findMany({
        where: whereClause,
        select: {
          id: true,
          targetUrl: true,
          eventType: true,
          elementText: true,
          sourcePath: true,
          visitorHash: true,
          country: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'asc' },
      }),
      prisma.pageView.findMany({
        take: 15,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          path: true,
          referrerHost: true,
          country: true,
          device: true,
          browser: true,
          createdAt: true,
        },
      }),
      prisma.clickEvent.findMany({
        take: 15,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          targetUrl: true,
          eventType: true,
          elementText: true,
          country: true,
          createdAt: true,
        },
      }),
    ]);

    const totalViews = pageViews.length;
    const uniqueVisitorHashes = new Set(pageViews.map((p) => p.visitorHash));
    const uniqueVisitors = uniqueVisitorHashes.size;
    const totalClicks = clicks.length;

    // Day-by-Day Timeseries Map
    const timeseriesMap: Record<string, { date: string; views: number; visitors: Set<string>; clicks: number }> = {};

    // Populate all dates in range
    const daysCount = range === '7d' ? 7 : range === '90d' ? 90 : range === 'all' ? 30 : 30;
    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateKey = d.toISOString().split('T')[0];
      timeseriesMap[dateKey] = {
        date: dateKey,
        views: 0,
        visitors: new Set(),
        clicks: 0,
      };
    }

    pageViews.forEach((pv) => {
      const dateKey = pv.createdAt.toISOString().split('T')[0];
      if (!timeseriesMap[dateKey]) {
        timeseriesMap[dateKey] = { date: dateKey, views: 0, visitors: new Set(), clicks: 0 };
      }
      timeseriesMap[dateKey].views += 1;
      timeseriesMap[dateKey].visitors.add(pv.visitorHash);
    });

    clicks.forEach((clk) => {
      const dateKey = clk.createdAt.toISOString().split('T')[0];
      if (!timeseriesMap[dateKey]) {
        timeseriesMap[dateKey] = { date: dateKey, views: 0, visitors: new Set(), clicks: 0 };
      }
      timeseriesMap[dateKey].clicks += 1;
    });

    const timeseries = Object.values(timeseriesMap).map((entry) => ({
      date: entry.date,
      views: entry.views,
      visitors: entry.visitors.size,
      clicks: entry.clicks,
    }));

    // Top Referrers
    const referrerCounts: Record<string, number> = {};
    pageViews.forEach((pv) => {
      const host = pv.referrerHost || 'Direct / Bookmark';
      referrerCounts[host] = (referrerCounts[host] || 0) + 1;
    });
    const topReferrers = Object.entries(referrerCounts)
      .map(([host, count]) => ({
        host,
        count,
        percentage: totalViews > 0 ? Math.round((count / totalViews) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // Top Clicked Links
    const clickCounts: Record<string, { targetUrl: string; eventType: string; elementText: string; count: number }> = {};
    clicks.forEach((c) => {
      const key = `${c.targetUrl}-${c.eventType}`;
      if (!clickCounts[key]) {
        clickCounts[key] = {
          targetUrl: c.targetUrl,
          eventType: c.eventType,
          elementText: c.elementText || c.targetUrl,
          count: 0,
        };
      }
      clickCounts[key].count += 1;
    });
    const topClickedLinks = Object.values(clickCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Geographic Countries
    const countryCounts: Record<string, number> = {};
    pageViews.forEach((pv) => {
      const c = pv.country || 'Unknown';
      countryCounts[c] = (countryCounts[c] || 0) + 1;
    });
    const countries = Object.entries(countryCounts)
      .map(([country, count]) => ({
        country,
        count,
        percentage: totalViews > 0 ? Math.round((count / totalViews) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Devices & Browsers
    const deviceCounts: Record<string, number> = {};
    const browserCounts: Record<string, number> = {};
    pageViews.forEach((pv) => {
      const dev = pv.device || 'desktop';
      const brw = pv.browser || 'Other';
      deviceCounts[dev] = (deviceCounts[dev] || 0) + 1;
      browserCounts[brw] = (browserCounts[brw] || 0) + 1;
    });

    const devices = Object.entries(deviceCounts).map(([device, count]) => ({
      device,
      count,
      percentage: totalViews > 0 ? Math.round((count / totalViews) * 100) : 0,
    }));

    const browsers = Object.entries(browserCounts).map(([browser, count]) => ({
      browser,
      count,
      percentage: totalViews > 0 ? Math.round((count / totalViews) * 100) : 0,
    }));

    // Combined Live Feed
    const combinedFeed = [
      ...recentPageViews.map((pv) => ({
        id: pv.id,
        kind: 'pageview' as const,
        title: `Viewed page: ${pv.path}`,
        subtitle: `via ${pv.referrerHost || 'Direct'} • ${pv.browser || 'Browser'} on ${pv.device || 'desktop'}`,
        country: pv.country,
        createdAt: pv.createdAt,
      })),
      ...recentClicks.map((c) => ({
        id: c.id,
        kind: 'click' as const,
        title: `Clicked ${c.eventType.replace(/_/g, ' ')}: "${c.elementText || c.targetUrl}"`,
        subtitle: `Target: ${c.targetUrl}`,
        country: c.country,
        createdAt: c.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 20);

    return apiSuccess({
      range,
      summary: {
        totalViews,
        uniqueVisitors,
        totalClicks,
        topReferrer: topReferrers[0]?.host || 'Direct / Bookmark',
        topCountry: countries[0]?.country || 'Unknown',
      },
      timeseries,
      topReferrers,
      topClickedLinks,
      countries,
      devices,
      browsers,
      recentFeed: combinedFeed,
    });
  } catch (error: any) {
    console.error('[ANALYTICS_STATS_ERROR]:', error);
    return apiError(error.message || 'Failed to compute analytics stats', 500);
  }
}
