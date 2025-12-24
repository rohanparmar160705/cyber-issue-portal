import { NextRequest, NextResponse } from 'next/server';
import { JwtUtils } from '../utils/jwt.utils';

export class AuthMiddleware {
  static async authenticate(req: NextRequest) {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      throw new Error('Unauthorized');
    }

    try {
      return JwtUtils.verifyToken(token);
    } catch (e) {
      throw new Error('Unauthorized');
    }
  }

  static async middleware(req: NextRequest) {
      const token = req.cookies.get('token')?.value;
      
      if (!token) {
          return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
      
      try {
          const decoded = JwtUtils.verifyToken(token);
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
