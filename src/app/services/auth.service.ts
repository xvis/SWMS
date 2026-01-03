import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface ApiResp { success: boolean; message: string; }

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private base = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  register(email: string, password: string, fullName?: string): Observable<ApiResp> {
    return this.http.post<ApiResp>(`${this.base}/register`, { email, password, fullName });
  }

  login(email: string, password: string): Observable<ApiResp> {
    return this.http.post<ApiResp>(`${this.base}/login`, { email, password });
  }

  resetPassword(email: string, newPassword: string) {
    return this.http.post<ApiResp>(`${this.base}/reset-password`, { email, newPassword });
  }
}
