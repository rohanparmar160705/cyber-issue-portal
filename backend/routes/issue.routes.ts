import { NextRequest, NextResponse } from 'next/server';
import { IssueController } from '../controllers/issue.controller';

const issueController = new IssueController();

// Main handler for /api/issues/* routes
// Takes: req (NextRequest), params with 'action' (string)
// Returns: JSON response from IssueController or error
export async function handleRequests(
  req: NextRequest,
  { params }: { params: Promise<{ action: string }> }
) {
  const { action } = await params;

  // Handle list or create operations (no ID required)
  if (!action || action === 'list') {
    if (req.method === 'GET') {
      return issueController.getAllIssues(req); // Returns all issues (status 200)
    } else if (req.method === 'POST') {
      return issueController.createIssue(req); // Creates new issue (status 201)
    }
  }

  // Handle single issue operations (ID required)
  const issueId = parseInt(action, 10);
  if (isNaN(issueId)) {
    return NextResponse.json({ message: 'Invalid issue ID' }, { status: 400 });
  }

  if (req.method === 'GET') {
    return issueController.getIssueById(req, issueId); // Returns specific issue (status 200)
  } else if (req.method === 'PUT') {
    return issueController.updateIssue(req, issueId); // Updates issue (status 200)
  } else if (req.method === 'DELETE') {
    return issueController.deleteIssue(req, issueId); // Deletes issue (status 200)
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

  - Handles routing for /api/issues/* endpoints
  - Delegates CRUD operations to IssueController
  - Parses 'action' param to determine operation or issue ID
  - Returns JSON responses with appropriate HTTP status codes
*/

