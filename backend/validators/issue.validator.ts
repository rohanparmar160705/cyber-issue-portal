import { z } from 'zod';
import { CreateIssueDTO, UpdateIssueDTO, IssueType, Priority, IssueStatus } from '../models/issue.model';

export class IssueValidator {

  // Zod schema for creating a new issue
  static createIssueSchema = z.object({
    type: z.nativeEnum(IssueType),
    title: z.string().min(3).max(200),
    description: z.string().min(10),
    priority: z.nativeEnum(Priority).optional(),
    status: z.nativeEnum(IssueStatus).optional(),
  });

  // Zod schema for updating an existing issue
  static updateIssueSchema = z.object({
    title: z.string().min(3).max(200).optional(),
    description: z.string().min(10).optional(),
    priority: z.nativeEnum(Priority).optional(),
    status: z.nativeEnum(IssueStatus).optional(),
  });

  // Validate data for creating an issue
  // Takes: any input data
  // Returns: CreateIssueDTO or throws validation error
  static validateCreateIssue(data: any): CreateIssueDTO {
    return this.createIssueSchema.parse(data);
  }

  // Validate data for updating an issue
  // Takes: any input data
  // Returns: UpdateIssueDTO or throws validation error
  static validateUpdateIssue(data: any): UpdateIssueDTO {
    return this.updateIssueSchema.parse(data);
  }
}

/*
  Purpose:

  - Provides validation for Issue creation and updates
  - Ensures type safety and field constraints using Zod
  - Used by IssueController to validate incoming request bodies
*/
