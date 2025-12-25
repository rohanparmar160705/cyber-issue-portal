import { NextRequest, NextResponse } from 'next/server';
import { JwtUtils } from '../utils/jwt.utils';

export class AuthMiddleware {
  // Authenticate user by verifying JWT token from cookies
  // Takes: NextRequest
  // Returns: decoded token payload if valid
  // Throws: Error('Unauthorized') if token missing or invalid
  static async authenticate(req: NextRequest) {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      throw new Error('Unauthorized');
    }

    try {
      return JwtUtils.verifyToken(token); // verify token
    } catch (e) {
      throw new Error('Unauthorized');
    }
  }

  // Middleware to protect routes
  // Takes: NextRequest
  // Returns: NextResponse.next() with user info in headers if valid
  //          NextResponse.json({message: 'Unauthorized'}, 401) if invalid
  static async middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = JwtUtils.verifyToken(token);

      // Add user info to request headers for downstream handlers
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set('x-user-id', decoded.id.toString());
      requestHeaders.set('x-user-email', decoded.email);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (e) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
  }
}

