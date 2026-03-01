export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  role: string;
  expiresAt: string;
}

export interface AuthUser {
  email: string;
  role: string;
  expiresAt: string;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}