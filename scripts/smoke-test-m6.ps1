# InternLink M6 API smoke test - requires backend at http://localhost:7109
$Base = "http://localhost:7109"
$Pass = "Password123!"
$results = @()

function Record {
  param($step, $ok, $detail)
  $script:results += [pscustomobject]@{ Step = $step; OK = $ok; Detail = $detail }
  $icon = if ($ok) { "PASS" } else { "FAIL" }
  Write-Host "[$icon] $step - $detail"
}

function Login {
  param($user)
  $body = @{ username = $user; password = $Pass } | ConvertTo-Json
  $r = Invoke-RestMethod -Uri "$Base/api/Auth/login" -Method Post -Body $body -ContentType "application/json"
  if (-not $r.success -or -not $r.data.token) { throw "Login failed for $user" }
  return $r.data.token
}

function Get-Auth {
  param($token, $path)
  Invoke-RestMethod -Uri "$Base$path" -Headers @{ Authorization = "Bearer $token" }
}

try {
  $adminTok = Login "superadmin"
  $lecTok = Login "lecturer1"
  $stuTok = Login "student1"
  Record "1. Login 3 portal" $true "superadmin, lecturer1, student1"

  $studentsPath = "/api/Admin/students?skip=0" + "&" + "take=10"
  $lecturersPath = "/api/LecturerProfile?skip=0" + "&" + "take=10"
  $students = (Get-Auth $adminTok $studentsPath).data
  $lecturers = (Get-Auth $adminTok $lecturersPath).data
  $ok2 = ($students.Count -gt 0) -and ($lecturers.Count -gt 0)
  Record "2. Admin students/lecturers" $ok2 "students=$($students.Count) lecturers=$($lecturers.Count)"

  $me = (Get-Auth $stuTok "/api/StudentPortal/me").data
  $internshipId = $me.internship.id
  Record "3. Student portal me" ($null -ne $internshipId) "internshipId=$internshipId"

  $docs = (Get-Auth $stuTok "/api/Document/internship/$internshipId").data
  Record "4. Student documents" $true "count=$($docs.Count)"

  $weekly = (Get-Auth $stuTok "/api/WeeklyReport/mine").data
  Record "5. Weekly reports mine" $true "count=$($weekly.Count)"

  $tmp = Join-Path $env:TEMP "smoke-product.zip"
  [IO.File]::WriteAllBytes($tmp, [byte[]](0x50, 0x4B, 0x05, 0x06, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0))
  $curlJson = curl.exe -s -X POST "$Base/api/Submission/upload" `
    -H "Authorization: Bearer $stuTok" `
    -F "InternshipId=$internshipId" `
    -F "Type=Product" `
    -F "Title=Smoke test product" `
    -F "Description=M6 automated smoke" `
    -F "File=@$tmp;type=application/zip"
  $upload = $curlJson | ConvertFrom-Json
  $subId = $upload.data.id
  Record "6. Submission upload" ($upload.success -and $subId) "id=$subId"

  $dlMeta = curl.exe -s -o NUL -w "%{http_code} %{size_download}" "$Base/api/Submission/$subId/download" -H "Authorization: Bearer $stuTok"
  $dlParts = $dlMeta -split ' '
  $dlOk = ($dlParts[0] -eq '200') -and ([int]$dlParts[1] -gt 0)
  Record "7. Submission download" $dlOk "status=$($dlParts[0]) bytes=$($dlParts[1])"

  $expMeta = curl.exe -s -o NUL -w "%{http_code} %{content_type}" "$Base/api/Lecturer/export/end-of-term" -H "Authorization: Bearer $lecTok"
  $expParts = $expMeta -split ' ', 2
  Record "8. Lecturer export Excel" ($expParts[0] -eq '200') "content-type=$($expParts[1])"

  $emailBody = @{ toEmail = "superadmin@internlink.test"; fullName = "Smoke"; role = 0 } | ConvertTo-Json
  $email = Invoke-RestMethod -Uri "$Base/api/Admin/email/test" -Method Post -Headers @{ Authorization = "Bearer $adminTok" } -Body $emailBody -ContentType "application/json"
  Record "9. Admin email test" $email.success "message=$($email.data.message)"

  $notifs = (Get-Auth $lecTok "/api/Notification/mine").data
  Record "10. Lecturer notifications" $true "count=$($notifs.Count)"

  Remove-Item $tmp -ErrorAction SilentlyContinue
}
catch {
  Record "SMOKE ABORT" $false $_.Exception.Message
}

Write-Host ""
Write-Host "=== Summary ==="
$passed = @($results | Where-Object { $_.OK }).Count
$total = $results.Count
Write-Host ("{0} / {1} passed" -f $passed, $total)
if (@($results | Where-Object { -not $_.OK }).Count -gt 0) { exit 1 }
