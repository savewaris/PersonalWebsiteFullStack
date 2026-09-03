#!/usr/bin/env node

/**
 * 1-Click Interactive Browser Authentication & Session Capture
 * 
 * Opens a visible browser window, navigates to your web application,
 * waits for you to log in to your account (Google, Email, etc.),
 * and permanently saves your authenticated session cookies & tokens
 * to `.agents/auth/storage-state.json`.
 * 
 * Headless Playwright & Gemini Vision audits will automatically load
 * this session so all automated tests run logged in to your account!
 * 
 * Usage:
 *   node scripts/save-browser-auth.mjs
 *   node scripts/save-browser-auth.mjs --url https://savewaris.com
 *   node scripts/save-browser-auth.mjs --url http://localhost:3000
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { chromium } from '@playwright/test';

const AUTH_DIR = path.join(process.cwd(), '.agents', 'auth');
const AUTH_FILE = path.join(AUTH_DIR, 'storage-state.json');

function getArg(flag, defaultValue = '') {
  const idx = process.argv.indexOf(flag);
  return idx !== -1 && process.argv[idx + 1] ? process.argv[idx + 1] : defaultValue;
}

const targetUrl = getArg('--url', process.env.APP_URL || 'http://localhost:3000');

async function captureAuth() {
  console.log('\n🔐 ========================================================');
  console.log('🌐 1-CLICK BROWSER SESSION & AUTHENTICATION CAPTURE');
  console.log('========================================================\n');
  console.log(`Target URL: ${targetUrl}`);
  console.log('Launching visible Chrome browser window...\n');

  if (!fs.existsSync(AUTH_DIR)) fs.mkdirSync(AUTH_DIR, { recursive: true });

  const browser = await chromium.launch({
    headless: false // Visible browser so user can log in
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
  } catch (e) {
    console.warn(`⚠️ Note: Could not immediately reach ${targetUrl}. Browser is open.`);
  }

  console.log('------------------------------------------------------------');
  console.log('👉 INSTRUCTIONS:');
  console.log('1. In the open browser window, log in to your account normally.');
  console.log('2. Complete Google One Tap, email login, or 2FA if needed.');
  console.log('3. Once you are logged in and see your dashboard/profile,');
  console.log('   COME BACK HERE AND PRESS [ENTER] TO SAVE YOUR SESSION.');
  console.log('------------------------------------------------------------\n');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  await new Promise(resolve => {
    rl.question('Press [ENTER] once you have logged in in the browser... ', () => {
      rl.close();
      resolve();
    });
  });

  console.log('\n💾 Capturing session cookies, localStorage, and auth tokens...');
  await context.storageState({ path: AUTH_FILE });

  console.log(`✅ Session saved successfully to: ${AUTH_FILE}`);
  console.log('All future headless audits will automatically run logged in to your account!\n');

  await browser.close();
}

captureAuth().catch(err => {
  console.error(`❌ Session capture error: ${err.message}`);
  process.exit(1);
});
