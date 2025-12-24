# Auth API Documentation

Base URL: `http://localhost:3000/api/auth`

## 1. Register User

**Endpoint:** `POST /register`
**Content-Type:** `application/json`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2023-10-27T10:00:00.000Z"
}
```

---

## 2. Login User

**Endpoint:** `POST /login`
**Content-Type:** `application/json`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
- Sets `token` HTTP-only cookie.
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2023-10-27T10:00:00.000Z"
  },
  "token": "eyJhbG..."
}
```

---

## 3. Get Current User (Me)

**Endpoint:** `GET /me`
**Headers:** Requires `token` cookie (automatically sent by browser/client).

**Response (200 OK):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2023-10-27T10:00:00.000Z"
}
```

**Response (401 Unauthorized):**
```json
{
  "message": "Unauthorized"
}
```

---

## 4. Logout User

**Endpoint:** `POST /logout`

**Response (200 OK):**
- Clears `token` cookie.
```json
{
  "message": "Logged out successfully"
}
```

---

# PowerShell Testing Commands

Run these commands in PowerShell to test the API. The `| ConvertTo-Json -Depth 5` ensures you see the full response structure.

### 1. Register
```powershell
$registerBody = @{
    email = "testUser_" + (Get-Random) + "@example.com"
    password = "securePassword123"
    name = "PowerShell User"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" -Method Post -Body $registerBody -ContentType "application/json" | ConvertTo-Json -Depth 5
```

### 2. Login (and save session)
```powershell
$loginBody = @{
    email = "psuser2@example.com"  # Replace with the email you just registered
    password = "password123"
} | ConvertTo-Json

# Create a session to store the HTTP-Only cookie
$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession

$response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json" -WebSession $session
$response | ConvertTo-Json -Depth 5
```

### 3. Get Me (Protected Route)
```powershell
# Uses the $session object from login to send the cookie
$me = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/me" -Method Get -WebSession $session
$me | ConvertTo-Json -Depth 5
```

### 4. Logout
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/auth/logout" -Method Post -WebSession $session | ConvertTo-Json -Depth 5
```

### 5. Verify Logout (Should fail)
```powershell
try {
    Invoke-RestMethod -Uri "http://localhost:3000/api/auth/me" -Method Get -WebSession $session
} catch {
    Write-Host "Request failed as expected: $($_.Exception.Message)"
}
```
