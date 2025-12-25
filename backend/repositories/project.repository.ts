import { prisma } from '../utils/db';
import { CreateProjectDTO, UpdateProjectDTO } from '../models/project.model';
import { Project } from '@prisma/client';

export class ProjectRepository {

  // Get all projects for a user
  async findAllByUserId(userId: number): Promise<Project[]> {
    return prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { issues: true },
        },
      },
    });
  }

  // Find a specific project by ID
  async findById(id: number): Promise<Project | null> {
    return prisma.project.findUnique({
      where: { id },
      include: {
        _count: {
          select: { issues: true },
        },
      },
    });
  }

  // Create a new project
  async createProject(userId: number, data: CreateProjectDTO): Promise<Project> {
    return prisma.project.create({
      data: {
        userId,
        name: data.name,
        description: data.description,
        clientName: data.clientName,
        status: data.status,
      },
    });
  }

  // Update an existing project by ID
  async updateProject(id: number, data: UpdateProjectDTO): Promise<Project> {
    return prisma.project.update({
      where: { id },
      data,
    });
  }

  // Delete a project by ID
  async deleteProject(id: number): Promise<void> {
    await prisma.project.delete({
      where: { id },
    });
  }

  // Get all issues for a specific project
  async getProjectIssues(projectId: number) {
    return prisma.issue.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });
  }
}

/*
  Purpose:

  - Handles database interactions for projects using Prisma
  - Provides CRUD operations: create, read, update, delete
  - Returns typed Project objects for use in ProjectService/Controller
  - Includes issue count in project queries for better UX
*/

