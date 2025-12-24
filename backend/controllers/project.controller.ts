import { NextRequest, NextResponse } from 'next/server';
import { ProjectService } from '../services/project.service';
import { ProjectValidator } from '../validators/project.validator';
import { ErrorHandler } from '../utils/error.handler';
import { AuthMiddleware } from '../middleware/auth.middleware';

export class ProjectController {
  private projectService: ProjectService;

  constructor() {
    this.projectService = new ProjectService();
  }

  // Get all projects for the authenticated user
  async getAllProjects(req: NextRequest) {
    try {
      const userPayload = await AuthMiddleware.authenticate(req);
      const projects = await this.projectService.getAllProjects(userPayload.id);
      return NextResponse.json(projects, { status: 200 });
    } catch (error: any) {
      if (error.message === 'Unauthorized') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
      return this.handleError(error);
    }
  }

  // Get a specific project by ID for authenticated user
  async getProjectById(req: NextRequest, projectId: number) {
    try {
      const userPayload = await AuthMiddleware.authenticate(req);
      const project = await this.projectService.getProjectById(userPayload.id, projectId);
      return NextResponse.json(project, { status: 200 });
    } catch (error: any) {
      if (error.message === 'Unauthorized') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
      return this.handleError(error);
    }
  }

  // Create a new project for authenticated user
  async createProject(req: NextRequest) {
    try {
      const userPayload = await AuthMiddleware.authenticate(req);
      const body = await req.json();
      const validatedData = ProjectValidator.validateCreateProject(body);
      const project = await this.projectService.createProject(userPayload.id, validatedData);
      return NextResponse.json(project, { status: 201 });
    } catch (error: any) {
      if (error.message === 'Unauthorized') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
      return this.handleError(error);
    }
  }

  // Update an existing project by ID
  async updateProject(req: NextRequest, projectId: number) {
    try {
      const userPayload = await AuthMiddleware.authenticate(req);
      const body = await req.json();
      const validatedData = ProjectValidator.validateUpdateProject(body);
      const project = await this.projectService.updateProject(userPayload.id, projectId, validatedData);
      return NextResponse.json(project, { status: 200 });
    } catch (error: any) {
      if (error.message === 'Unauthorized') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
      return this.handleError(error);
    }
  }

  // Delete a project by ID
  async deleteProject(req: NextRequest, projectId: number) {
    try {
      const userPayload = await AuthMiddleware.authenticate(req);
      await this.projectService.deleteProject(userPayload.id, projectId);
      return NextResponse.json({ message: 'Project deleted successfully' }, { status: 200 });
    } catch (error: any) {
      if (error.message === 'Unauthorized') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
      return this.handleError(error);
    }
  }

  // Get all issues for a specific project
  async getProjectIssues(req: NextRequest, projectId: number) {
    try {
      const userPayload = await AuthMiddleware.authenticate(req);
      const issues = await this.projectService.getProjectIssues(userPayload.id, projectId);
      return NextResponse.json(issues, { status: 200 });
    } catch (error: any) {
      if (error.message === 'Unauthorized') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
      return this.handleError(error);
    }
  }

  // Centralized error handler
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

  - Handles CRUD operations for projects
  - Authenticates user via AuthMiddleware
  - Validates input using ProjectValidator
  - Returns proper JSON responses with status codes
  - Includes nested endpoint for project issues
*/
