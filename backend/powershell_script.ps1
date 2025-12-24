# Copy and paste this script as it is in terminal
Clear-Host

Write-Host "========================================="
Write-Host " BACKEND API VERIFICATION STARTED "
Write-Host "========================================="

$BaseUrl = "http://localhost:3000/api"
$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession

# ---------------- REGISTER ----------------
Write-Host "`n[1] REGISTER USER"

$email = "psuser_" + (Get-Random) + "@example.com"

$registerBody = @{
    email = $email
    password = "password123"
    name = "PowerShell Test User"
} | ConvertTo-Json

$registerResponse = Invoke-RestMethod `
    -Uri "$BaseUrl/auth/register" `
    -Method Post `
    -Body $registerBody `
    -ContentType "application/json"

$registerResponse | ConvertTo-Json -Depth 10

# ---------------- LOGIN ----------------
Write-Host "`n[2] LOGIN USER"

$loginBody = @{
    email = $email
    password = "password123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod `
    -Uri "$BaseUrl/auth/login" `
    -Method Post `
    -Body $loginBody `
    -ContentType "application/json" `
    -WebSession $session

$loginResponse | ConvertTo-Json -Depth 10

# ---------------- AUTH ME ----------------
Write-Host "`n[3] AUTH ME"

$meResponse = Invoke-RestMethod `
    -Uri "$BaseUrl/auth/me" `
    -Method Get `
    -WebSession $session

$meResponse | ConvertTo-Json -Depth 10

# ---------------- GET PROFILE ----------------
Write-Host "`n[4] GET USER PROFILE"

$profileResponse = Invoke-RestMethod `
    -Uri "$BaseUrl/users/profile" `
    -Method Get `
    -WebSession $session

$profileResponse | ConvertTo-Json -Depth 10

# ---------------- UPDATE PROFILE ----------------
Write-Host "`n[5] UPDATE USER PROFILE"

$updateBody = @{
    name = "Updated PowerShell User"
} | ConvertTo-Json

$updateResponse = Invoke-RestMethod `
    -Uri "$BaseUrl/users/profile" `
    -Method Put `
    -Body $updateBody `
    -ContentType "application/json" `
    -WebSession $session

$updateResponse | ConvertTo-Json -Depth 10

# ---------------- VERIFY UPDATE ----------------
Write-Host "`n[6] VERIFY UPDATED PROFILE"

$verifyProfile = Invoke-RestMethod `
    -Uri "$BaseUrl/users/profile" `
    -Method Get `
    -WebSession $session

$verifyProfile | ConvertTo-Json -Depth 10

# ---------------- CREATE ISSUE ----------------
Write-Host "`n[7] CREATE ISSUE"

$issueBody = @{
    type = "CLOUD_SECURITY"
    title = "S3 Bucket Misconfiguration"
    description = "Public access enabled on production S3 bucket containing sensitive data"
    priority = "HIGH"
    status = "OPEN"
} | ConvertTo-Json

$newIssue = Invoke-RestMethod `
    -Uri "$BaseUrl/issues" `
    -Method Post `
    -Body $issueBody `
    -ContentType "application/json" `
    -WebSession $session

$newIssue | ConvertTo-Json -Depth 10
$issueId = $newIssue.id

# ---------------- GET ALL ISSUES ----------------
Write-Host "`n[8] GET ALL ISSUES"

$allIssues = Invoke-RestMethod `
    -Uri "$BaseUrl/issues" `
    -Method Get `
    -WebSession $session

$allIssues | ConvertTo-Json -Depth 10

# ---------------- FILTER ISSUES BY TYPE ----------------
Write-Host "`n[9] FILTER ISSUES BY TYPE"

$cloudIssues = Invoke-RestMethod `
    -Uri "$BaseUrl/issues?type=CLOUD_SECURITY" `
    -Method Get `
    -WebSession $session

$cloudIssues | ConvertTo-Json -Depth 10

# ---------------- GET SINGLE ISSUE ----------------
Write-Host "`n[10] GET SINGLE ISSUE"

$singleIssue = Invoke-RestMethod `
    -Uri "$BaseUrl/issues/$issueId" `
    -Method Get `
    -WebSession $session

$singleIssue | ConvertTo-Json -Depth 10

# ---------------- UPDATE ISSUE ----------------
Write-Host "`n[11] UPDATE ISSUE"

$updateIssueBody = @{
    title = "Updated: S3 Bucket Security Issue"
    status = "IN_PROGRESS"
    priority = "CRITICAL"
} | ConvertTo-Json

$updatedIssue = Invoke-RestMethod `
    -Uri "$BaseUrl/issues/$issueId" `
    -Method Put `
    -Body $updateIssueBody `
    -ContentType "application/json" `
    -WebSession $session

$updatedIssue | ConvertTo-Json -Depth 10

# ---------------- DELETE ISSUE ----------------
Write-Host "`n[12] DELETE ISSUE"

$deleteResponse = Invoke-RestMethod `
    -Uri "$BaseUrl/issues/$issueId" `
    -Method Delete `
    -WebSession $session

$deleteResponse | ConvertTo-Json -Depth 10

# ---------------- LOGOUT ----------------
Write-Host "`n[13] LOGOUT"

$logoutResponse = Invoke-RestMethod `
    -Uri "$BaseUrl/auth/logout" `
    -Method Post `
    -WebSession $session

$logoutResponse | ConvertTo-Json -Depth 10

# ---------------- VERIFY LOGOUT ----------------
Write-Host "`n[14] VERIFY LOGOUT (EXPECTED FAILURE)"

try {
    Invoke-RestMethod `
        -Uri "$BaseUrl/auth/me" `
        -Method Get `
        -WebSession $session
}
catch {
    Write-Host "Unauthorized as expected after logout"
}

Write-Host "`n========================================="
Write-Host " BACKEND API VERIFICATION COMPLETED "
Write-Host "========================================="
