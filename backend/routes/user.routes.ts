import { NextRequest, NextResponse } from 'next/server';
import { UserController } from '../controllers/user.controller';

const userController = new UserController();

// General request handler for user routes
// Supports GET: fetch profile
// Supports PUT: update profile
export async function handleRequests(
  req: NextRequest,
  { params }: { params: Promise<{ action: string }> }
) {
  const { action } = await params;

  if (action === 'profile') {
    if (req.method === 'GET') {
      return userController.getProfile(req);
    } else if (req.method === 'PUT') {
      return userController.updateProfile(req);
    } else {
      return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
    }
  }

  return NextResponse.json({ message: 'Not Found' }, { status: 404 });
}

// Standard exports for Next.js App Router
export async function GET(req: NextRequest, context: any) {
  return handleRequests(req, context);
}

// Standard exports for Next.js App Router
export async function PUT(req: NextRequest, context: any) {
  return handleRequests(req, context);
}

/*
  Notes:
  - Acts as a single route handler for user-related actions
  - Delegates requests to UserController methods
  - Handles profile fetching (GET) and updating (PUT)
*/

