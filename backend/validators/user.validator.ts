import { z } from 'zod';
import { UpdateProfileDTO } from '../models/user.model';

export class UserValidator {
  // Zod schema for updating user profile
  static updateProfileSchema = z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
  });

  // Validate update profile data
  // Takes: any input object
  // Returns: UpdateProfileDTO if valid, throws if invalid
  static validateUpdateProfile(data: any): UpdateProfileDTO {
    return this.updateProfileSchema.parse(data);
  }
}

/*
  Purpose:

  - Validates user profile update input using Zod
  - Ensures name and email (if provided) are valid
  - Returns typed DTO for use in UserService/Controller
*/
