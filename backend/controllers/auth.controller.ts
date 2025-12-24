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

  // Register a new user
  // Takes: NextRequest
  // Returns: JSON response with created user
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

  // Login user and set auth cookie
  // Takes: NextRequest
  // Returns: JSON response + token cookie
  async login(req: NextRequest) {
    try {
      const body = await req.json();
      const validatedData = AuthValidator.validateLogin(body);
      const result = await this.authService.loginUser(validatedData);

      const response = NextResponse.json(result, { status: 200 });
      response.cookies.set('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24,
        path: '/',
      });

      return response;
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  // Logout by clearing auth cookie
  async logout() {
    const response = NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    );
    response.cookies.set('token', '', { maxAge: 0, path: '/' });
    return response;
  }

  // Get currently logged-in user
  async me(req: NextRequest) {
    try {
      const userPayload = await AuthMiddleware.authenticate(req);
      const user = await this.authService.getCurrentUser(userPayload.email);
      if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }
      return NextResponse.json(user);
    } catch (error: any) {
      if (error.message === 'Unauthorized') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
      return this.handleError(error);
    }
  }

  // Centralized error handling
  private handleError(error: any) {
    if (error instanceof ErrorHandler) {
      return NextResponse.json(
        { message: error.message },
        { status: error.statusCode }
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
    }

    if (error?.name === 'ZodError') {
      return NextResponse.json({ message: error.errors }, { status: 400 });
    }

    console.error(error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/*
  Extra notes:

  NextRequest:
  - Represents an incoming HTTP request in Next.js App Router
  - Extends the standard Web Request API
  - Provides helpers like req.json(), req.cookies, req.headers, etc.

  NextResponse:
  - Used to construct HTTP responses in Next.js
  - Allows returning JSON, setting status codes, headers, and cookies
  - Example: NextResponse.json(data, { status: 200 })
*/
