<#
.SYNOPSIS
    Cấu hình SQL Server để Docker container kết nối được.
    Bật: Mixed Mode Authentication, TCP/IP Protocol, và login sa.
.NOTES
    PHẢI chạy với quyền Administrator!
    Run: Start-Process powershell -Verb RunAs -ArgumentList "-File .\scripts\setup-sqlserver.ps1"
#>

param(
    [string]$SaPassword = "sa"
)

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "   SQL Server Setup for Docker Connectivity" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan

# --- Kiểm tra quyền Admin ---
if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "[ERROR] Script nay can chay voi quyen Administrator!" -ForegroundColor Red
    Write-Host "  Cach chay: Start-Process powershell -Verb RunAs -ArgumentList `"-File .\scripts\setup-sqlserver.ps1`""
    exit 1
}

# --- Bat TCP/IP qua registry ---
Write-Host "`n[1/3] Bat TCP/IP Protocol qua Registry..." -ForegroundColor Yellow
$sqlRegBase = "HKLM:\SOFTWARE\Microsoft\Microsoft SQL Server"
$tcpEnabled = $false
if (Test-Path $sqlRegBase) {
    Get-ChildItem $sqlRegBase | Where-Object { $_.PSChildName -match "^MSSQL\d+\.MSSQLSERVER$" } | ForEach-Object {
        $tcpPath = Join-Path $_.PSPath "MSSQLServer\SuperSocketNetLib\Tcp"
        if (Test-Path $tcpPath) {
            Set-ItemProperty -Path $tcpPath -Name "Enabled" -Value 1
            Write-Host "  [OK] TCP/IP enabled: $tcpPath" -ForegroundColor Green
            $tcpEnabled = $true
        }
    }
}
if (-not $tcpEnabled) {
    Write-Host "  [WARN] Khong tim thay registry key. Bat thu cong qua SQL Server Configuration Manager." -ForegroundColor Yellow
}

# --- Bat Mixed Mode Authentication qua registry ---
Write-Host "[2/3] Bat Mixed Mode Authentication..." -ForegroundColor Yellow
$loginSet = $false
if (Test-Path $sqlRegBase) {
    Get-ChildItem $sqlRegBase | Where-Object { $_.PSChildName -match "^MSSQL\d+\.MSSQLSERVER$" } | ForEach-Object {
        $mssqlPath = Join-Path $_.PSPath "MSSQLServer"
        if (Test-Path $mssqlPath) {
            # LoginMode: 1 = Windows only, 2 = Mixed (SQL + Windows)
            Set-ItemProperty -Path $mssqlPath -Name "LoginMode" -Value 2
            Write-Host "  [OK] Mixed Mode enabled: $mssqlPath" -ForegroundColor Green
            $loginSet = $true
        }
    }
}
if (-not $loginSet) {
    Write-Host "  [WARN] Khong tim thay registry key LoginMode." -ForegroundColor Yellow
}

# --- Restart SQL Server ---
Write-Host "[3/3] Restart SQL Server de ap dung thay doi..." -ForegroundColor Yellow
try {
    Restart-Service MSSQLSERVER -Force
    Start-Sleep -Seconds 6
    $svc = Get-Service MSSQLSERVER
    if ($svc.Status -eq "Running") {
        Write-Host "  [OK] SQL Server da restart thanh cong!" -ForegroundColor Green
    }
} catch {
    Write-Host "  [ERROR] Khong the restart: $_" -ForegroundColor Red
    exit 1
}

# --- Kich hoat sa login va dat password ---
Write-Host "`n[BONUS] Kich hoat login sa voi password '$SaPassword'..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

$sqlScript = "ALTER LOGIN sa WITH PASSWORD = N'$SaPassword'; ALTER LOGIN sa ENABLE;"
try {
    $result = sqlcmd -S "localhost" -E -Q $sqlScript 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  [OK] Login sa duoc kich hoat voi password: $SaPassword" -ForegroundColor Green
    } else {
        Write-Host "  [WARN] $result" -ForegroundColor Yellow
        Write-Host "  [INFO] Kich hoat sa thu cong qua SSMS > Security > Logins > sa" -ForegroundColor Cyan
    }
} catch {
    Write-Host "  [WARN] sqlcmd khong kha dung. Kich hoat sa thu cong qua SSMS." -ForegroundColor Yellow
}

# --- Kiem tra port 1433 ---
Write-Host "`n[CHECK] Kiem tra port 1433..." -ForegroundColor Yellow
Start-Sleep -Seconds 2
$port1433 = netstat -ano | findstr ":1433"
if ($port1433) {
    Write-Host "  [OK] SQL Server dang lang nghe tren port 1433!" -ForegroundColor Green
    Write-Host $port1433
} else {
    Write-Host "  [WARN] Port 1433 chua mo. Co the can bat TCP/IP thu cong." -ForegroundColor Yellow
}

Write-Host "`n================================================================" -ForegroundColor Cyan
Write-Host "  HOAN TAT! Tiep theo chay:" -ForegroundColor Green
Write-Host "  docker restart internlink_api" -ForegroundColor White
Write-Host "  docker logs -f internlink_api" -ForegroundColor White
Write-Host "================================================================" -ForegroundColor Cyan
