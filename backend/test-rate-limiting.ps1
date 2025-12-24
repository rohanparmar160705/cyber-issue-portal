# Rate Limiting Test Script
Clear-Host

Write-Host "========================================="
Write-Host " RATE LIMITING TEST "
Write-Host "========================================="

$BaseUrl = "http://localhost:3000/api"
$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession

# Login first
Write-Host "`n[1] LOGIN USER"
$loginBody = @{
    email = "psuser_124431342@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod `
        -Uri "$BaseUrl/auth/login" `
        -Method Post `
        -Body $loginBody `
        -ContentType "application/json" `
        -WebSession $session
    Write-Host "Logged in successfully"
} catch {
    Write-Host "Login failed. Please run main test script first to create user."
    exit
}

# Test 1: Normal requests (under limit)
Write-Host "`n[2] TEST: 5 REQUESTS TO /api/auth/me (Should succeed)"
1..5 | ForEach-Object {
    $requestNum = $_
    try {
        $response = Invoke-WebRequest `
            -Uri "$BaseUrl/auth/me" `
            -Method Get `
            -WebSession $session
        
        Write-Host "  Request $requestNum"
        Write-Host "    Status: $($response.StatusCode)"
        Write-Host "    Limit: $($response.Headers['X-RateLimit-Limit'])"
        Write-Host "    Remaining: $($response.Headers['X-RateLimit-Remaining'])"
        Write-Host "    Reset: $($response.Headers['X-RateLimit-Reset'])"
    } catch {
        Write-Host "  Request $requestNum FAILED"
    }
}

# Test 2: Exceed limit on login endpoint (limit is 10)
Write-Host "`n[3] TEST: 12 REQUESTS TO /api/auth/login (Limit is 10, should get 429)"
$testLoginBody = @{
    email = "test@example.com"
    password = "wrong"
} | ConvertTo-Json

1..12 | ForEach-Object {
    $requestNum = $_
    try {
        $response = Invoke-WebRequest `
            -Uri "$BaseUrl/auth/login" `
            -Method Post `
            -Body $testLoginBody `
            -ContentType "application/json"
        
        Write-Host "  Request $requestNum Status $($response.StatusCode), Remaining: $($response.Headers['X-RateLimit-Remaining'])"
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode -eq 429) {
            Write-Host "  Request $requestNum RATE LIMITED (429) - Working as expected!"
        } else {
            Write-Host "  Request $requestNum Status $statusCode"
        }
    }
}

Write-Host "`n========================================="
Write-Host " RATE LIMITING TEST COMPLETED "
Write-Host "========================================="
