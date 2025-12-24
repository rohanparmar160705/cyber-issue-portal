// Data allowed to update in user's profile
export interface UpdateProfileDTO {
  name?: string;
  email?: string; // optional if email updates are allowed
}

// User profile data returned in responses
export interface UserProfileDTO {
  id: number;
  email: string;
  name?: string | null;
  createdAt: Date;
}
