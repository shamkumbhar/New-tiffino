import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { AdminUser } from '../interfaces/adminlogin';
import { UserLogin } from '../interfaces/Userlogin';
import { environment } from '../../../environments/environments';
// This is the actual response returned by your backend
export interface AdminLoginResponse {
  token: string;
  user: AdminUser;
}

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {
  private readonly adminKey = 'adminUser';
  private readonly tokenKey = 'adminToken';
  //private readonly adminLoginUrl = 'http://localhost:8890/users/admin/login';
private apiurl='http://localhost:8890'
  constructor(private http: HttpClient) {}

  
  adminLogin(credentials: UserLogin): Observable<AdminLoginResponse> {
    return this.http.post<AdminLoginResponse>(`${this.apiurl}/users/admin/login`, credentials).pipe(
      tap({
        next: (response: AdminLoginResponse) => {
          const user = response.user;
          const token = response.token;

          console.log('Admin login response:', response);

          if (user.role?.toUpperCase() !== 'ADMIN') {
            throw new Error('Not an admin account');
          }

          this.setAdminToLocalStorage(user);
          this.setAdminToken(token);
        },
        error: (err) => {
          console.error('Admin login failed:', err.error || err);
        }
      }),
      catchError((error) => throwError(() => error))
    );
  }

  /**
   * Store admin user in localStorage
   */
  private setAdminToLocalStorage(user: AdminUser): void {
    localStorage.setItem(this.adminKey, JSON.stringify(user));
  }

  /**
   * Store admin token separately in localStorage
   */
  private setAdminToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  /**
   * Get admin user from localStorage
   */
  getAdminFromLocalStorage(): AdminUser | null {
    const json = localStorage.getItem(this.adminKey);
    return json ? JSON.parse(json) : null;
  }

  /**
   * Get admin token from localStorage
   */
  getAdminToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Admin logout: clear localStorage
   */
  logoutAdmin(): void {
    localStorage.removeItem(this.adminKey);
    localStorage.removeItem(this.tokenKey);
    console.log('Admin logged out successfully.');
  }
}