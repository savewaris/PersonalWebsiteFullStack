#!/usr/bin/env node

/**
 * Agent Doctor — Automated Health Check for PersonalWebsite AI Agent System
 * Validates agent configuration, rules, skills, subagents, Prisma schema, and TypeScript.
 */

import { existsSync, readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';

const ROOT_DIR = process.cwd();
const AGENTS_DIR = path.join(ROOT_DIR, '.agents');
const RULES_DIR = path.join(AGENTS_DIR, 'rules');
const SKILLS_DIR = path.join(AGENTS_DIR, 'skills');

console.log('\n======================================================');
console.log('🩺 RUNNING AGENT DOCTOR HEALTH CHECK FOR PERSONALWEBSITE');
console.log('======================================================\n');

let passedChecks = 0;
let failedChecks = 0;

function check(label, condition, errorMessage) {
  if (condition) {
    console.log(`  ✅ [PASS] ${label}`);
    passedChecks++;
  } else {
    console.error(`  ❌ [FAIL] ${label}`);
    if (errorMessage) console.error(`     ↳ ${errorMessage}`);
    failedChecks++;
  }
}

// 1. Check Root Entrypoints
console.log('📂 1. Verifying Root Entrypoint Files...');
check('AGENTS.md exists at project root', existsSync(path.join(ROOT_DIR, 'AGENTS.md')));
check('GEMINI.md exists at project root', existsSync(path.join(ROOT_DIR, 'GEMINI.md')));
check('.agents/subagents.json exists', existsSync(path.join(AGENTS_DIR, 'subagents.json')));

// 2. Check Subagents Configuration
console.log('\n🤖 2. Verifying Subagents Configuration...');
try {
  const subagentsRaw = readFileSync(path.join(AGENTS_DIR, 'subagents.json'), 'utf8');
  const subagentsData = JSON.parse(subagentsRaw);
  const count = subagentsData.subagents?.length || 0;
  check(`Loaded ${count} subagent definitions (expected 7)`, count === 7);
} catch (err) {
  check('subagents.json is valid JSON', false, err.message);
}

// 3. Check Rules Directory
console.log('\n📜 3. Verifying Rule Files in .agents/rules/...');
const expectedRules = [
  'nextjs-app-router.md',
  'prisma-database.md',
  'ui-styling-framer-motion.md',
  'admin-security.md',
  'documentation-standards.md',
  'ci-cd-standards.md',
  'multi-agent-orchestration.md',
  'clean-code-architecture.md',
];

for (const rule of expectedRules) {
  const rulePath = path.join(RULES_DIR, rule);
  check(`Rule: ${rule}`, existsSync(rulePath) && readFileSync(rulePath, 'utf8').length > 50);
}

// 4. Check Skills Directory
console.log('\n⚡ 4. Verifying Progressive Skills in .agents/skills/...');
const expectedSkills = [
  'roadmap-implementer',
  'prisma-schema-migration',
  'component-generator',
  'doc-architect',
  'ci-cd-engineer',
  'project-planner',
  'codebase-researcher',
  'clean-code-refactor',
];

for (const skill of expectedSkills) {
  const skillFile = path.join(SKILLS_DIR, skill, 'SKILL.md');
  const hasSkill = existsSync(skillFile);
  let hasFrontmatter = false;
  if (hasSkill) {
    const content = readFileSync(skillFile, 'utf8');
    hasFrontmatter = content.startsWith('---') && content.includes('description:');
  }
  check(`Skill: ${skill} (SKILL.md + frontmatter)`, hasSkill && hasFrontmatter);
}

// 5. Check CI/CD, Documentation & State Assets
console.log('\n🚀 5. Verifying CI/CD, State & Documentation Assets...');
check('GitHub Actions CI pipeline (.github/workflows/ci.yml)', existsSync(path.join(ROOT_DIR, '.github', 'workflows', 'ci.yml')));
check('ADR 0001 (docs/adr/0001-project-scoped-agents.md)', existsSync(path.join(ROOT_DIR, 'docs', 'adr', '0001-project-scoped-agents.md')));
check('ADR 0002 (docs/adr/0002-real-time-step-logging-and-session-handoff.md)', existsSync(path.join(ROOT_DIR, 'docs', 'adr', '0002-real-time-step-logging-and-session-handoff.md')));
check('ADR 0003 (docs/adr/0003-modular-clean-code-and-cross-cli-file-locking.md)', existsSync(path.join(ROOT_DIR, 'docs', 'adr', '0003-modular-clean-code-and-cross-cli-file-locking.md')));
check('Roadmap document (docs/github_issues_roadmap.md)', existsSync(path.join(ROOT_DIR, 'docs', 'github_issues_roadmap.md')));
check('Session handover log (.agents/state/SESSION_LOG.md)', existsSync(path.join(AGENTS_DIR, 'state', 'SESSION_LOG.md')));
check('Live step action ledger (.agents/state/LIVE_STEP_LOG.md)', existsSync(path.join(AGENTS_DIR, 'state', 'LIVE_STEP_LOG.md')));
check('Cross-CLI file lock registry (.agents/state/locks.json)', existsSync(path.join(AGENTS_DIR, 'state', 'locks.json')));
check('Modular domain data layer (src/lib/data/index.ts)', existsSync(path.join(ROOT_DIR, 'src', 'lib', 'data', 'index.ts')));

// 6. Prisma Validation
console.log('\n🗄️ 6. Validating Prisma Database Schema...');
try {
  execSync('npx prisma validate', { stdio: 'pipe' });
  check('Prisma schema validation (npx prisma validate)', true);
} catch (err) {
  check('Prisma schema validation (npx prisma validate)', false, err.message);
}

// 7. TypeScript Compilation Check
console.log('\n🔍 7. Running TypeScript Compilation Check...');
try {
  execSync('npx tsc --noEmit', { stdio: 'pipe' });
  check('TypeScript check (npx tsc --noEmit: 0 errors)', true);
} catch (err) {
  check('TypeScript check (npx tsc --noEmit: 0 errors)', false, err.message);
}

// Summary
console.log('\n======================================================');
if (failedChecks === 0) {
  console.log(`🎉 ALL CHECKS PASSED (${passedChecks}/${passedChecks}) — AI AGENT SYSTEM FULLY OPERATIONAL!`);
  console.log('======================================================\n');
  process.exit(0);
} else {
  console.error(`⚠️  ${failedChecks} CHECKS FAILED (${passedChecks} passed). Please address issues above.`);
  console.log('======================================================\n');
  process.exit(1);
}
