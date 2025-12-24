import { NextRequest, NextResponse } from 'next/server';
import { handleRequests as authHandler } from '../../../backend/routes/auth.routes';
import { handleRequests as userHandler } from '../../../backend/routes/user.routes';
import { handleRequests as issueHandler } from '../../../backend/routes/issue.routes';

// Universal dispatcher for all /api/* requests
// Delegates to specific route handlers based on URL path
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

async function dispatch(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Remove '/api/' and split path
  const pathParts = pathname.replace(/^\/api\//, '').split('/');

  const domain = pathParts[0]; // e.g., 'auth', 'users', 'issues'
  const action = pathParts[1]; // e.g., 'login', 'profile', '123'

  // Mock context to match route handler signature
  const mockContext = { 
    params: Promise.resolve({ action: action || 'list' }) 
  };

  if (domain === 'auth') {
    return authHandler(req, mockContext);
  } else if (domain === 'users') {
    return userHandler(req, mockContext);
  } else if (domain === 'issues') {
    return issueHandler(req, mockContext);
  }

  return NextResponse.json({ message: 'Not Found' }, { status: 404 });
}

/*
  Purpose:

  - Acts as a single entry point for all /api/* requests
  - Dispatches requests to the correct backend route handler
  - Supports GET, POST, PUT methods
  - Simplifies routing when using Next.js rewrites
*/
