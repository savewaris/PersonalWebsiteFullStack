'use client';

import { Suspense, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import posthog from 'posthog-js';

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.posthog.com';

// Mirrors AnalyticsBeacon's own test-traffic rules so both trackers agree on
// what counts as "real" traffic, without either importing the other.
function isLocalOrTestTraffic() {
  if (typeof window === 'undefined') return true;
  const hostname = window.location.hostname;
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
  const urlParams = new URLSearchParams(window.location.search);
  const isTestParam = urlParams.get('test') === 'true' || urlParams.get('preview') === 'true';
  const hasAdminCookie = document.cookie.includes('admin_token=');
  return isLocalhost || isTestParam || hasAdminCookie;
}

let initialized = false;

function initPostHogOnce() {
  if (initialized || typeof window === 'undefined' || !POSTHOG_KEY) return;
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    capture_pageview: false, // captured manually below -- Next.js App Router client-side route changes don't fire posthog-js's built-in pageview capture reliably
    autocapture: true, // gives click tracking (this project's original ask) with no per-element wiring
    person_profiles: 'identified_only',
    before_send: (event) => {
      if (!event) return null;
      // Same two exclusions AnalyticsBeacon applies: admin section stays out
      // of public metrics, and localhost/test/admin-cookie traffic doesn't
      // pollute production data.
      if (window.location.pathname.startsWith('/admin')) return null;
      if (isLocalOrTestTraffic()) return null;
      return event;
    },
  });
  initialized = true;
}

function PostHogPageview() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    initPostHogOnce();
    if (!POSTHOG_KEY || !pathname) return;

    let url = window.origin + pathname;
    const search = searchParams.toString();
    if (search) url += `?${search}`;
    posthog.capture('$pageview', { $current_url: url });
  }, [pathname, searchParams]);

  return null;
}

// Additive to AnalyticsBeacon, not a replacement -- see the PR this shipped
// in for why both trackers run side by side.
export function PostHogAnalytics() {
  if (!POSTHOG_KEY) return null;
  return (
    <Suspense fallback={null}>
      <PostHogPageview />
    </Suspense>
  );
}
