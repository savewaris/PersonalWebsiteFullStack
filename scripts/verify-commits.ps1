# scripts/verify-commits.ps1
# Pre-commit and pre-push verification script for Conventional Commits, conflict markers, and git hygiene.

$ErrorActionPreference = 'Stop'

Write-Host '======================================================' -ForegroundColor Cyan
Write-Host '[INFO] RUNNING LOCAL COMMIT AND GIT HYGIENE VERIFIER' -ForegroundColor Cyan
Write-Host '======================================================' -ForegroundColor Cyan

$passed = $true

# 1. Check for Merge Conflict Markers in working directory
Write-Host "`n[CHECK 1] Scanning for Unresolved Merge Conflict Markers..." -ForegroundColor Yellow
$conflictFiles = git grep -nE '^[<]{7}( |$)|^[=]{7}$|^[>]{7}( |$)' -- ':!*node_modules*' ':!*.log' ':!*.db' ':!package-lock.json' ':!scripts/verify-commits.ps1' 2>$null
if ($conflictFiles) {
    Write-Host '  [FAIL] Merge conflict markers detected:' -ForegroundColor Red
    $conflictFiles | ForEach-Object { Write-Host "     $_" -ForegroundColor Red }
    $passed = $false
} else {
    Write-Host '  [PASS] Zero merge conflict markers found.' -ForegroundColor Green
}

# 2. Check Latest Commit Message for Conventional Commits Format
Write-Host "`n[CHECK 2] Validating Latest Commit Message Format..." -ForegroundColor Yellow
$lastCommitMsg = (git log -1 --pretty=%B 2>$null)
if ($lastCommitMsg) {
    $firstLine = ($lastCommitMsg.Trim() -split "`n")[0].Trim()
    $conventionalRegex = '^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([a-zA-Z0-9_\-\/ ,]+\))?!?: .{5,}'
    
    if ($firstLine -match $conventionalRegex) {
        Write-Host "  [PASS] Conventional Commit format: `"$firstLine`"" -ForegroundColor Green
    } else {
        Write-Host "  [WARN] Latest commit does not follow Conventional Commits standard:" -ForegroundColor Yellow
        Write-Host "     Message: `"$firstLine`"" -ForegroundColor Yellow
        Write-Host "     Expected format: type(scope): description" -ForegroundColor Yellow
        Write-Host "     Allowed types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert" -ForegroundColor Yellow
    }
} else {
    Write-Host '  [INFO] No commit history found.' -ForegroundColor Gray
}

# 3. Check for Dangerous Accidental Secrets
Write-Host "`n[CHECK 3] Scanning for Leaked Secret Patterns..." -ForegroundColor Yellow
$secretPatterns = 'ghp_[a-zA-Z0-9]{30,}|sk-proj-[a-zA-Z0-9]{32,}|xoxb-[0-9]{10,}'
$leakedSecrets = git grep -nE $secretPatterns -- ':!*node_modules*' ':!*.env*' ':!.userprofile*' ':!scripts/verify-commits.ps1' 2>$null
if ($leakedSecrets) {
    Write-Host '  [FAIL] High-risk secret tokens detected in source:' -ForegroundColor Red
    $leakedSecrets | ForEach-Object { Write-Host "     $_" -ForegroundColor Red }
    $passed = $false
} else {
    Write-Host '  [PASS] Zero exposed credentials or secrets detected.' -ForegroundColor Green
}

# 4. Check Git Remote Tracking and Divergence
Write-Host "`n[CHECK 4] Checking Remote Tracking and Divergence..." -ForegroundColor Yellow
$branchName = (git rev-parse --abbrev-ref HEAD 2>$null)
$status = (git status -sb 2>$null)
if ($status -match 'behind') {
    Write-Host "  [WARN] Local branch '$branchName' is behind remote! Run 'git pull --rebase origin $branchName' before pushing." -ForegroundColor Yellow
} else {
    Write-Host "  [PASS] Local branch '$branchName' is aligned with remote." -ForegroundColor Green
}

Write-Host "`n======================================================" -ForegroundColor Cyan
if ($passed) {
    Write-Host '[SUCCESS] ALL COMMIT HYGIENE CHECKS PASSED!' -ForegroundColor Green
    exit 0
} else {
    Write-Host '[FAIL] COMMIT HYGIENE CHECKS FAILED! Please resolve errors above.' -ForegroundColor Red
    exit 1
}
