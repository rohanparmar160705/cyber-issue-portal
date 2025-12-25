import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

/**
 * Class responsible for generating a unique identifier for each request.
 * Used primarily for rate-limiting purposes.
 */
export class IdentifierResolver {
  
  /**
   * Main method to get a unique identifier for a request
   * @param req NextRequest
   * @returns string in format "user:<id>" or "ip:<ip-address>"
   */
  resolve(req: NextRequest): string {
    // Try to get user ID from JWT
    const userId = this.extractUserID(req);
    if (userId) {
      return `user:${userId}`; // Prefer per-user rate limiting
    }
    
    // Fallback to IP address if user not logged in
    const ip = this.extractIP(req);
    return `ip:${ip}`;
  }

  /**
   * Extract user ID from JWT in cookies
   * @param req NextRequest
   * @returns string user ID or null if no valid token
   */
  private extractUserID(req: NextRequest): string | null {
    try {
      // Get token from cookie named 'token'
      const token = req.cookies.get('token')?.value;
      
      if (!token) {
        return null; // No token present
      }

      // Get JWT secret from environment variables
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        return null; // Cannot verify token without secret
      }

      // Verify and decode JWT
      const decoded = jwt.verify(token, secret) as { id: number };
      return decoded.id?.toString() || null; // Return user ID as string
    } catch (error) {
      // Invalid or expired token
      return null;
    }
  }

  /**
   * Extract IP address from request for anonymous users
   * @param req NextRequest
   * @returns string IP address
   */
  private extractIP(req: NextRequest): string {
    // 1. Try Next.js internal property
    // if (req.ip) {
    //   return req.ip;
    // }

    // 2. Check headers (support proxies)
    const forwarded = req.headers.get('x-forwarded-for');
    if (forwarded) {
      // 'x-forwarded-for' can contain multiple IPs, take first
      return forwarded.split(',')[0].trim();
    }

    const realIp = req.headers.get('x-real-ip');
    if (realIp) {
      return realIp;
    }

    const remoteAddr = req.headers.get('remote-addr');
    if (remoteAddr) {
      return remoteAddr;
    }

    // 3. Default for local dev / fallback
    return '127.0.0.1';
  }
}

