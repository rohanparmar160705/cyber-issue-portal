// Issue types enumeration
export enum IssueType {
  CLOUD_SECURITY = "CLOUD_SECURITY",
  RETEAM_ASSESSMENT = "RETEAM_ASSESSMENT",
  VAPT = "VAPT",
}

// Priority levels for issues
export enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

// Status options for issues
export enum IssueStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
}

// DTO for creating a new issue
export interface CreateIssueDTO {
  type: IssueType;
  title: string;
  description: string;
  priority?: Priority;
  status?: IssueStatus;
  projectId?: number; // Added for project linking
}

// DTO for updating an existing issue
export interface UpdateIssueDTO {
  title?: string;
  description?: string;
  priority?: Priority;
  status?: IssueStatus;
  projectId?: number; // Added for project linking
}

// DTO returned when fetching an issue
export interface IssueResponseDTO {
  id: number;
  userId: number;
  projectId?: number | null;
  projectName?: string | null;
  type: IssueType;
  title: string;
  description: string;
  priority: Priority;
  status: IssueStatus;
  createdAt: Date;
  updatedAt: Date;
}
