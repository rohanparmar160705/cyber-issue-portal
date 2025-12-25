import { z } from 'zod';
import { CreateProjectDTO, UpdateProjectDTO, ProjectStatus } from '../models/project.model';

export class ProjectValidator {

  // Zod schema for creating a new project
  static createProjectSchema = z.object({
    name: z.string().min(3).max(200),
    description: z.string().min(10),
    clientName: z.string().min(2).max(200).optional(),
    status: z.nativeEnum(ProjectStatus).optional(),
  });

  // Zod schema for updating an existing project
  static updateProjectSchema = z.object({
    name: z.string().min(3).max(200).optional(),
    description: z.string().min(10).optional(),
    clientName: z.string().min(2).max(200).optional(),
    status: z.nativeEnum(ProjectStatus).optional(),
  });

  // Validate data for creating a project
  static validateCreateProject(data: any): CreateProjectDTO {
    return this.createProjectSchema.parse(data);
  }

  // Validate data for updating a project
  static validateUpdateProject(data: any): UpdateProjectDTO {
    return this.updateProjectSchema.parse(data);
  }
}

/*
  Purpose:

  - Provides validation for Project creation and updates
  - Ensures type safety and field constraints using Zod
  - Used by ProjectController to validate incoming request bodies
*/

