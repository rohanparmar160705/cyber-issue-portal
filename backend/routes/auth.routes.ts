import { NextRequest, NextResponse } from 'next/server';
import { AuthController } from '../controllers/auth.controller';

const authController = new AuthController();

// General request handler for auth routes
// Supports POST: register, login, logout
// Supports GET: me
export async function handleRequests(
  req: NextRequest,
  { params }: { params: Promise<{ action: string }> }
) {
  const { action } = await params;

  if (req.method === 'POST') {
    switch (action) {
      case 'register':
        return authController.register(req);
      case 'login':
        return authController.login(req);
      case 'logout':
        return authController.logout();
      default:
        return NextResponse.json({ message: 'Not Found' }, { status: 404 });
    }
  } else if (req.method === 'GET') {
    switch (action) {
      case 'me':
        return authController.me(req);
      default:
        return NextResponse.json({ message: 'Not Found' }, { status: 404 });
    }
  }

  // Unsupported HTTP method
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}

// Standard GET/POST exports for Next.js App Router
export async function GET(req: NextRequest, context: any) {
  return handleRequests(req, context);
}

// Standard POST export for Next.js App Router
export async function POST(req: NextRequest, context: any) {
  return handleRequests(req, context);
}

/*
  Notes:
  - Acts as a single route handler for auth actions
  - Delegates requests to AuthController methods
  - Can handle multiple actions via dynamic/catch-all route
*/
