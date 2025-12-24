import { NextRequest, NextResponse } from 'next/server';
import { ProjectController } from '../controllers/project.controller';

const projectController = new ProjectController();

// Main handler for /api/projects/* routes
export async function handleRequests(
  req: NextRequest,
  { params }: { params: Promise<{ action: string }> }
) {
  const { action } = await params;

  // Handle list or create operations (no ID required)
  if (!action || action === 'list') {
    if (req.method === 'GET') {
      return projectController.getAllProjects(req); // Returns all projects (status 200)
    } else if (req.method === 'POST') {
      return projectController.createProject(req); // Creates new project (status 201)
    }
  }

  // Check if this is a nested route: /api/projects/{id}/issues
  const pathParts = action.split('/');
  if (pathParts.length === 2 && pathParts[1] === 'issues') {
    const projectId = parseInt(pathParts[0], 10);
    if (isNaN(projectId)) {
      return NextResponse.json({ message: 'Invalid project ID' }, { status: 400 });
    }
    if (req.method === 'GET') {
      return projectController.getProjectIssues(req, projectId); // Returns project issues (status 200)
    }
  }

  // Handle single project operations (ID required)
  const projectId = parseInt(action, 10);
  if (isNaN(projectId)) {
    return NextResponse.json({ message: 'Invalid project ID' }, { status: 400 });
  }

  if (req.method === 'GET') {
    return projectController.getProjectById(req, projectId); // Returns specific project (status 200)
  } else if (req.method === 'PUT') {
    return projectController.updateProject(req, projectId); // Updates project (status 200)
  } else if (req.method === 'DELETE') {
    return projectController.deleteProject(req, projectId); // Deletes project (status 200)
  }

  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}

// Standard Next.js route exports for methods
export async function GET(req: NextRequest, context: any) {
  return handleRequests(req, context);
}

export async function POST(req: NextRequest, context: any) {
  return handleRequests(req, context);
}

export async function PUT(req: NextRequest, context: any) {
  return handleRequests(req, context);
}

export async function DELETE(req: NextRequest, context: any) {
  return handleRequests(req, context);
}

/*
  Purpose:

  - Handles routing for /api/projects/* endpoints
  - Delegates CRUD operations to ProjectController
  - Parses 'action' param to determine operation or project ID
  - Supports nested route /api/projects/{id}/issues
  - Returns JSON responses with appropriate HTTP status codes
*/
