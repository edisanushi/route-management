import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly tokenKey = 'auth_token';
  private readonly userKey = 'auth_user';

  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
      tap(response => this.persistAuth(response))
    );
  }

  register(request: RegisterRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/register`,
      request
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    return !this.isTokenExpired(token);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  getStoredUser(): { email: string; role: string } | null {
    const raw = localStorage.getItem(this.userKey);
    if (!raw) return null;

    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  isAdmin(): boolean {
    return this.getStoredUser()?.role === 'Admin';
  }

  isTourOperator(): boolean {
    return this.getStoredUser()?.role === 'TourOperatorMember';
  }

  private persistAuth(response: AuthResponse): void {
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.userKey, JSON.stringify({
      email: response.email,
      role:  response.role
    }));
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000;
      return Date.now() > expiry;
    } catch {
      return true;
    }
  }


}