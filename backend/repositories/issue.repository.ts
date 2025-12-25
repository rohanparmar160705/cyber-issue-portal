import { prisma } from "../utils/db";
import {
  CreateIssueDTO,
  UpdateIssueDTO,
  IssueType,
} from "../models/issue.model";
import { Issue } from "@prisma/client";

export class IssueRepository {
  // Get all issues for a user, optionally filtered by type
  // Includes project name for UI display
  async findAllByUserId(
    userId: number,
    typeFilter?: IssueType
  ): Promise<any[]> {
    const issues = await prisma.issue.findMany({
      where: {
        userId,
        ...(typeFilter && { type: typeFilter }),
      },
      include: {
        project: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Flatten for easier frontend consumption
    return issues.map((issue) => ({
      ...issue,
      projectName: issue.project?.name || null,
    }));
  }

  // Find a specific issue by ID
  async findById(id: number): Promise<Issue | null> {
    return prisma.issue.findUnique({
      where: { id },
    });
  }

  // Create a new issue
  async createIssue(userId: number, data: CreateIssueDTO): Promise<Issue> {
    return prisma.issue.create({
      data: {
        userId,
        type: data.type,
        title: data.title,
        description: data.description,
        priority: data.priority,
        status: data.status,
        projectId: data.projectId, // Added missing projectId
      },
    });
  }

  // Update an existing issue by ID
  async updateIssue(id: number, data: UpdateIssueDTO): Promise<Issue> {
    return prisma.issue.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority,
        status: data.status,
        projectId: data.projectId, // Added missing projectId
      },
    });
  }

  // Delete an issue by ID
  async deleteIssue(id: number): Promise<void> {
    await prisma.issue.delete({
      where: { id },
    });
  }
}
