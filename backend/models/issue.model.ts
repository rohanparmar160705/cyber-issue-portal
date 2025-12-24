// Issue types enumeration
export enum IssueType {
  CLOUD_SECURITY = 'CLOUD_SECURITY',
  RETEAM_ASSESSMENT = 'RETEAM_ASSESSMENT',
  VAPT = 'VAPT',
}

// Priority levels for issues
export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

// Status options for issues
export enum IssueStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

// DTO for creating a new issue
// Takes: type, title, description, optional priority and status
export interface CreateIssueDTO {
  type: IssueType;
  title: string;
  description: string;
  priority?: Priority;
  status?: IssueStatus;
}

// DTO for updating an existing issue
// Takes: optional title, description, priority, or status
export interface UpdateIssueDTO {
  title?: string;
  description?: string;
  priority?: Priority;
  status?: IssueStatus;
}

// DTO returned when fetching an issue
// Contains all issue fields including timestamps
export interface IssueResponseDTO {
  id: number;
  userId: number;
  type: IssueType;
  title: string;
  description: string;
  priority: Priority;
  status: IssueStatus;
  createdAt: Date;
  updatedAt: Date;
}

