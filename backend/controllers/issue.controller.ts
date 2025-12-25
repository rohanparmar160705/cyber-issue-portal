import { NextRequest, NextResponse } from 'next/server';
import { IssueService } from '../services/issue.service';
import { IssueValidator } from '../validators/issue.validator';
import { ErrorHandler } from '../utils/error.handler';
import { AuthMiddleware } from '../middleware/auth.middleware';

export class IssueController {
  private issueService: IssueService;

  constructor() {
    this.issueService = new IssueService();
  }

  // Get all issues for the authenticated user
  // Takes: req (NextRequest) with optional query param 'type'
  // Returns: JSON array of issues (status 200) or error
  async getAllIssues(req: NextRequest) {
    try {
      const userPayload = await AuthMiddleware.authenticate(req);
      const { searchParams } = req.nextUrl;
      const typeFilter = searchParams.get('type');
      
      const issues = await this.issueService.getAllIssues(userPayload.id, typeFilter || undefined);
      return NextResponse.json(issues, { status: 200 });
    } catch (error: any) {
      if (error.message === 'Unauthorized') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
      return this.handleError(error);
    }
  }

  // Get a specific issue by ID for authenticated user
  // Takes: req (NextRequest), issueId (number)
  // Returns: JSON issue object (status 200) or error
  async getIssueById(req: NextRequest, issueId: number) {
    try {
      const userPayload = await AuthMiddleware.authenticate(req);
      const issue = await this.issueService.getIssueById(userPayload.id, issueId);
      return NextResponse.json(issue, { status: 200 });
    } catch (error: any) {
      if (error.message === 'Unauthorized') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
      return this.handleError(error);
    }
  }

  // Create a new issue for authenticated user
  // Takes: req (NextRequest) with issue data in JSON body
  // Returns: JSON created issue (status 201) or error
  async createIssue(req: NextRequest) {
    try {
      const userPayload = await AuthMiddleware.authenticate(req);
      const body = await req.json();
      const validatedData = IssueValidator.validateCreateIssue(body);
      const issue = await this.issueService.createIssue(userPayload.id, validatedData);
      return NextResponse.json(issue, { status: 201 });
    } catch (error: any) {
      if (error.message === 'Unauthorized') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
      return this.handleError(error);
    }
  }

  // Update an existing issue by ID
  // Takes: req (NextRequest) with issue data in JSON body, issueId (number)
  // Returns: JSON updated issue (status 200) or error
  async updateIssue(req: NextRequest, issueId: number) {
    try {
      const userPayload = await AuthMiddleware.authenticate(req);
      const body = await req.json();
      const validatedData = IssueValidator.validateUpdateIssue(body);
      const issue = await this.issueService.updateIssue(userPayload.id, issueId, validatedData);
      return NextResponse.json(issue, { status: 200 });
    } catch (error: any) {
      if (error.message === 'Unauthorized') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
      return this.handleError(error);
    }
  }

  // Delete an issue by ID
  // Takes: req (NextRequest), issueId (number)
  // Returns: JSON message (status 200) or error
  async deleteIssue(req: NextRequest, issueId: number) {
    try {
      const userPayload = await AuthMiddleware.authenticate(req);
      await this.issueService.deleteIssue(userPayload.id, issueId);
      return NextResponse.json({ message: 'Issue deleted successfully' }, { status: 200 });
    } catch (error: any) {
      if (error.message === 'Unauthorized') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
      return this.handleError(error);
    }
  }

  // Centralized error handler
  // Takes: error (any)
  // Returns: NextResponse with proper status and message
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

/*
  Purpose:

  - Handles CRUD operations for issues
  - Authenticates user via AuthMiddleware
  - Validates input using IssueValidator
  - Returns proper JSON responses with status codes
*/

