import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '../services/user.service';
import { UserValidator } from '../validators/user.validator';
import { ErrorHandler } from '../utils/error.handler';
import { AuthMiddleware } from '../middleware/auth.middleware';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  // Get currently logged-in user's profile
  // Takes: NextRequest
  // Returns: JSON response with user data
  async getProfile(req: NextRequest) {
    try {
      const userPayload = await AuthMiddleware.authenticate(req); // verify token
      const user = await this.userService.getUserProfile(userPayload.id);
      return NextResponse.json(user, { status: 200 });
    } catch (error: any) {
      if (error.message === 'Unauthorized') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
      return this.handleError(error);
    }
  }

  // Update currently logged-in user's profile
  // Takes: NextRequest with update data
  // Returns: JSON response with updated user
  async updateProfile(req: NextRequest) {
    try {
      const userPayload = await AuthMiddleware.authenticate(req); // verify token
      const body = await req.json(); // read request body
      const validatedData = UserValidator.validateUpdateProfile(body); // validate input
      const user = await this.userService.updateUserProfile(
        userPayload.id,
        validatedData
      );
      return NextResponse.json(user, { status: 200 });
    } catch (error: any) {
      if (error.message === 'Unauthorized') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
      return this.handleError(error);
    }
  }

  // Common API error handler
  private handleError(error: any) {
    if (error instanceof ErrorHandler) {
      return NextResponse.json({ message: error.message }, { status: error.statusCode });
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
    }

    if (error?.name === 'ZodError') {
      return NextResponse.json({ message: error.errors }, { status: 400 });
    }

    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

/*
  Extra notes:

  NextRequest:
  - Represents an incoming HTTP request in Next.js App Router
  - Provides methods like req.json(), req.cookies, req.headers, etc.

  NextResponse:
  - Used to create HTTP responses
  - Allows setting JSON body, status code, headers, and cookies
  - Example: NextResponse.json(data, { status: 200 })
*/

