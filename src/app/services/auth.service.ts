// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = environment.apiUrl;
  private readonly TOKEN_KEY = 'akiira_admin_token';
  private readonly USER_KEY = 'akiira_admin_user'; // Add this

  constructor(private http: HttpClient) {}

  async login(email: string, password: string): Promise<any> {
    const res: any = await firstValueFrom(
      this.http.post(`${this.API}/auth/login`, { email, password })
    );
    localStorage.setItem(this.TOKEN_KEY, res.token);
    
    // Store user data if available
    if (res.user) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(res.user));
    } else if (res.data && res.data.user) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(res.data.user));
    }
    
    return res;
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY); // Also remove user data
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Get user name from stored data or token
  getUserName(): string {
    // Try to get from stored user data
    const userData = localStorage.getItem(this.USER_KEY);
    if (userData) {
      try {
        const user = JSON.parse(userData);
        return user.name || user.fullName || 'Admin';
      } catch {
        return 'Admin';
      }
    }
    
    // If no user data, try to decode from token
    const token = this.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.name || payload.fullName || 'Admin';
      } catch {
        return 'Admin';
      }
    }
    
    return 'Admin';
  }

  // Get full user object
  getUser(): any {
    const userData = localStorage.getItem(this.USER_KEY);
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch {
        return null;
      }
    }
    return null;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  async getMe(): Promise<any> {
    return firstValueFrom(
      this.http.get(`${this.API}/auth/me`)
    );
  }
}