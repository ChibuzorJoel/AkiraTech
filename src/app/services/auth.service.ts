// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = environment.apiUrl;
  private readonly TOKEN_KEY = 'akiira_admin_token';

  constructor(private http: HttpClient) {}

  async login(email: string, password: string): Promise<any> {
    const res: any = await firstValueFrom(
      this.http.post(`${this.API}/auth/login`, { email, password })
    );
    localStorage.setItem(this.TOKEN_KEY, res.token);
    return res;
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
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