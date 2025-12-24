import { NextRequest, NextResponse } from 'next/server';
import { AuthController } from '../controllers/auth.controller';

const authController = new AuthController();

export async function handleRequests(req: NextRequest, { params }: { params: Promise<{ action: string }> }) {
  const { action } = await params;

  // Since it's a catch-all, we check the action
  // Actually, standard Dynamic Routes are array for catch-all [...action] or string for [action]
  // Assuming [action] as the user wants specific simplified routes
  
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

  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}

// Exports for Next.js App Router (standard exports GET, POST, etc.)
// However, since we want a "single route file", we can export a general handler if we use catch-all.
// If this file IS the route file used by Next.js, it needs GET/POST exports.
// If this file is just the logic, we export functions.
// I will export standard GET/POST methods that delegate to handleRequests.
export async function GET(req: NextRequest, context: any) {
  return handleRequests(req, context);
}

export async function POST(req: NextRequest, context: any) {
  return handleRequests(req, context);
}
