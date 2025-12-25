import bcrypt from 'bcryptjs';

export class PasswordUtils {
  // Hash a plain password
  // Takes: password (string)
  // Returns: hashed password (string)
  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  // Compare plain password with hash
  // Takes: password (string), hash (string)
  // Returns: boolean (true if match)
  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}

/*
  Purpose:

  - Provides password hashing and verification utilities
  - Used by AuthService for secure password storage and login validation
*/

