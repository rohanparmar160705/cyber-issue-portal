import { UserRepository } from '../repositories/user.repository';
import { ErrorHandler } from '../utils/error.handler';
import { UpdateProfileDTO, UserProfileDTO } from '../models/user.model';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  // Get a user's profile by ID
  // Takes: userId (number)
  // Returns: UserProfileDTO
  // Throws: ErrorHandler if user not found
  async getUserProfile(userId: number): Promise<UserProfileDTO> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new ErrorHandler(404, 'User not found');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    };
  }

  // Update a user's profile
  // Takes: userId (number) and UpdateProfileDTO
  // Returns: updated UserProfileDTO
  // Throws: ErrorHandler if user not found or email already in use
  async updateUserProfile(
    userId: number,
    data: UpdateProfileDTO
  ): Promise<UserProfileDTO> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new ErrorHandler(404, 'User not found');
    }

    // Check if email is being updated and if it is already taken
    if (data.email && data.email !== user.email) {
      const existingUser = await this.userRepository.findByEmail(data.email);
      if (existingUser) {
        throw new ErrorHandler(400, 'Email already in use');
      }
    }

    const updatedUser = await this.userRepository.updateUser(userId, data);

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      createdAt: updatedUser.createdAt,
    };
  }
}

/*
  Purpose:

  - Handles business logic for user profile operations
  - Interacts with UserRepository for database access
  - Ensures email uniqueness on updates
  - Returns sanitized UserProfileDTO objects
*/
