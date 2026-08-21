# InternLink System & Infrastructure Diagnostic Toolkit
# Automated diagnostic script to test Docker status, container health checks,
# port availability, SQL Server connectivity, and network routing.

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "   InternLink System & Infrastructure Diagnostic Toolkit        " -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ("Timestamp: " + (Get-Date -Format "yyyy-MM-dd HH:mm:ss")) -ForegroundColor DarkGray
Write-Host ""

$hasError = $false

function Test-FastPort {
    param([string]$HostName, [int]$Port, [int]$TimeoutMs = 1000)
    $client = New-Object System.Net.Sockets.TcpClient
    try {
        $asyncResult = $client.BeginConnect($HostName, $Port, $null, $null)
        $success = $asyncResult.AsyncWaitHandle.WaitOne($TimeoutMs, $false)
        if ($success -and $client.Connected) {
            $client.EndConnect($asyncResult)
            return $true
        }
        return $false
    } catch {
        return $false
    } finally {
        $client.Close()
    }
}

# 1. Port Availability Checks
Write-Host "[1/5] Checking Required Network Ports..." -ForegroundColor Yellow

function Check-PortListening {
    param([int]$Port, [string]$ServiceName)
    $isOpen = Test-FastPort -HostName "127.0.0.1" -Port $Port -TimeoutMs 500
    if ($isOpen) {
        Write-Host ("  [OK] Port " + $Port + " (" + $ServiceName + ") is OPEN & LISTENING") -ForegroundColor Green
        return $true
    } else {
        Write-Host ("  [--] Port " + $Port + " (" + $ServiceName + ") is NOT LISTENING") -ForegroundColor DarkGray
        return $false
    }
}

$port1433 = Check-PortListening -Port 1433 -ServiceName "SQL Server"
$port7109 = Check-PortListening -Port 7109 -ServiceName "Backend API (Docker / Host)"
$port3000 = Check-PortListening -Port 3000 -ServiceName "Frontend SPA (Nginx / Host)"

# 2. SQL Server Connectivity Check
Write-Host ""
Write-Host "[2/5] Testing SQL Server Connectivity (Port 1433)..." -ForegroundColor Yellow
if ($port1433) {
    Write-Host "  [PASS] SQL Server TCP port 1433 reachable on localhost." -ForegroundColor Green
} else {
    Write-Host "  [WARN] Cannot connect to localhost:1433. Make sure SQL Server is running." -ForegroundColor Red
    $hasError = $true
}

# 3. Docker Daemon & Container Inspection
Write-Host ""
Write-Host "[3/5] Inspecting Docker & Containers Status..." -ForegroundColor Yellow
$dockerInstalled = Get-Command "docker" -ErrorAction SilentlyContinue

if (-not $dockerInstalled) {
    Write-Host "  [INFO] Docker CLI is not installed or not in PATH." -ForegroundColor DarkYellow
} else {
    try {
        $dockerPing = docker info 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  [PASS] Docker Daemon is running." -ForegroundColor Green
            $containers = docker ps -a --filter "name=internlink" --format "{{.Names}} | Status: {{.Status}} | Ports: {{.Ports}}"
            if ($containers) {
                Write-Host "  Found InternLink Containers:" -ForegroundColor Cyan
                foreach ($c in $containers) {
                    Write-Host ("    * " + $c) -ForegroundColor White
                }
            } else {
                Write-Host "  [INFO] No active internlink containers found. Run 'docker compose up -d' to start." -ForegroundColor DarkGray
            }
        } else {
            Write-Host "  [WARN] Docker Daemon is stopped or unreachable. Please launch Docker Desktop." -ForegroundColor DarkYellow
        }
    } catch {
        Write-Host ("  [WARN] Could not communicate with Docker: " + $_.Exception.Message) -ForegroundColor DarkYellow
    }
}

# 4. Backend Health Probes & Endpoint Validation
Write-Host ""
Write-Host "[4/5] Testing Health Check Endpoints..." -ForegroundColor Yellow

function Invoke-HealthProbe {
    param([string]$Url, [string]$ProbeName)
    try {
        $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
        $resp = Invoke-RestMethod -Uri $Url -Method Get -TimeoutSec 2 -ErrorAction Stop
        $stopwatch.Stop()

        Write-Host ("  [PASS] " + $ProbeName + " (" + $Url + ") - Response Time: " + $stopwatch.ElapsedMilliseconds + "ms") -ForegroundColor Green
        if ($resp.status) {
            Write-Host ("         Overall Status: " + $resp.status) -ForegroundColor Cyan
        }
        if ($resp.entries) {
            foreach ($entry in $resp.entries) {
                $statusColor = if ($entry.status -eq "Healthy") { "Green" } else { "Red" }
                Write-Host ("         - " + $entry.name + ": " + $entry.status + " (" + $entry.description + ")") -ForegroundColor $statusColor
            }
        }
        return $true
    } catch {
        Write-Host ("  [INFO] " + $ProbeName + " (" + $Url + ") is not reachable yet (Service might be stopped).") -ForegroundColor DarkGray
        return $false
    }
}

$backendLive = Invoke-HealthProbe -Url "http://localhost:7109/health/live" -ProbeName "Liveness Probe"
$backendReady = Invoke-HealthProbe -Url "http://localhost:7109/health/ready" -ProbeName "Readiness Probe (SQL Server)"
$backendFull = Invoke-HealthProbe -Url "http://localhost:7109/health" -ProbeName "Full Health Probe"

# 5. Frontend & Reverse Proxy Check
Write-Host ""
Write-Host "[5/5] Testing Frontend Web Server (Port 3000)..." -ForegroundColor Yellow
try {
    $feResp = Invoke-WebRequest -Uri "http://localhost:3000" -Method Head -TimeoutSec 2 -UseBasicParsing -ErrorAction Stop
    Write-Host ("  [PASS] Frontend Web Server returned HTTP " + $feResp.StatusCode + " " + $feResp.StatusDescription) -ForegroundColor Green
} catch {
    Write-Host ("  [INFO] Frontend is not reachable yet on port 3000 (Service might be stopped).") -ForegroundColor DarkGray
}

# Summary & Troubleshooting Tips
Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "                    Diagnostic Summary                          " -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan

if ($backendReady) {
    Write-Host "[SUCCESS] System is fully operational and database connection is healthy!" -ForegroundColor Green
} else {
    Write-Host "[!] Next Steps / Troubleshooting Checklist:" -ForegroundColor Yellow
    Write-Host "  1. Start Docker Desktop: Make sure the Docker icon in the Windows taskbar is running." -ForegroundColor White
    Write-Host "  2. Start SQL Server: Ensure SQL Server (MSSQLSERVER) is Running in Services.msc." -ForegroundColor White
    Write-Host "  3. Start Containers: Run 'docker compose up -d --build' in E:\Downloads\internlink." -ForegroundColor White
    Write-Host "  4. View live logs: Run 'docker logs -f internlink_api'." -ForegroundColor White
}
Write-Host ""
