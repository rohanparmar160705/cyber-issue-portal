import { IssueRepository } from '../repositories/issue.repository';
import { ErrorHandler } from '../utils/error.handler';
import { CreateIssueDTO, UpdateIssueDTO, IssueResponseDTO, IssueType } from '../models/issue.model';

export class IssueService {
  private issueRepository: IssueRepository;

  constructor() {
    this.issueRepository = new IssueRepository();
  }

  // Get all issues for a user, optional type filter
  // Takes: userId (number), optional typeFilter (string)
  // Returns: array of IssueResponseDTO
  async getAllIssues(userId: number, typeFilter?: string): Promise<IssueResponseDTO[]> {
    let validatedType: IssueType | undefined;
    if (typeFilter) {
      const upperType = typeFilter.toUpperCase().replace(/\s+/g, '_').replace(/-/g, '_');
      if (!Object.values(IssueType).includes(upperType as IssueType)) {
        throw new ErrorHandler(400, 'Invalid issue type filter');
      }
      validatedType = upperType as IssueType;
    }

    const issues = await this.issueRepository.findAllByUserId(userId, validatedType);
    return issues.map(issue => this.mapToDTO(issue));
  }

  // Get a specific issue by ID for a user
  // Takes: userId (number), issueId (number)
  // Returns: IssueResponseDTO or throws error
  async getIssueById(userId: number, issueId: number): Promise<IssueResponseDTO> {
    const issue = await this.issueRepository.findById(issueId);
    
    if (!issue) {
      throw new ErrorHandler(404, 'Issue not found');
    }

    if (issue.userId !== userId) {
      throw new ErrorHandler(403, 'Forbidden: You do not own this issue');
    }

    return this.mapToDTO(issue);
  }

  // Create a new issue
  // Takes: userId (number), CreateIssueDTO
  // Returns: IssueResponseDTO
  async createIssue(userId: number, data: CreateIssueDTO): Promise<IssueResponseDTO> {
    const issue = await this.issueRepository.createIssue(userId, data);
    return this.mapToDTO(issue);
  }

  // Update an existing issue
  // Takes: userId (number), issueId (number), UpdateIssueDTO
  // Returns: updated IssueResponseDTO
  async updateIssue(userId: number, issueId: number, data: UpdateIssueDTO): Promise<IssueResponseDTO> {
    const issue = await this.issueRepository.findById(issueId);
    
    if (!issue) {
      throw new ErrorHandler(404, 'Issue not found');
    }

    if (issue.userId !== userId) {
      throw new ErrorHandler(403, 'Forbidden: You do not own this issue');
    }

    const updatedIssue = await this.issueRepository.updateIssue(issueId, data);
    return this.mapToDTO(updatedIssue);
  }

  // Delete an issue
  // Takes: userId (number), issueId (number)
  // Returns: void
  async deleteIssue(userId: number, issueId: number): Promise<void> {
    const issue = await this.issueRepository.findById(issueId);
    
    if (!issue) {
      throw new ErrorHandler(404, 'Issue not found');
    }

    if (issue.userId !== userId) {
      throw new ErrorHandler(403, 'Forbidden: You do not own this issue');
    }

    await this.issueRepository.deleteIssue(issueId);
  }

  // Map database Issue to IssueResponseDTO
  // Takes: issue (any)
  // Returns: IssueResponseDTO
  private mapToDTO(issue: any): IssueResponseDTO {
    return {
      id: issue.id,
      userId: issue.userId,
      type: issue.type,
      title: issue.title,
      description: issue.description,
      priority: issue.priority,
      status: issue.status,
      createdAt: issue.createdAt,
      updatedAt: issue.updatedAt,
    };
  }
}

/*
  Purpose:

  - Provides business logic for issue management
  - Validates ownership and issue type
  - Delegates database operations to IssueRepository
  - Returns IssueResponseDTO objects or throws errors for invalid operations
*/
