# Quick Backend API Verification Script

Write-Host "=== Backend API Endpoints Verification ===" -ForegroundColor Cyan

# Step 1: Test Authentication
Write-Host "`n1. Testing Authentication..." -ForegroundColor Yellow
try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:7109/api/Auth/login" `
        -Method Post `
        -ContentType "application/json" `
        -Body (@{
            username = "student1"
            password = "Password123!"
        } | ConvertTo-Json) `
        -ErrorAction Stop
    
    if ($loginResponse.data.token) {
        Write-Host "✓ Authentication successful" -ForegroundColor Green
        $token = $loginResponse.data.token
        Write-Host "  Token: $($token.Substring(0, 20))..." -ForegroundColor DarkGray
    } else {
        Write-Host "✗ Authentication failed - no token" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Authentication error: $_" -ForegroundColor Red
}

# Step 2: Test StudentPortal API
Write-Host "`n2. Testing StudentPortal API..." -ForegroundColor Yellow
try {
    if ($token) {
        $profileResponse = Invoke-RestMethod -Uri "http://localhost:7109/api/StudentPortal/me" `
            -Method Get `
            -Headers @{ Authorization = "Bearer $token" } `
            -ErrorAction Stop
        
        if ($profileResponse.data) {
            Write-Host "✓ StudentPortal/me endpoint works" -ForegroundColor Green
            Write-Host "  Student: $($profileResponse.data.fullName) ($($profileResponse.data.studentCode))" -ForegroundColor DarkGray
            Write-Host "  Company: $($profileResponse.data.companyName)" -ForegroundColor DarkGray
        }
    }
} catch {
    Write-Host "✗ StudentPortal API error: $_" -ForegroundColor Red
}

# Step 3: Test WeeklyReport API
Write-Host "`n3. Testing WeeklyReport API..." -ForegroundColor Yellow
try {
    if ($token) {
        $reportsResponse = Invoke-RestMethod -Uri "http://localhost:7109/api/WeeklyReport/mine" `
            -Method Get `
            -Headers @{ Authorization = "Bearer $token" } `
            -ErrorAction Stop
        
        if ($reportsResponse.data) {
            Write-Host "✓ WeeklyReport/mine endpoint works" -ForegroundColor Green
            Write-Host "  Reports count: $($reportsResponse.data.Count)" -ForegroundColor DarkGray
        }
    }
} catch {
    Write-Host "✗ WeeklyReport API error: $_" -ForegroundColor Red
}

# Step 4: Get all API paths from Swagger
Write-Host "`n4. Available API Endpoints..." -ForegroundColor Yellow
try {
    $swagger = Invoke-RestMethod -Uri "http://localhost:7109/swagger/v1/swagger.json" -ErrorAction Stop
    $endpoints = $swagger.paths.PSObject.Properties | Select-Object -ExpandProperty Name | Sort-Object
    
    Write-Host "`n$($endpoints.Count) endpoints found:" -ForegroundColor Cyan
    
    # Group by controller
    $grouped = @{}
    $endpoints | ForEach-Object {
        $parts = $_ -split '/'
        $controller = $parts[2] ?? "Other"
        if (-not $grouped[$controller]) { $grouped[$controller] = @() }
        $grouped[$controller] += $_
    }
    
    foreach ($controller in $grouped.Keys | Sort-Object) {
        Write-Host "`n  [$controller] ($($grouped[$controller].Count) endpoints)" -ForegroundColor Cyan
        $grouped[$controller] | Sort-Object | ForEach-Object {
            Write-Host "    $_" -ForegroundColor DarkGray
        }
    }
    
} catch {
    Write-Host "✗ Swagger fetch error: $_" -ForegroundColor Red
}

Write-Host "`n" -ForegroundColor Cyan
