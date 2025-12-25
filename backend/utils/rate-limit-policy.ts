import type { RateLimitPolicy } from '../models/rate-limit.model';

export class PolicyResolver {
  // Map to store all endpoint-specific rate limit policies
  private policies: Map<string, RateLimitPolicy>;

  // Default policy applied if no specific policy exists
  private defaultPolicy: RateLimitPolicy;

  constructor() {
    // Default policy: 100 requests per 15 minutes for any endpoint
    this.defaultPolicy = {
      limit: 100,
      windowMs: 900000, // 15 minutes
      endpoint: 'default',
      method: 'ALL'
    };

    // Initialize endpoint-specific policies
    // Key format: "METHOD:/api/endpoint"
    this.policies = new Map([
      // Authentication endpoints
      ['POST:/api/auth/register', { limit: 5, windowMs: 900000, endpoint: '/api/auth/register', method: 'POST' }],
      ['POST:/api/auth/login', { limit: 10, windowMs: 900000, endpoint: '/api/auth/login', method: 'POST' }],
      ['POST:/api/auth/logout', { limit: 20, windowMs: 900000, endpoint: '/api/auth/logout', method: 'POST' }],
      ['GET:/api/auth/me', { limit: 100, windowMs: 900000, endpoint: '/api/auth/me', method: 'GET' }],

      // User profile endpoints
      ['GET:/api/users/profile', { limit: 100, windowMs: 900000, endpoint: '/api/users/profile', method: 'GET' }],
      ['PUT:/api/users/profile', { limit: 20, windowMs: 900000, endpoint: '/api/users/profile', method: 'PUT' }],

      // Issues endpoints
      ['GET:/api/issues', { limit: 100, windowMs: 900000, endpoint: '/api/issues', method: 'GET' }],
      ['POST:/api/issues', { limit: 30, windowMs: 900000, endpoint: '/api/issues', method: 'POST' }],
      ['GET:/api/issues/:id', { limit: 100, windowMs: 900000, endpoint: '/api/issues/:id', method: 'GET' }],
      ['PUT:/api/issues/:id', { limit: 50, windowMs: 900000, endpoint: '/api/issues/:id', method: 'PUT' }],
      ['DELETE:/api/issues/:id', { limit: 50, windowMs: 900000, endpoint: '/api/issues/:id', method: 'DELETE' }],

      // Projects endpoints
      ['GET:/api/projects', { limit: 100, windowMs: 900000, endpoint: '/api/projects', method: 'GET' }],
      ['POST:/api/projects', { limit: 20, windowMs: 900000, endpoint: '/api/projects', method: 'POST' }],
      ['GET:/api/projects/:id', { limit: 100, windowMs: 900000, endpoint: '/api/projects/:id', method: 'GET' }],
      ['PUT:/api/projects/:id', { limit: 50, windowMs: 900000, endpoint: '/api/projects/:id', method: 'PUT' }],
      ['DELETE:/api/projects/:id', { limit: 30, windowMs: 900000, endpoint: '/api/projects/:id', method: 'DELETE' }],
      ['GET:/api/projects/:id/issues', { limit: 100, windowMs: 900000, endpoint: '/api/projects/:id/issues', method: 'GET' }],
    ]);
  }

  /**
   * Resolve the rate limit policy for a given request
   * @param endpoint - request URL
   * @param method - HTTP method
   * @returns RateLimitPolicy for this endpoint
   */
  resolve(endpoint: string, method: string): RateLimitPolicy {
    // Normalize endpoint to replace numeric IDs with :id
    const normalizedEndpoint = this.normalizeEndpoint(endpoint);

    // Build map key: "METHOD:/normalized/endpoint"
    const key = `${method}:${normalizedEndpoint}`;

    // Check if a specific policy exists
    const policy = this.policies.get(key);

    // Return specific policy if exists
    if (policy) {
      return policy;
    }

    // Return default policy if none exists
    return {
      ...this.defaultPolicy,
      endpoint: normalizedEndpoint,
      method
    };
  }

  /**
   * Normalize dynamic endpoints by replacing numeric IDs with :id
   * @param endpoint - original endpoint string
   * @returns normalized endpoint string
   */
  private normalizeEndpoint(endpoint: string): string {
    // Replace all numeric segments with ':id'
    return endpoint.replace(/\/\d+/g, '/:id');
  }
}

