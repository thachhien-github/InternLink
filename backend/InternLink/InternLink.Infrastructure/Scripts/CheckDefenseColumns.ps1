param(
    [Parameter()]
    [string]$ConfigPath = "E:\Downloads\internlink\backend\InternLink\InternLink.API\appsettings.json"
)

if (-not (Test-Path $ConfigPath)) {
    Write-Error "appsettings.json not found at $ConfigPath"
    exit 1
}

$appsettings = Get-Content $ConfigPath -Raw | ConvertFrom-Json
$conn = $appsettings.ConnectionStrings.DefaultConnection
if (-not $conn) {
    # Try common local dev override naming: ConnectionStrings__DefaultConnection in environment-style config
    $envConn = $appsettings.'ConnectionStrings__DefaultConnection'
    if ($envConn) { $conn = $envConn }
}
if ([string]::IsNullOrWhiteSpace($conn)) {
    Write-Error "DefaultConnection is empty in appsettings.json"
    exit 1
}

$columns = @("DefenseStatus", "DefenseDate", "DefenseCouncilName", "DefenseExaminerName")
$missing = @()

foreach ($col in $columns) {
    $sql = "SELECT COUNT(*) AS cnt FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='Evaluations' AND COLUMN_NAME='$col'"
    try {
        $cnt = (Invoke-Sqlcmd -ConnectionString $conn -Query $sql -QueryTimeout 10).cnt
        if ($cnt -eq 0) {
            $missing += $col
        }
    } catch {
        Write-Warning "Could not query column $col : $_"
    }
}

if ($missing.Count -eq 0) {
    Write-Host "All defense columns present in Evaluations table."
} else {
    Write-Warning "Missing defense columns: $($missing -join ', '). Run EF migration."
}
