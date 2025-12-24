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
// ... previous content ...

---

# User API Documentation

Base URL: `http://localhost:3000/api/users`

## 1. Get User Profile

**Endpoint:** `GET /profile`
**Headers:** Requires `token` cookie.

**Response (200 OK):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2023-10-27T10:00:00.000Z"
}
```

## 2. Update User Profile

**Endpoint:** `PUT /profile`
**Headers:** Requires `token` cookie.
**Content-Type:** `application/json`

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "newemail@example.com" // Optional
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "email": "newemail@example.com",
  "name": "Jane Doe",
  "createdAt": "2023-10-27T10:00:00.000Z"
}
```

---

# PowerShell Testing Commands (Cont.)

### 6. Get Profile
```powershell
$profile = Invoke-RestMethod -Uri "http://localhost:3000/api/users/profile" -Method Get -WebSession $session
$profile | ConvertTo-Json -Depth 5
```

### 7. Update Profile
```powershell
$updateBody = @{
    name = "Updated PowerShell User"
} | ConvertTo-Json

$updatedProfile = Invoke-RestMethod -Uri "http://localhost:3000/api/users/profile" -Method Put -Body $updateBody -ContentType "application/json" -WebSession $session
$updatedProfile | ConvertTo-Json -Depth 5
```

---

# Issues API Documentation

Base URL: `http://localhost:3000/api/issues`

## 1. Get All Issues

**Endpoint:** `GET /issues`
**Headers:** Requires `token` cookie.
**Query Parameters:** 
- `type` (optional): Filter by issue type (`CLOUD_SECURITY`, `RETEAM_ASSESSMENT`, `VAPT`)

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "userId": 1,
    "type": "CLOUD_SECURITY",
    "title": "S3 Bucket Misconfiguration",
    "description": "Public access enabled on production bucket",
    "priority": "HIGH",
    "status": "OPEN",
    "createdAt": "2023-10-27T10:00:00.000Z",
    "updatedAt": "2023-10-27T10:00:00.000Z"
  }
]
```

## 2. Create Issue

**Endpoint:** `POST /issues`
**Headers:** Requires `token` cookie.
**Content-Type:** `application/json`

**Request Body:**
```json
{
  "type": "CLOUD_SECURITY",
  "title": "S3 Bucket Misconfiguration",
  "description": "Public access enabled on production bucket",
  "priority": "HIGH",
  "status": "OPEN"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "userId": 1,
  "type": "CLOUD_SECURITY",
  "title": "S3 Bucket Misconfiguration",
  "description": "Public access enabled on production bucket",
  "priority": "HIGH",
  "status": "OPEN",
  "createdAt": "2023-10-27T10:00:00.000Z",
  "updatedAt": "2023-10-27T10:00:00.000Z"
}
```

## 3. Get Single Issue

**Endpoint:** `GET /issues/{id}`
**Headers:** Requires `token` cookie.

**Response (200 OK):**
```json
{
  "id": 1,
  "userId": 1,
  "type": "CLOUD_SECURITY",
  "title": "S3 Bucket Misconfiguration",
  "description": "Public access enabled on production bucket",
  "priority": "HIGH",
  "status": "OPEN",
  "createdAt": "2023-10-27T10:00:00.000Z",
  "updatedAt": "2023-10-27T10:00:00.000Z"
}
```

## 4. Update Issue

**Endpoint:** `PUT /issues/{id}`
**Headers:** Requires `token` cookie.
**Content-Type:** `application/json`

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "priority": "CRITICAL",
  "status": "IN_PROGRESS"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "userId": 1,
  "type": "CLOUD_SECURITY",
  "title": "Updated Title",
  "description": "Updated description",
  "priority": "CRITICAL",
  "status": "IN_PROGRESS",
  "createdAt": "2023-10-27T10:00:00.000Z",
  "updatedAt": "2023-10-27T11:00:00.000Z"
}
```

## 5. Delete Issue

**Endpoint:** `DELETE /issues/{id}`
**Headers:** Requires `token` cookie.

**Response (200 OK):**
```json
{
  "message": "Issue deleted successfully"
}
```

---

# PowerShell Testing Commands (Issues)

### 8. Create Issue
```powershell
$issueBody = @{
    type = "CLOUD_SECURITY"
    title = "S3 Bucket Misconfiguration"
    description = "Public access enabled on production S3 bucket containing sensitive data"
    priority = "HIGH"
    status = "OPEN"
} | ConvertTo-Json

$newIssue = Invoke-RestMethod -Uri "http://localhost:3000/api/issues" -Method Post -Body $issueBody -ContentType "application/json" -WebSession $session
$newIssue | ConvertTo-Json -Depth 5
$issueId = $newIssue.id
```

### 9. Get All Issues
```powershell
$allIssues = Invoke-RestMethod -Uri "http://localhost:3000/api/issues" -Method Get -WebSession $session
$allIssues | ConvertTo-Json -Depth 5
```

### 10. Filter Issues by Type
```powershell
$cloudIssues = Invoke-RestMethod -Uri "http://localhost:3000/api/issues?type=CLOUD_SECURITY" -Method Get -WebSession $session
$cloudIssues | ConvertTo-Json -Depth 5
```

### 11. Get Single Issue
```powershell
$singleIssue = Invoke-RestMethod -Uri "http://localhost:3000/api/issues/$issueId" -Method Get -WebSession $session
$singleIssue | ConvertTo-Json -Depth 5
```

### 12. Update Issue
```powershell
$updateIssueBody = @{
    title = "Updated: S3 Bucket Security Issue"
    status = "IN_PROGRESS"
    priority = "CRITICAL"
} | ConvertTo-Json

$updatedIssue = Invoke-RestMethod -Uri "http://localhost:3000/api/issues/$issueId" -Method Put -Body $updateIssueBody -ContentType "application/json" -WebSession $session
$updatedIssue | ConvertTo-Json -Depth 5
```

### 13. Delete Issue
```powershell
$deleteResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/issues/$issueId" -Method Delete -WebSession $session
$deleteResponse | ConvertTo-Json -Depth 5
```


