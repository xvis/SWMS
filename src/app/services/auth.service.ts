import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';

interface ApiResp { 
  success: boolean; 
  message: string; 
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  email: string;
  userId: number;
}

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  email: string;
  userId: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private base = 'http://localhost:8080/api/auth';
  private protectedBase = 'http://localhost:8080/api/protected';
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  register(email: string, password: string, fullName?: string): Observable<ApiResp> {
    return this.http.post<ApiResp>(`${this.base}/register`, { email, password, fullName });
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.base}/login`, { email, password })
      .pipe(
        tap(response => {
          this.setTokens(response.accessToken, response.refreshToken);
          this.setUserInfo(response.email, response.userId);
          this.isAuthenticatedSubject.next(true);
        })
      );
  }

  refreshAccessToken(): Observable<RefreshResponse> {
    const refreshToken = this.getRefreshToken();
    return this.http.post<RefreshResponse>(`${this.base}/refresh`, { refreshToken })
      .pipe(
        tap(response => {
          this.setAccessToken(response.accessToken);
        })
      );
  }

  logout(): Observable<ApiResp> {
    const refreshToken = this.getRefreshToken();
    return this.http.post<ApiResp>(`${this.base}/logout`, { refreshToken })
      .pipe(
        tap(() => {
          this.clearTokens();
          this.isAuthenticatedSubject.next(false);
          this.router.navigate(['/login']);
        })
      );
  }

  resetPassword(email: string, newPassword: string): Observable<ApiResp> {
    return this.http.post<ApiResp>(`${this.base}/reset-password`, { email, newPassword });
  }

  // Token Management
  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  private setAccessToken(accessToken: string): void {
    localStorage.setItem('accessToken', accessToken);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  private setUserInfo(email: string, userId: number): void {
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userId', userId.toString());
    
    // Check if admin
    const role = email === 'abc@gmail.com' ? 'admin' : 'user';
    localStorage.setItem('userRole', role);
  }

  getUserEmail(): string | null {
    return localStorage.getItem('userEmail');
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }

  clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
  }

  hasToken(): boolean {
    return !!this.getAccessToken();
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }

  // Protected API Calls
  getUserInfo(): Observable<any> {
    return this.http.get(`${this.protectedBase}/user-info`);
  }

  getDashboardData(): Observable<any> {
    return this.http.get(`${this.protectedBase}/dashboard`);
  }
}
