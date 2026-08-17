# InternLink M7 UAT — end-to-end API flows (backend :7109, VITE_USE_MOCK=false)
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

function Post-Auth {
  param($token, $path, $bodyObj)
  $body = $bodyObj | ConvertTo-Json -Depth 6
  Invoke-RestMethod -Uri "$Base$path" -Method Post -Headers @{ Authorization = "Bearer $token" } -Body $body -ContentType "application/json"
}

function Put-Auth {
  param($token, $path, $bodyObj)
  $body = $bodyObj | ConvertTo-Json -Depth 6
  Invoke-RestMethod -Uri "$Base$path" -Method Put -Headers @{ Authorization = "Bearer $token" } -Body $body -ContentType "application/json"
}

function New-ZipTemp {
  param($name = "m7-smoke.zip")
  $path = Join-Path $env:TEMP $name
  [IO.File]::WriteAllBytes($path, [byte[]](0x50, 0x4B, 0x05, 0x06, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0))
  return $path
}

function New-PdfTemp {
  param($name = "m7-template.pdf")
  $path = Join-Path $env:TEMP $name
  # Minimal PDF header bytes
  [IO.File]::WriteAllBytes($path, [Text.Encoding]::ASCII.GetBytes("%PDF-1.4`n1 0 obj<<>>endobj`ntrailer<<>>`n%%EOF"))
  return $path
}

try {
  # --- Flow 1: Login 3 portals ---
  $adminTok = Login "superadmin"
  $lecTok = Login "lecturer1"
  $stuTok = Login "student1"
  Record "F1 Login 3 portal" $true "superadmin, lecturer1, student1"

  # --- Flow 2: Admin students + assign GV ---
  $students = (Get-Auth $adminTok "/api/Admin/students?skip=0&take=10").data
  $lecturers = (Get-Auth $adminTok "/api/LecturerProfile?skip=0&take=10").data
  $lecturerId = $lecturers[0].id
  $studentId = $students[0].id
  $assignBody = @{ lecturerId = $lecturerId; studentIds = @($studentId) }
  $assign = (Post-Auth $adminTok "/api/Admin/assignments" $assignBody).data
  $assignments = (Get-Auth $adminTok "/api/Admin/assignments/by-lecturer/$lecturerId").data
  $ok2 = ($students.Count -gt 0) -and ($assignments.Count -gt 0)
  Record "F2 Admin assign GV" $ok2 "students=$($students.Count) assigned=$($assignments.Count) bulk=$($assign.assignedCount)"

  # Shared context
  $me = (Get-Auth $stuTok "/api/StudentPortal/me").data
  $internshipId = $me.internship.id
  if (-not $internshipId) { throw "student1 has no internship" }

  $lecInternships = (Get-Auth $lecTok "/api/Lecturer/internships").data
  $lecHasInternship = @($lecInternships | Where-Object { $_.id -eq $internshipId }).Count -gt 0
  Record "F2b Lecturer sees internship" $lecHasInternship "internshipId=$internshipId"

  # --- Flow 3: GV upload template -> SV download ---
  $pdfTmp = New-PdfTemp
  $docJson = curl.exe -s -X POST "$Base/api/Document/upload" `
    -H "Authorization: Bearer $lecTok" `
    -F "InternshipId=$internshipId" `
    -F "Title=M7 smoke template" `
    -F "Category=Template" `
    -F "IsRequired=true" `
    -F "File=@$pdfTmp;type=application/pdf"
  $docUpload = $docJson | ConvertFrom-Json
  $docId = $docUpload.data.id
  $docDl = curl.exe -s -o NUL -w "%{http_code} %{size_download}" "$Base/api/Document/$docId/download" -H "Authorization: Bearer $stuTok"
  $docParts = $docDl -split ' '
  Record "F3 Doc upload+download" (($docUpload.success -and $docId) -and ($docParts[0] -eq '200')) "docId=$docId status=$($docParts[0])"

  # --- Flow 4: SV weekly report -> GV review ---
  $existingWeeks = @((Get-Auth $stuTok "/api/WeeklyReport/mine").data | ForEach-Object { [int]$_.weekNumber })
  $weekNum = 2
  while ($existingWeeks -contains $weekNum -and $weekNum -le 52) { $weekNum++ }
  if ($weekNum -gt 52) { throw "No available week number (2-52)" }
  $draftBody = @{
    internshipId = $internshipId
    weekNumber   = $weekNum
    title        = "M7 week $weekNum"
    content      = "Smoke test weekly report content."
  }
  $draft = (Post-Auth $stuTok "/api/WeeklyReport" $draftBody).data
  $submitted = (Post-Auth $stuTok "/api/WeeklyReport/$($draft.id)/submit" @{}).data
  $reviewBody = @{ status = "Approved"; lecturerComment = "M7 OK" }
  $reviewed = (Post-Auth $lecTok "/api/WeeklyReport/$($draft.id)/review" $reviewBody).data
  Record "F4 Weekly submit+review" ($submitted.status -eq "Submitted" -and $reviewed.status -eq "Approved") "week=$weekNum status=$($reviewed.status)"

  # --- Flow 5: SV product -> GV feedback -> resubmit ---
  $zipTmp = New-ZipTemp "m7-product.zip"
  $subJson = curl.exe -s -X POST "$Base/api/Submission/upload" `
    -H "Authorization: Bearer $stuTok" `
    -F "InternshipId=$internshipId" `
    -F "Type=Product" `
    -F "Title=M7 product v1" `
    -F "File=@$zipTmp;type=application/zip"
  $subUpload = $subJson | ConvertFrom-Json
  $subId = $subUpload.data.id
  $fbBody = @{ comment = "Please revise section 2"; isPublic = $true; newStatus = "RevisionRequested" }
  $feedback = (Post-Auth $lecTok "/api/Submission/$subId/feedback" $fbBody).data
  $zipTmp2 = New-ZipTemp "m7-product-v2.zip"
  $resubJson = curl.exe -s -X POST "$Base/api/Submission/$subId/resubmit-upload" `
    -H "Authorization: Bearer $stuTok" `
    -F "Title=M7 product v2" `
    -F "File=@$zipTmp2;type=application/zip"
  $resub = $resubJson | ConvertFrom-Json
  Record "F5 Submit+feedback+resubmit" ($subId -and $feedback.id -and $resub.success) "orig=$subId resub=$($resub.data.id)"

  # --- Flow 6: GV evaluation finalize + export ---
  $hasEval = Get-Auth $lecTok "/api/Evaluation/internship/$internshipId/exists"
  if ($hasEval -eq $true) {
    try {
      $eval = Get-Auth $lecTok "/api/Evaluation/internship/$internshipId"
    } catch {
      $eval = $null
    }
  } else {
    $eval = $null
  }
  if (-not $eval) {
    $evalBody = @{
      internshipId        = $internshipId
      technicalScore      = 8
      communicationScore  = 7
      teamworkScore       = 8
      initiativeScore     = 7
      comments            = "M7 evaluation"
      isFinalized         = $false
    }
    $eval = Post-Auth $lecTok "/api/Evaluation" $evalBody
  }
  $evalId = $eval.id
  if ($eval.isFinalized -ne $true) {
    $eval = Post-Auth $lecTok "/api/Evaluation/$evalId/finalize" @{}
  }
  $expMeta = curl.exe -s -o NUL -w "%{http_code}" "$Base/api/Lecturer/export/end-of-term" -H "Authorization: Bearer $lecTok"
  Record "F6 Eval finalize+export" ($eval.isFinalized -eq $true -and $expMeta -eq '200') "evalId=$evalId export=$expMeta"

  # --- Flow 7: Admin email test ---
  $emailBody = @{ toEmail = "superadmin@internlink.test"; fullName = "M7 Smoke"; role = 0 }
  $email = Post-Auth $adminTok "/api/Admin/email/test" $emailBody
  Record "F7 Admin email test" $email.success "message=$($email.data.message)"

  Remove-Item $pdfTmp, $zipTmp, $zipTmp2 -ErrorAction SilentlyContinue
}
catch {
  Record "M7 ABORT" $false $_.Exception.Message
}

Write-Host ""
Write-Host "=== M7 Summary ==="
$passed = @($results | Where-Object { $_.OK }).Count
$total = $results.Count
Write-Host ("{0} / {1} passed" -f $passed, $total)
if (@($results | Where-Object { -not $_.OK }).Count -gt 0) { exit 1 }
