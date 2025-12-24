import jwt from 'jsonwebtoken';

export class JwtUtils {
  private static readonly SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';
  private static readonly EXPIRES_IN = '1d';

  static generateToken(payload: object): string {
    return jwt.sign(payload, this.SECRET_KEY, { expiresIn: this.EXPIRES_IN });
  }

  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.SECRET_KEY);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
