$BaseUrl = "http://localhost:3000/api"
$TestEmail = "rohanparmar160705@gmail.com"
$TestPassword = "ApniSec@Test123"
$TestName = "Rohan Test"

$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession

Write-Host " "
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host " APNISEC EMAIL SERVICE TEST SUITE" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host " "

# 1. AUTHENTICATION
Write-Host "[1/4] STEP: Initializing Session for $TestEmail..." -ForegroundColor Yellow
$authBody = @{
    email = $TestEmail
    password = $TestPassword
} | ConvertTo-Json

try {
    $loginResp = Invoke-RestMethod -Uri "$BaseUrl/auth/login" -Method Post -Body $authBody -ContentType "application/json" -WebSession $session
    Write-Host "  OK: Login Successful." -ForegroundColor Green
} catch {
    Write-Host "  INFO: Login failed, attempting registration..." -ForegroundColor Gray
    try {
        $regBody = @{
            email = $TestEmail
            password = $TestPassword
            name = $TestName
        } | ConvertTo-Json
        $regResp = Invoke-RestMethod -Uri "$BaseUrl/auth/register" -Method Post -Body $regBody -ContentType "application/json"
        Write-Host "  OK: Registration Successful." -ForegroundColor Green
        
        $loginResp = Invoke-RestMethod -Uri "$BaseUrl/auth/login" -Method Post -Body $authBody -ContentType "application/json" -WebSession $session
        Write-Host "  OK: Session initialized." -ForegroundColor Green
    } catch {
        Write-Host "  ERROR: Auth failed: $($_.Exception.Message)" -ForegroundColor Red
        exit
    }
}

# 2. CREATE ISSUE
Write-Host " "
Write-Host "[2/4] STEP: Triggering Issue Email..." -ForegroundColor Yellow
$issueBody = @{
    type = "VAPT"
    title = "[CRITICAL] SQL Injection Attempt Detected"
    description = "Automated sensor triggered. Payload: OR 1=1. Immediate investigation."
    priority = "CRITICAL"
    status = "OPEN"
} | ConvertTo-Json

try {
    $issueResp = Invoke-RestMethod -Uri "$BaseUrl/issues" -Method Post -Body $issueBody -ContentType "application/json" -WebSession $session
    Write-Host "  OK: Issue Created." -ForegroundColor Green
} catch {
    Write-Host "  ERROR: Issue failed: $($_.Exception.Message)" -ForegroundColor Red
}

# 3. UPDATE PROFILE
Write-Host " "
Write-Host "[3/4] STEP: Triggering Profile Alert..." -ForegroundColor Yellow
$profileBody = @{
    name = "Rohan Updated"
} | ConvertTo-Json

try {
    $profResp = Invoke-RestMethod -Uri "$BaseUrl/users/profile" -Method Put -Body $profileBody -ContentType "application/json" -WebSession $session
    Write-Host "  OK: Profile Updated." -ForegroundColor Green
} catch {
     Write-Host "  ERROR: Profile update failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host " "
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host " TEST RUN COMPLETED" -ForegroundColor Cyan
Write-Host " Check server logs (npm run dev) for email status." -ForegroundColor White
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host " "
