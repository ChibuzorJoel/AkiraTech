// src/app/pages/login/login.component.ts
import { Component } from '@angular/core';
import { Router }    from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector:    'app-login',
  templateUrl: './login.component.html',
  styleUrls:   ['./login.component.css'],
})
export class LoginComponent {
  email        = '';
  password     = '';
  showPassword = false;
  loading      = false;
  submitted    = false;
  errorMsg     = '';

  constructor(private auth: AuthService, private router: Router) {}

  async login() {
    this.submitted = true;
    this.errorMsg  = '';

    if (!this.email || !this.password) {
      this.errorMsg = 'Email and password are required.';
      return;
    }

    this.loading = true;
    try {
      await this.auth.login(this.email, this.password);
      this.router.navigate(['/dashboard']);
    } catch (err: any) {
      this.errorMsg = err?.error?.message || 'Invalid credentials. Please try again.';
    } finally {
      this.loading = false;
    }
  }
}