// src/app/pages/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { RegistrationService } from '../../services/registration.service';

@Component({
  selector:    'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls:   ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  stats: any    = null;
  loading       = true;
  error         = '';

  constructor(private regService: RegistrationService) {}

  async ngOnInit() {
    try {
      const res  = await this.regService.getStats();
      this.stats = res;
    } catch {
      this.error = 'Failed to load dashboard data.';
    } finally {
      this.loading = false;
    }
  }

  getStatusColor(status: string): string {
    const map: any = {
      pending:   '#f59e0b',
      contacted: '#3b82f6',
      enrolled:  '#10b981',
      cancelled: '#ef4444',
    };
    return map[status] || '#6b7280';
  }
}