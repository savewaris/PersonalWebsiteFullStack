/**
 * Pure Domain Traffic Classifier
 * Classifies telemetry hits into 'real' | 'test' | 'bot' without side effects.
 */

export interface TrafficClassifierInput {
  hostname?: string | null;
  userAgent?: string | null;
  clientIp?: string | null;
  hasAdminSession?: boolean;
  isTestFlag?: boolean;
  origin?: string | null;
}

export interface TrafficClassificationResult {
  trafficType: 'real' | 'test' | 'bot';
  isTest: boolean;
  reason: string;
}

const TEST_RUNNER_PATTERNS = [
  /playwright/i,
  /cypress/i,
  /headlesschrome/i,
  /selenium/i,
  /puppeteer/i,
  /postmanruntime/i,
  /insomnia/i,
];

const BOT_PATTERNS = [
  /googlebot/i,
  /bingbot/i,
  /yandexbot/i,
  /duckduckbot/i,
  /baiduspider/i,
  /slurp/i,
  /twitterbot/i,
  /facebookexternalhit/i,
  /linkedinbot/i,
  /embedly/i,
  /quora link preview/i,
  /showyoubot/i,
  /outbrain/i,
  /pinterest\/0\./i,
  /developers\.google\.com\/\+\/web\/snippet/i,
  /slackbot/i,
  /vkshare/i,
  /w3c_validator/i,
  /redditbot/i,
  /applebot/i,
  /whatsapp/i,
  /flipboard/i,
  /tumblr/i,
  /bitlybot/i,
  /skypeuripreview/i,
  /nuzzel/i,
  /discordbot/i,
  /qwantify/i,
  /pinterestbot/i,
  /bitrix link preview/i,
  /xing-contenttabreceiver/i,
  /chrome-lighthouse/i,
  /lighthouse/i,
  /spider/i,
  /crawl/i,
  /bot\b/i,
];

export function classifyTraffic(input: TrafficClassifierInput): TrafficClassificationResult {
  const ua = input.userAgent || '';
  const host = (input.hostname || '').toLowerCase();
  const ip = input.clientIp || '';

  // 1. Explicit Test Flag
  if (input.isTestFlag) {
    return { trafficType: 'test', isTest: true, reason: 'Explicit test flag provided' };
  }

  // 2. Localhost / Local Development
  if (
    host.includes('localhost') ||
    host.includes('127.0.0.1') ||
    ip === '127.0.0.1' ||
    ip === '::1'
  ) {
    return { trafficType: 'test', isTest: true, reason: 'Localhost development traffic' };
  }

  // 3. Active Admin Session (Browsing while logged into Admin CMS)
  if (input.hasAdminSession) {
    return { trafficType: 'test', isTest: true, reason: 'Authenticated admin session' };
  }

  // 4. Automated E2E Test Runners (Playwright, Cypress, HeadlessChrome)
  for (const pattern of TEST_RUNNER_PATTERNS) {
    if (pattern.test(ua)) {
      return { trafficType: 'test', isTest: true, reason: `Automated test runner detected: ${pattern}` };
    }
  }

  // 5. Automated Web Crawlers & Scrapers
  for (const pattern of BOT_PATTERNS) {
    if (pattern.test(ua)) {
      return { trafficType: 'bot', isTest: false, reason: `Web crawler/bot detected: ${pattern}` };
    }
  }

  // 6. Genuine External Visitor
  return { trafficType: 'real', isTest: false, reason: 'Genuine public visitor' };
}
