import { UserRepository } from "../repositories/user.repository";
import { PasswordUtils } from "../utils/password.utils";
import { JwtUtils } from "../utils/jwt.utils";
import { ErrorHandler } from "../utils/error.handler";
import { EmailService } from "./email.service";
import { RegisterDTO, LoginDTO, UserDTO } from "../models/auth.model";

export class AuthService {
  private userRepository: UserRepository;
  private emailService: EmailService;

  constructor() {
    this.userRepository = new UserRepository();
    this.emailService = new EmailService();
  }

  // Register a new user
  // Takes: RegisterDTO
  // Returns: UserDTO
  // Throws: ErrorHandler if user already exists
  async registerUser(data: RegisterDTO): Promise<UserDTO> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ErrorHandler(400, "User already exists");
    }

    const hashedPassword = await PasswordUtils.hashPassword(data.password);
    const user = await this.userRepository.createUser(data, hashedPassword);

    // Send welcome email (non-blocking)
    // We don't await this so the user response isn't delayed by SMTP
    this.emailService.sendWelcomeEmail(user).catch((err) => {
      console.error(
        "[AuthService] Welcome email failed background execution:",
        err
      );
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    };
  }

  // Login user and generate JWT
  // Takes: LoginDTO
  // Returns: object containing UserDTO and token
  // Throws: ErrorHandler if credentials are invalid
  async loginUser(data: LoginDTO): Promise<{ user: UserDTO; token: string }> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new ErrorHandler(401, "Invalid credentials");
    }

    const isMatch = await PasswordUtils.comparePassword(
      data.password,
      user.passwordHash
    );
    if (!isMatch) {
      throw new ErrorHandler(401, "Invalid credentials");
    }

    const token = JwtUtils.generateToken({ id: user.id, email: user.email });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  // Get user by email
  // Takes: email (string)
  // Returns: UserDTO or null if not found
  async getCurrentUser(email: string): Promise<UserDTO | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    };
  }
}

/*
  Purpose:

  - Contains business logic for authentication (register, login, get user)
  - Interacts with UserRepository for database operations
  - Handles password hashing and verification
  - Generates JWT tokens for authenticated users

  Notes:

  - All methods return sanitized UserDTO objects (without password)
  - Throws ErrorHandler for any invalid operation (e.g., duplicate user, invalid credentials)
*/

