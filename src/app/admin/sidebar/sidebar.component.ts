// sidebar.component.ts
import { Component } from '@angular/core';
import { Router }    from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector:    'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls:   ['./sidebar.component.css'],
})
export class SidebarComponent {
  collapsed = false;
  constructor(private auth: AuthService, private router: Router) {}
  logout() { this.auth.logout(); this.router.navigate(['/login']); }
}