import { NextRequest, NextResponse } from 'next/server';
import { handleRequests as authHandler } from '../../../backend/routes/auth.routes';
import { handleRequests as userHandler } from '../../../backend/routes/user.routes';
import { handleRequests as issueHandler } from '../../../backend/routes/issue.routes';
import { handleRequests as projectHandler } from '../../../backend/routes/project.routes';
import { RateLimiter } from '../../../backend/middleware/rate-limiter.middleware';

// Singleton rate limiter instance shared across all requests
const rateLimiter = new RateLimiter();

// --------------------
// Entry points for HTTP methods
// All methods delegate to the same dispatcher
// --------------------
export async function GET(req: NextRequest) {
  return dispatch(req);
}

export async function POST(req: NextRequest) {
  return dispatch(req);
}

export async function PUT(req: NextRequest) {
  return dispatch(req);
}

export async function DELETE(req: NextRequest) {
  return dispatch(req);
}

// --------------------
// Main dispatcher function
// Handles all /api/* requests, applies rate limiting, routes to correct handler
// --------------------
async function dispatch(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Parse domain and action from path
  // Example: /api/auth/login -> domain='auth', action='login'
  const pathParts = pathname.replace(/^\/api\//, '').split('/');
  const domain = pathParts[0]; // e.g., 'auth', 'users', 'issues', 'projects'
  const action = pathParts.slice(1).join('/'); // e.g., 'login', 'profile', '123'

  // --------------------
  // RATE LIMITING
  // --------------------
  const endpoint = pathname; // full API path, used for limiter key
  const method = req.method; // HTTP method (GET, POST, etc.)
  
  // Check current request against rate limiter
  const rateLimitResult = await rateLimiter.check(req, endpoint, method);
  const rateLimitHeaders = rateLimiter.getHeaders(rateLimitResult);

  // If the request exceeds the limit, return 429 immediately
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      {
        error: 'Rate limit exceeded',
        message: 'Too many requests. Please try again later.',
        retryAfter: parseInt(rateLimitHeaders['Retry-After'] || '0'), // seconds until reset
        limit: rateLimitResult.limit, // max allowed requests
        reset: rateLimitResult.resetAt // timestamp when limit resets
      },
      {
        status: 429,
        headers: rateLimitHeaders as unknown as HeadersInit // include rate-limit headers
      }
    );
  }

  // --------------------
  // ROUTE HANDLING
  // --------------------
  // Mock context to match backend route handler signature
  const mockContext = { params: Promise.resolve({ action: action || 'list' }) };
  let response: NextResponse;

  // Route to the appropriate backend handler based on domain
  if (domain === 'auth') {
    response = await authHandler(req, mockContext);
  } else if (domain === 'users') {
    response = await userHandler(req, mockContext);
  } else if (domain === 'issues') {
    response = await issueHandler(req, mockContext);
  } else if (domain === 'projects') {
    response = await projectHandler(req, mockContext);
  } else {
    // Unknown domain -> 404 Not Found
    response = NextResponse.json({ message: 'Not Found' }, { status: 404 });
  }

  // --------------------
  // Attach rate-limit headers to the response
  // Ensures clients can track remaining quota and reset time
  // --------------------
  Object.entries(rateLimitHeaders).forEach(([key, value]) => {
    if (value !== undefined) {
      response.headers.set(key, value);
    }
  });

  return response;
}

/*
  Purpose:

  - Acts as a single entry point for all /api/* requests
  - Applies rate-limiting before routing to backend handlers
  - Dispatches requests to the correct handler based on domain
  - Supports all HTTP methods: GET, POST, PUT, DELETE
*/
