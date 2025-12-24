import { NextRequest, NextResponse } from 'next/server';
import { handleRequests as authHandler } from '../../../backend/routes/auth.routes';
import { handleRequests as userHandler } from '../../../backend/routes/user.routes';

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

async function dispatch(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Remove '/api/' and split path
  const pathParts = pathname.replace(/^\/api\//, '').split('/');

  const domain = pathParts[0]; // e.g., 'auth' or 'users'
  const action = pathParts[1]; // e.g., 'login' or 'profile'

  // Mock context to match route handler signature
  const mockContext = { 
    params: Promise.resolve({ action }) 
  };

  if (domain === 'auth') {
    return authHandler(req, mockContext);
  } else if (domain === 'users') {
    return userHandler(req, mockContext);
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
