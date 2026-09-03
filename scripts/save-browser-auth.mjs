#!/usr/bin/env node

/**
 * 1-Click Interactive Browser Authentication & Session Capture
 * 
 * Auto-detects if the local dev server is running. If not, it automatically
 * spawns `npm run dev` in the background, waits for `localhost:3000` to bind,
 * launches a visible Chrome window to the login page, and permanently saves
 * your authenticated session cookies & tokens to `.agents/auth/storage-state.json`.
 * 
 * Headless Playwright & Gemini Vision audits will automatically load
 * this session so all automated tests run logged in to your account!
 * 
 * Usage:
 *   node scripts/save-browser-auth.mjs
 *   node scripts/save-browser-auth.mjs --url https://savewaris.com
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { spawn } from 'child_process';
import { chromium } from '@playwright/test';

const AUTH_DIR = path.join(process.cwd(), '.agents', 'auth');
const AUTH_FILE = path.join(AUTH_DIR, 'storage-state.json');

function getArg(flag, defaultValue = '') {
  const idx = process.argv.indexOf(flag);
  return idx !== -1 && process.argv[idx + 1] ? process.argv[idx + 1] : defaultValue;
}

let targetUrl = getArg('--url', process.env.APP_URL || 'http://localhost:3000');

async function isServerRunning(url) {
  try {
    const res = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(2000) });
    return true;
  } catch (e) {
    return false;
  }
}

async function startDevServer() {
  console.log('⚡ Local dev server is not running on port 3000.');
  console.log('🚀 Automatically starting Next.js dev server in the background...\n');

  const isWindows = process.platform === 'win32';
  const npmCmd = isWindows ? 'npm.cmd' : 'npm';
  const child = spawn(npmCmd, ['run', 'dev'], {
    cwd: process.cwd(),
    stdio: 'ignore',
    detached: true
  });
  child.unref();

  console.log('⏳ Waiting for http://localhost:3000 to become ready...');
  for (let i = 1; i <= 30; i++) {
    await new Promise(r => setTimeout(r, 1000));
    process.stdout.write(`  Checking localhost:3000 [${i}s]... \r`);
    if (await isServerRunning('http://localhost:3000')) {
      console.log('\n✅ Local dev server is up and responding!\n');
      return true;
    }
  }

  console.log('\n⚠️ Could not reach localhost:3000 after 30 seconds.');
  return false;
}

async function captureAuth() {
  console.log('\n🔐 ========================================================');
  console.log('🌐 1-CLICK BROWSER SESSION & AUTHENTICATION CAPTURE');
  console.log('========================================================\n');

  if (!fs.existsSync(AUTH_DIR)) fs.mkdirSync(AUTH_DIR, { recursive: true });

  // 1. Check if server is running; if not and targeting localhost, start it
  if (targetUrl.includes('localhost')) {
    const alive = await isServerRunning(targetUrl);
    if (!alive) {
      const started = await startDevServer();
      if (!started) {
        console.log('💡 Tip: If you want to log in against your live deployed website instead, run:');
        console.log('   node scripts/save-browser-auth.mjs --url https://savewaris.com\n');
      }
    }
  }

  console.log(`Target URL: ${targetUrl}/login`);
  console.log('Launching visible Chrome browser window...\n');

  const browser = await chromium.launch({
    headless: false // Visible browser so user can see and log in
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to /login if root
    const navUrl = targetUrl.endsWith('/login') ? targetUrl : `${targetUrl.replace(/\/$/, '')}/login`;
    await page.goto(navUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
  } catch (e) {
    console.warn(`⚠️ Browser opened. If page shows connection refused, wait 3s and click Reload.`);
  }

  console.log('------------------------------------------------------------');
  console.log('👉 INSTRUCTIONS:');
  console.log('1. In the open browser window, enter your Admin password or log in.');
  console.log('2. Once you see your Admin dashboard / profile,');
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
