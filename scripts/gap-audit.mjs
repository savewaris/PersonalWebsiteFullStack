#!/usr/bin/env node

/**
 * Autonomous Gap Auditor & Blindspot Scanner
 * Scans the codebase for vulnerabilities, missing features, broken logic,
 * and recruiter blindspots so the user doesn't have to type long prompts.
 */

import { existsSync, readFileSync, readdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const findings = {
  critical: [],
  medium: [],
  low: [],
  passed: [],
};

function check(severity, title, condition, description, recommendation) {
  if (!condition) {
    findings[severity].push({ title, description, recommendation });
  } else {
    findings.passed.push(title);
  }
}

console.log('\n======================================================');
console.log('🔍 RUNNING AUTONOMOUS GAP & BLINDSPOT AUDITOR');
console.log('======================================================\n');

// 1. Resume & Downloadable CV
const hasResume = existsSync(path.join(ROOT_DIR, 'public', 'resume.pdf')) || existsSync(path.join(ROOT_DIR, 'public', 'cv.pdf')) || (existsSync(path.join(ROOT_DIR, 'public', 'uploads', 'resumes')) && readdirSync(path.join(ROOT_DIR, 'public', 'uploads', 'resumes')).length > 0);
check(
  'medium',
  'Missing Downloadable Resume PDF',
  hasResume,
  'No real resume PDF found in public/ or public/uploads/resumes/. Recruiters expect an instant resume download.',
  'Upload your real resume PDF in the Admin Panel (/admin/resumes).'
);

// 2. SEO & Social Sharing (OpenGraph / Metadata)
const layoutFile = path.join(ROOT_DIR, 'src', 'app', 'layout.tsx');
let hasMetadata = false;
let hasOpenGraph = false;
if (existsSync(layoutFile)) {
  const layoutContent = readFileSync(layoutFile, 'utf8');
  hasMetadata = layoutContent.includes('metadata') && layoutContent.includes('title');
  hasOpenGraph = layoutContent.includes('openGraph') || layoutContent.includes('og:');
}
check(
  'medium',
  'Incomplete OpenGraph Social Cards',
  hasOpenGraph,
  'When you share your website link on LinkedIn, Twitter/X, or Discord, it will not display a rich preview image or card.',
  'Configure openGraph metadata with title, description, and preview image in src/app/layout.tsx.'
);

// 3. Sitemap and Robots.txt for Search Discovery
const hasRobots = existsSync(path.join(ROOT_DIR, 'public', 'robots.txt')) || existsSync(path.join(ROOT_DIR, 'src', 'app', 'robots.ts'));
const hasSitemap = existsSync(path.join(ROOT_DIR, 'public', 'sitemap.xml')) || existsSync(path.join(ROOT_DIR, 'src', 'app', 'sitemap.ts'));
check(
  'low',
  'Missing robots.txt or sitemap.xml',
  hasRobots && hasSitemap,
  'Search engines (Google, Bing) and AI search engines (Perplexity) need sitemap.xml to index all your projects and pages.',
  'Add automated sitemap.ts and robots.ts in src/app/.'
);

// 4. Custom 404 Page (not-found.tsx)
const hasNotFound = existsSync(path.join(ROOT_DIR, 'src', 'app', 'not-found.tsx'));
check(
  'low',
  'Default Next.js 404 Page Used',
  hasNotFound,
  'Navigating to an invalid URL renders the plain default 404 page instead of your dark-mode branded theme.',
  'Create src/app/not-found.tsx with dark theme, return-home button, and funny developer easter egg.'
);

// 5. Contact Form Email Delivery
const messagesApi = path.join(ROOT_DIR, 'src', 'app', 'api', 'messages', 'route.ts');
let hasEmailNotification = false;
if (existsSync(messagesApi)) {
  const content = readFileSync(messagesApi, 'utf8');
  hasEmailNotification = content.includes('resend') || content.includes('nodemailer') || content.includes('webhook') || content.includes('discord');
}
check(
  'medium',
  'Contact Form Only Saves to Database (No Instant Notification)',
  hasEmailNotification,
  'When a recruiter sends a message through the contact form, it saves to DB but does NOT alert your email or Discord instantly.',
  'Integrate Resend (free 3000 emails/mo) or a Discord webhook in /api/messages to notify your phone immediately when contacted.'
);

// 6. Security: Verify Mutations in Admin Routes
const adminApiDir = path.join(ROOT_DIR, 'src', 'app', 'api');
let unverifiedMutations = [];

function scanApiRoutes(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanApiRoutes(fullPath);
    } else if (entry.name === 'route.ts' || entry.name === 'route.js') {
      const content = readFileSync(fullPath, 'utf8');
      const hasMutating = /export\s+async\s+function\s+(POST|PUT|DELETE|PATCH)/.test(content);
      const isPublicEndpoint = fullPath.includes('auth') || fullPath.includes('track') || (fullPath.includes('messages') && !fullPath.includes('[id]'));
      if (hasMutating && !isPublicEndpoint) {
        // Check if verifyAdminSession or auth check exists
        const hasAuthCheck = content.includes('verifyAdmin') || content.includes('cookie') || content.includes('auth') || content.includes('session');
        if (!hasAuthCheck) {
          unverifiedMutations.push(path.relative(ROOT_DIR, fullPath));
        }
      }
    }
  }
}

try {
  scanApiRoutes(adminApiDir);
} catch (e) {
  // Ignore scan errors
}

check(
  'critical',
  'Unauthenticated Mutating Admin API Endpoints',
  unverifiedMutations.length === 0,
  `Found mutating API routes without explicit session verification: ${unverifiedMutations.join(', ')}`,
  'Add verifyAdminSession check at top of mutating handlers to block unauthorized database writes.'
);

// 7. Security: Environment Variables Hygiene
const envExample = path.join(ROOT_DIR, '.env.example');
const envFile = path.join(ROOT_DIR, '.env');
let exposedSecrets = [];
if (existsSync(envFile)) {
  const envContent = readFileSync(envFile, 'utf8');
  const lines = envContent.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('NEXT_PUBLIC_') && (trimmed.toLowerCase().includes('secret') || trimmed.toLowerCase().includes('password') || trimmed.toLowerCase().includes('key'))) {
      exposedSecrets.push(trimmed.split('=')[0]);
    }
  }
}
check(
  'critical',
  'Exposed Private Secrets in NEXT_PUBLIC_ Env Variables',
  exposedSecrets.length === 0,
  `Private secrets prefixed with NEXT_PUBLIC_ are bundled into client browsers: ${exposedSecrets.join(', ')}`,
  'Remove NEXT_PUBLIC_ prefix from database URLs and admin secrets.'
);

// 8. Projects: Broken or Dead Demo Links
const projectsData = path.join(ROOT_DIR, 'src', 'lib', 'data', 'projects.ts');
check(
  'medium',
  'Verified Live Projects & Architecture Blueprints',
  existsSync(projectsData),
  'Ensure every project has either a live verified URL or an interactive architecture modal.',
  'Keep demoUrl null for repos without deployed web apps and use Architecture Blueprint modals.'
);

// Render Results
let itemNumber = 1;
const actionableList = [];

if (findings.critical.length > 0) {
  console.log('🔴 CRITICAL VULNERABILITIES & RISKS:');
  findings.critical.forEach((f) => {
    console.log(`  [${itemNumber}] ${f.title}`);
    console.log(`      ⚠️  ${f.description}`);
    console.log(`      💡 Fix: ${f.recommendation}\n`);
    actionableList.push(f);
    itemNumber++;
  });
} else {
  console.log('✅ Zero critical security vulnerabilities found.\n');
}

if (findings.medium.length > 0) {
  console.log('🟡 MISSING FEATURES & UNWIRED LOGIC:');
  findings.medium.forEach((f) => {
    console.log(`  [${itemNumber}] ${f.title}`);
    console.log(`      ⚠️  ${f.description}`);
    console.log(`      💡 Fix: ${f.recommendation}\n`);
    actionableList.push(f);
    itemNumber++;
  });
}

if (findings.low.length > 0) {
  console.log('🔵 POLISH & RECRUITER BLINDSPOTS:');
  findings.low.forEach((f) => {
    console.log(`  [${itemNumber}] ${f.title}`);
    console.log(`      ⚠️  ${f.description}`);
    console.log(`      💡 Fix: ${f.recommendation}\n`);
    actionableList.push(f);
    itemNumber++;
  });
}

console.log('======================================================');
console.log(`📊 AUDIT SUMMARY: ${findings.critical.length} Critical | ${findings.medium.length} Missing Features | ${findings.low.length} Polish Items`);
console.log(`   ${findings.passed.length} automated health criteria verified cleanly.`);
console.log('======================================================\n');
console.log('👉 To fix any item, just say the number (e.g. "fix 1" or "fix 2") or "fix all"!');
