'use client';

import { useState, useEffect } from 'react';
import {
  FaChartLine,
  FaUsers,
  FaMousePointer,
  FaGlobeAmericas,
  FaLaptop,
  FaChrome,
  FaSyncAlt,
  FaExternalLinkAlt,
} from 'react-icons/fa';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { PortfolioIcon } from '@/components/PortfolioIcon';
import styles from './Analytics.module.css';

interface AnalyticsData {
  range: string;
  summary: {
    totalViews: number;
    uniqueVisitors: number;
    totalClicks: number;
    topReferrer: string;
    topCountry: string;
  };
  timeseries: Array<{
    date: string;
    views: number;
    visitors: number;
    clicks: number;
  }>;
  topReferrers: Array<{
    host: string;
    count: number;
    percentage: number;
  }>;
  topClickedLinks: Array<{
    targetUrl: string;
    eventType: string;
    elementText: string;
    count: number;
  }>;
  countries: Array<{
    country: string;
    count: number;
    percentage: number;
  }>;
  devices: Array<{
    device: string;
    count: number;
    percentage: number;
  }>;
  browsers: Array<{
    browser: string;
    count: number;
    percentage: number;
  }>;
  recentFeed: Array<{
    id: string;
    kind: 'pageview' | 'click';
    title: string;
    subtitle: string;
    country: string | null;
    createdAt: string;
  }>;
}

export default function AnalyticsClient({ initialData }: { initialData: AnalyticsData }) {
  const [data, setData] = useState<AnalyticsData>(initialData);
  const [range, setRange] = useState<string>(initialData.range || '30d');
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<{ date: string; views: number; visitors: number; clicks: number } | null>(null);

  const fetchStats = async (selectedRange: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/analytics/stats?range=${selectedRange}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRangeChange = (newRange: string) => {
    setRange(newRange);
    fetchStats(newRange);
  };

  // Auto-refresh stats every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchStats(range);
    }, 30000);
    return () => clearInterval(interval);
  }, [range]);

  const maxViews = Math.max(...data.timeseries.map((t) => t.views), 1);

  const formatRelativeTime = (isoString: string) => {
    const diffSec = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
    if (diffSec < 60) return `${diffSec}s ago`;
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    return `${Math.floor(diffSec / 86400)}d ago`;
  };

  return (
    <div className={styles.container}>
      <AdminPageHeader
        title="Visitor Analytics & Telemetry"
        description="Cookieless, privacy-friendly telemetry capturing pageviews, referrers, and outbound conversion clicks."
      >
        <button
          type="button"
          onClick={() => fetchStats(range)}
          disabled={isLoading}
          className={styles.rangeButton}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <FaSyncAlt className={isLoading ? styles.spinning : ''} /> {isLoading ? 'Refreshing...' : 'Refresh'}
        </button>
      </AdminPageHeader>

      {/* Range Selector Bar */}
      <div className={styles.rangeBar}>
        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', fontWeight: 500 }}>
          Telemetry Timeframe
        </div>
        <div className={styles.rangeGroup}>
          {['7d', '30d', '90d', 'all'].map((r) => (
            <button
              key={r}
              type="button"
              className={`${styles.rangeButton} ${range === r ? styles.rangeButtonActive : ''}`}
              onClick={() => handleRangeChange(r)}
            >
              {r === '7d' ? 'Last 7 Days' : r === '30d' ? 'Last 30 Days' : r === '90d' ? 'Last 90 Days' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI Metric Cards */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>
            <span>Total Pageviews</span>
            <FaChartLine />
          </div>
          <div className={styles.statValue}>{data.summary.totalViews.toLocaleString()}</div>
          <div className={styles.statSubtext}>Across all portfolio routes</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statLabel}>
            <span>Unique Visitors</span>
            <FaUsers />
          </div>
          <div className={styles.statValue}>{data.summary.uniqueVisitors.toLocaleString()}</div>
          <div className={styles.statSubtext}>Daily salted hash (0 cookies)</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statLabel}>
            <span>Outbound Clicks</span>
            <FaMousePointer />
          </div>
          <div className={styles.statValue}>{data.summary.totalClicks.toLocaleString()}</div>
          <div className={styles.statSubtext}>Demos, GitHub, and Resumes</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statLabel}>
            <span>Top Traffic Source</span>
            <FaGlobeAmericas />
          </div>
          <div className={styles.statValue} style={{ fontSize: 'var(--font-size-lg)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {data.summary.topReferrer}
          </div>
          <div className={styles.statSubtext}>Top inbound channel</div>
        </div>
      </div>

      {/* Bento Grid Visualizations */}
      <div className={styles.bentoGrid}>
        {/* 1. Timeseries Traffic Chart */}
        <div className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>
              <FaChartLine /> Traffic & Engagement Trends
            </div>
            {hoveredPoint ? (
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--accent-primary)', fontWeight: 600 }}>
                {hoveredPoint.date}: {hoveredPoint.views} views • {hoveredPoint.visitors} visitors • {hoveredPoint.clicks} clicks
              </div>
            ) : (
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                Hover bars to inspect daily metrics
              </div>
            )}
          </div>

          <div className={styles.chartArea}>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                height: '100%',
                gap: data.timeseries.length > 30 ? '3px' : '8px',
                paddingTop: '20px',
              }}
            >
              {data.timeseries.map((point) => {
                const heightPercent = Math.max((point.views / maxViews) * 100, 4);
                return (
                  <div
                    key={point.date}
                    onMouseEnter={() => setHoveredPoint(point)}
                    onMouseLeave={() => setHoveredPoint(null)}
                    style={{
                      flex: 1,
                      height: `${heightPercent}%`,
                      background: 'var(--accent-primary)',
                      borderRadius: '4px 4px 0 0',
                      opacity: hoveredPoint?.date === point.date ? 1 : 0.8,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      position: 'relative',
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* 2. Top Referrers */}
        <div className={styles.halfCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>
              <FaGlobeAmericas /> Inbound Traffic Sources
            </div>
          </div>
          {data.topReferrers.length === 0 ? (
            <div className={styles.emptyState}>No referral data captured in this timeframe.</div>
          ) : (
            <div className={styles.listGroup}>
              {data.topReferrers.map((ref) => (
                <div key={ref.host} className={styles.listItem}>
                  <div className={styles.itemLeft}>
                    <PortfolioIcon name={ref.host} icon={ref.host.split('.')[0]} size={14} />
                    <span className={styles.itemText}>{ref.host}</span>
                  </div>
                  <div className={styles.itemRight}>
                    <div className={styles.progressBarContainer}>
                      <div className={styles.progressBar} style={{ width: `${ref.percentage}%` }} />
                    </div>
                    <span>{ref.count} ({ref.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. Top Clicked Outbound Conversions */}
        <div className={styles.halfCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>
              <FaMousePointer /> Outbound Clicks & Conversions
            </div>
          </div>
          {data.topClickedLinks.length === 0 ? (
            <div className={styles.emptyState}>No link clicks recorded in this timeframe.</div>
          ) : (
            <div className={styles.listGroup}>
              {data.topClickedLinks.map((link, idx) => (
                <div key={idx} className={styles.listItem}>
                  <div className={styles.itemLeft}>
                    <span className={styles.tagBadge}>{link.eventType.replace(/_/g, ' ')}</span>
                    <span className={styles.itemText} title={link.targetUrl}>
                      {link.elementText || link.targetUrl}
                    </span>
                  </div>
                  <div className={styles.itemRight}>
                    <a
                      href={link.targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--text-muted)', display: 'inline-flex' }}
                    >
                      <FaExternalLinkAlt size={10} />
                    </a>
                    <span>{link.count} clicks</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. Geographic Countries */}
        <div className={styles.halfCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>
              <FaGlobeAmericas /> Geographic Country Distribution
            </div>
          </div>
          {data.countries.length === 0 ? (
            <div className={styles.emptyState}>No geographic headers detected.</div>
          ) : (
            <div className={styles.listGroup}>
              {data.countries.map((c) => (
                <div key={c.country} className={styles.listItem}>
                  <div className={styles.itemLeft}>
                    <span style={{ fontSize: '1rem' }}>🌍</span>
                    <span className={styles.itemText}>{c.country}</span>
                  </div>
                  <div className={styles.itemRight}>
                    <div className={styles.progressBarContainer}>
                      <div className={styles.progressBar} style={{ width: `${c.percentage}%` }} />
                    </div>
                    <span>{c.count} ({c.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 5. Devices & Browsers */}
        <div className={styles.halfCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>
              <FaLaptop /> Devices & Browsers
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginBottom: '6px' }}>
                DEVICE TYPE
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {data.devices.map((d) => (
                  <div key={d.device} className={styles.listItem} style={{ flex: 1, minWidth: '120px' }}>
                    <span style={{ textTransform: 'capitalize' }}>{d.device}</span>
                    <strong>{d.percentage}%</strong>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginBottom: '6px' }}>
                BROWSER
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {data.browsers.map((b) => (
                  <div key={b.browser} className={styles.listItem} style={{ flex: 1, minWidth: '120px' }}>
                    <span>{b.browser}</span>
                    <strong>{b.percentage}%</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 6. Real-Time Live Activity Feed */}
        <div className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>
              <div className={styles.livePulse} /> Real-Time Live Activity Feed
            </div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: '#10b981', fontWeight: 600 }}>
              Live Telemetry Stream
            </div>
          </div>

          {data.recentFeed.length === 0 ? (
            <div className={styles.emptyState}>No activity captured yet. Visit the website to generate live telemetry.</div>
          ) : (
            <div className={styles.liveFeedList}>
              {data.recentFeed.map((item) => (
                <div key={item.id} className={styles.liveFeedItem}>
                  <div className={styles.livePulse} />
                  <div className={styles.feedContent}>
                    <div className={styles.feedTitle}>{item.title}</div>
                    <div className={styles.feedSubtitle}>
                      {item.subtitle} {item.country ? `• 🌍 ${item.country}` : ''}
                    </div>
                  </div>
                  <div className={styles.feedTime}>{formatRelativeTime(item.createdAt)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
