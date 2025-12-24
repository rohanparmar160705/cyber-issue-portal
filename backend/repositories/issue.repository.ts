import { prisma } from '../utils/db';
import { CreateIssueDTO, UpdateIssueDTO, IssueType } from '../models/issue.model';
import { Issue } from '@prisma/client';

export class IssueRepository {

  // Get all issues for a user, optionally filtered by type
  // Takes: userId (number), optional typeFilter (IssueType)
  // Returns: array of Issue objects
  async findAllByUserId(userId: number, typeFilter?: IssueType): Promise<Issue[]> {
    return prisma.issue.findMany({
      where: {
        userId,
        ...(typeFilter && { type: typeFilter }),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Find a specific issue by ID
  // Takes: id (number)
  // Returns: Issue object or null
  async findById(id: number): Promise<Issue | null> {
    return prisma.issue.findUnique({
      where: { id },
    });
  }

  // Create a new issue
  // Takes: userId (number), CreateIssueDTO
  // Returns: created Issue object
  async createIssue(userId: number, data: CreateIssueDTO): Promise<Issue> {
    return prisma.issue.create({
      data: {
        userId,
        type: data.type,
        title: data.title,
        description: data.description,
        priority: data.priority,
        status: data.status,
      },
    });
  }

  // Update an existing issue by ID
  // Takes: id (number), UpdateIssueDTO
  // Returns: updated Issue object
  async updateIssue(id: number, data: UpdateIssueDTO): Promise<Issue> {
    return prisma.issue.update({
      where: { id },
      data,
    });
  }

  // Delete an issue by ID
  // Takes: id (number)
  // Returns: void
  async deleteIssue(id: number): Promise<void> {
    await prisma.issue.delete({
      where: { id },
    });
  }
}

/*
  Purpose:

  - Handles database interactions for issues using Prisma
  - Provides CRUD operations: create, read, update, delete
  - Returns typed Issue objects for use in IssueService/Controller
  - Centralizes database logic for maintainability
*/
