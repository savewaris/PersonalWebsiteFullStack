'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function AnalyticsBeacon() {
  const pathname = usePathname();

  // 1. Pageview Tracking
  useEffect(() => {
    try {
      // Do not track admin pages to keep public metrics clean
      if (pathname && pathname.startsWith('/admin')) {
        return;
      }

      const payload = {
        type: 'pageview',
        path: window.location.pathname + window.location.hash,
        referrer: document.referrer || '',
      };

      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/analytics/track', JSON.stringify(payload));
      } else {
        fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // Ignore telemetry errors
    }
  }, [pathname]);

  // 2. Delegated Outbound & Conversion Click Tracking
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      try {
        const target = (e.target as HTMLElement).closest('a, button');
        if (!target) return;

        // Skip internal admin links
        if (window.location.pathname.startsWith('/admin')) return;

        let targetUrl = '';
        let eventType = 'outbound_link';
        let elementText = target.textContent?.trim() || target.getAttribute('aria-label') || '';

        if (target.tagName.toLowerCase() === 'a') {
          const href = (target as HTMLAnchorElement).href;
          if (!href) return;
          targetUrl = href;

          // Classify event
          if (href.startsWith('mailto:')) {
            eventType = 'contact_email';
          } else if (href.includes('github.com')) {
            eventType = href.includes('/issues') ? 'project_repo' : 'social_link';
            if (href.includes('savewaris/')) eventType = 'project_repo';
          } else if (href.includes('linkedin.com')) {
            eventType = 'social_link';
          } else if (href.includes('credly.com') || href.includes('coursera.org')) {
            eventType = 'credential_verify';
          } else if (href.endsWith('.pdf') || href.includes('resume') || href.includes('cv')) {
            eventType = 'resume_download';
          } else if (href.startsWith('http') && !href.includes(window.location.host)) {
            // Outbound demo or external link
            if (elementText.toLowerCase().includes('demo') || elementText.toLowerCase().includes('live')) {
              eventType = 'project_demo';
            } else if (elementText.toLowerCase().includes('code') || elementText.toLowerCase().includes('repo')) {
              eventType = 'project_repo';
            } else {
              eventType = 'outbound_link';
            }
          } else {
            // Internal navigation
            return;
          }
        } else if (target.hasAttribute('data-track-event')) {
          eventType = target.getAttribute('data-track-event') || 'button_click';
          targetUrl = target.getAttribute('data-track-url') || window.location.href;
        } else {
          return;
        }

        const payload = {
          type: 'click',
          targetUrl,
          eventType,
          elementText: elementText.slice(0, 80),
          sourcePath: window.location.pathname + window.location.hash,
        };

        if (navigator.sendBeacon) {
          navigator.sendBeacon('/api/analytics/track', JSON.stringify(payload));
        } else {
          fetch('/api/analytics/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            keepalive: true,
          }).catch(() => {});
        }
      } catch {
        // Silently ignore
      }
    };

    document.addEventListener('click', handleClick, { capture: true });
    return () => {
      document.removeEventListener('click', handleClick, { capture: true });
    };
  }, []);

  return null;
}
