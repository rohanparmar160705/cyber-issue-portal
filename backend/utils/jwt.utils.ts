import jwt from 'jsonwebtoken';

export class JwtUtils {
  private static readonly SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';
  private static readonly EXPIRES_IN = '1d';

  // Generate JWT token
  // Takes: payload (object)
  // Returns: signed JWT string
  static generateToken(payload: object): string {
    return jwt.sign(payload, this.SECRET_KEY, { expiresIn: this.EXPIRES_IN });
  }

  // Verify JWT token
  // Takes: token (string)
  // Returns: decoded payload or throws Error if invalid
  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.SECRET_KEY);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}

/*
  Purpose:

  - Handles JWT generation and verification
  - Used for authentication in controllers and middleware
  - Ensures secure token signing and validation
*/
