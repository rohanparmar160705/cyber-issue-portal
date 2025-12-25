// Project status enumeration
export enum ProjectStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  ON_HOLD = 'ON_HOLD',
  ARCHIVED = 'ARCHIVED',
}

// DTO for creating a new project
export interface CreateProjectDTO {
  name: string;
  description: string;
  clientName?: string;
  status?: ProjectStatus;
}

// DTO for updating an existing project
export interface UpdateProjectDTO {
  name?: string;
  description?: string;
  clientName?: string;
  status?: ProjectStatus;
}

// DTO returned when fetching a project
export interface ProjectResponseDTO {
  id: number;
  userId: number;
  name: string;
  description: string;
  clientName?: string | null;
  status: ProjectStatus;
  createdAt: Date;
  updatedAt: Date;
  issueCount?: number; // Optional: count of linked issues
}

