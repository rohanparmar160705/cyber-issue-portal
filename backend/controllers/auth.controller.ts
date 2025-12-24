import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '../services/auth.service';
import { AuthValidator } from '../validators/auth.validator';
import { ErrorHandler } from '../utils/error.handler';
import { AuthMiddleware } from '../middleware/auth.middleware';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async register(req: NextRequest) {
    try {
      const body = await req.json();
      const validatedData = AuthValidator.validateRegister(body);
      const user = await this.authService.registerUser(validatedData);
      return NextResponse.json(user, { status: 201 });
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  async login(req: NextRequest) {
    try {
      const body = await req.json();
      const validatedData = AuthValidator.validateLogin(body);
      const result = await this.authService.loginUser(validatedData);
      
      const response = NextResponse.json(result, { status: 200 });
      response.cookies.set('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
      });
      return response;
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  async logout() {
    const response = NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
    response.cookies.set('token', '', { maxAge: 0, path: '/' });
    return response;
  }

  async me(req: NextRequest) {
     try {
         const userPayload = await AuthMiddleware.authenticate(req);
         const user = await this.authService.getCurrentUser(userPayload.email);
         if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });
         return NextResponse.json(user);
     } catch (error: any) {
         if (error.message === 'Unauthorized') {
             return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
         }
         return this.handleError(error);
     }
  }

  private handleError(error: any) {
    if (error instanceof ErrorHandler) {
      return NextResponse.json({ message: error.message }, { status: error.statusCode });
    } else if (error instanceof SyntaxError) {
       return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
    } else if (error?.name === 'ZodError') {
       return NextResponse.json({ message: error.errors }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
