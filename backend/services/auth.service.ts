import { UserRepository } from '../repositories/user.repository';
import { PasswordUtils } from '../utils/password.utils';
import { JwtUtils } from '../utils/jwt.utils';
import { ErrorHandler } from '../utils/error.handler';
import { RegisterDTO, LoginDTO, UserDTO } from '../models/auth.model';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async registerUser(data: RegisterDTO): Promise<UserDTO> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ErrorHandler(400, 'User already exists');
    }

    const hashedPassword = await PasswordUtils.hashPassword(data.password);
    const user = await this.userRepository.createUser(data, hashedPassword);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    };
  }

  async loginUser(data: LoginDTO): Promise<{ user: UserDTO; token: string }> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new ErrorHandler(401, 'Invalid credentials');
    }

    const isMatch = await PasswordUtils.comparePassword(data.password, user.passwordHash);
    if (!isMatch) {
      throw new ErrorHandler(401, 'Invalid credentials');
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

  async getCurrentUser(email: string): Promise<UserDTO | null> {
     const user = await this.userRepository.findByEmail(email);
     if(!user) return null;
     return {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt
     }
  }
}
