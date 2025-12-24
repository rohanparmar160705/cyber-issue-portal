export interface RegisterPayload {
  email: string;
  password: string;
  name?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  email: string;
  name?: string | null;
  createdAt: string; // Dates often come as strings from JSON
}

export interface AuthResponse {
  user: UserResponse;
  token?: string;
  message?: string;
}

export const API_BASE_URL = '/api/auth';

export const AuthAPI = {
  async register(data: RegisterPayload): Promise<UserResponse> {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    return response.json();
  },

  async login(data: LoginPayload): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    return response.json();
  },

  async logout(): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Logout failed');
    }

    return response.json();
  },

  async getMe(): Promise<UserResponse> {
    const response = await fetch(`${API_BASE_URL}/me`, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch user');
    }

    return response.json();
  },
};

export const USER_API_BASE_URL = '/api/users';

export const UserAPI = {
  async getProfile(): Promise<UserResponse> {
    const response = await fetch(`${USER_API_BASE_URL}/profile`, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch profile');
    }

    return response.json();
  },

  async updateProfile(data: { name?: string; email?: string }): Promise<UserResponse> {
    const response = await fetch(`${USER_API_BASE_URL}/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update profile');
    }

    return response.json();
  },
};

