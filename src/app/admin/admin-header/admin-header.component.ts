import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent implements OnInit {
  isMenuOpen = false;
  adminName = 'Admin'; // Add this property

  constructor(
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit() {
    // Get admin name from localStorage or service
    const userData = localStorage.getItem('adminUser');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        this.adminName = user.name || 'Admin';
      } catch {
        this.adminName = 'Admin';
      }
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/admin/login']);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}