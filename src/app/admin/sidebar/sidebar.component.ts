// sidebar.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  collapsed = false;
  isLoginPage = false;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    // Check if we're on the login page
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isLoginPage = event.url.includes('/login') || event.url === '/admin/login';
      }
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/admin/login']);
  }
}