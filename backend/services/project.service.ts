import { ProjectRepository } from '../repositories/project.repository';
import { ErrorHandler } from '../utils/error.handler';
import { CreateProjectDTO, UpdateProjectDTO, ProjectResponseDTO } from '../models/project.model';

export class ProjectService {
  private projectRepository: ProjectRepository;

  constructor() {
    this.projectRepository = new ProjectRepository();
  }

  // Get all projects for a user
  async getAllProjects(userId: number): Promise<ProjectResponseDTO[]> {
    const projects = await this.projectRepository.findAllByUserId(userId);
    return projects.map(project => this.mapToDTO(project));
  }

  // Get a specific project by ID for a user
  async getProjectById(userId: number, projectId: number): Promise<ProjectResponseDTO> {
    const project = await this.projectRepository.findById(projectId);
    
    if (!project) {
      throw new ErrorHandler(404, 'Project not found');
    }

    if (project.userId !== userId) {
      throw new ErrorHandler(403, 'Forbidden: You do not own this project');
    }

    return this.mapToDTO(project);
  }

  // Create a new project
  async createProject(userId: number, data: CreateProjectDTO): Promise<ProjectResponseDTO> {
    const project = await this.projectRepository.createProject(userId, data);
    return this.mapToDTO(project);
  }

  // Update an existing project
  async updateProject(userId: number, projectId: number, data: UpdateProjectDTO): Promise<ProjectResponseDTO> {
    const project = await this.projectRepository.findById(projectId);
    
    if (!project) {
      throw new ErrorHandler(404, 'Project not found');
    }

    if (project.userId !== userId) {
      throw new ErrorHandler(403, 'Forbidden: You do not own this project');
    }

    const updatedProject = await this.projectRepository.updateProject(projectId, data);
    return this.mapToDTO(updatedProject);
  }

  // Delete a project
  async deleteProject(userId: number, projectId: number): Promise<void> {
    const project = await this.projectRepository.findById(projectId);
    
    if (!project) {
      throw new ErrorHandler(404, 'Project not found');
    }

    if (project.userId !== userId) {
      throw new ErrorHandler(403, 'Forbidden: You do not own this project');
    }

    await this.projectRepository.deleteProject(projectId);
  }

  // Get all issues for a specific project
  async getProjectIssues(userId: number, projectId: number) {
    const project = await this.projectRepository.findById(projectId);
    
    if (!project) {
      throw new ErrorHandler(404, 'Project not found');
    }

    if (project.userId !== userId) {
      throw new ErrorHandler(403, 'Forbidden: You do not own this project');
    }

    return await this.projectRepository.getProjectIssues(projectId);
  }

  // Map database Project to ProjectResponseDTO
  private mapToDTO(project: any): ProjectResponseDTO {
    return {
      id: project.id,
      userId: project.userId,
      name: project.name,
      description: project.description,
      clientName: project.clientName,
      status: project.status,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      issueCount: project._count?.issues,
    };
  }
}

/*
  Purpose:

  - Provides business logic for project management
  - Validates ownership before any operation
  - Delegates database operations to ProjectRepository
  - Returns ProjectResponseDTO objects or throws errors for invalid operations
*/

