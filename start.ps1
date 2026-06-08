# NexLearn local startup script
$ProjectRoot = $PSScriptRoot
Set-Location $ProjectRoot

Write-Host "=== NexLearn Startup ===" -ForegroundColor Cyan

# 1. Start Docker services (Postgres + Redis)
Write-Host "`n[1/4] Starting database containers..." -ForegroundColor Yellow
try {
    docker compose up -d 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Docker containers started." -ForegroundColor Green
        Start-Sleep -Seconds 5
    } else {
        Write-Host "Docker not available. Start Docker Desktop manually, then re-run this script." -ForegroundColor Red
    }
} catch {
    Write-Host "Docker not available. Start Docker Desktop manually." -ForegroundColor Red
}

# 2. Push database schema
Write-Host "`n[2/4] Setting up database schema..." -ForegroundColor Yellow
npx prisma db push 2>&1

# 3. Install deps if needed
if (-not (Test-Path "node_modules")) {
    Write-Host "`n[3/4] Installing dependencies..." -ForegroundColor Yellow
    npm install
} else {
    Write-Host "`n[3/4] Dependencies OK" -ForegroundColor Green
}

# 4. Start backend (serves frontend at http://localhost:3000)
Write-Host "`n[4/4] Starting NexLearn on http://localhost:3000 ..." -ForegroundColor Yellow
Write-Host "Open your browser to: http://localhost:3000" -ForegroundColor Cyan
npm run start:dev
