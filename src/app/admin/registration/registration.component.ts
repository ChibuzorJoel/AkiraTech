// src/app/pages/registrations/registration.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RegistrationService } from '../../services/registration.service';

@Component({
  selector:    'app-registration',
  templateUrl: './registration.component.html',
  styleUrls:   ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit, OnDestroy {
  registrations: any[] = [];
  loading   = true;
  error     = '';

  // Filters
  search    = '';
  status    = '';
  course    = '';
  page      = 1;
  limit     = 20;
  total     = 0;
  pages     = 0;

  // Detail modal
  selected:   any    = null;
  modalOpen          = false;
  updatingStatus     = false;
  newStatus          = '';
  newNotes           = '';
  deleteConfirm      = false;

  // Live "new registrations" polling
  newCount = 0;
  private pollInterval: any;

  statuses = ['pending', 'contacted', 'enrolled', 'cancelled'];

  courses = [
    'Web Development (Full Stack)', 'Frontend Development', 'Backend Development',
    'Mobile App Development', 'UI/UX Design', 'Data analysis',
    'Virtual assistance', 'Copywriting and CV writing', 'Social media management',
  ];

  constructor(private regService: RegistrationService) {}

  async ngOnInit() {
    await this.load();
    this.startPolling();
  }

  ngOnDestroy() {
    if (this.pollInterval) clearInterval(this.pollInterval);
  }

  async load() {
    this.loading = true;
    try {
      const res = await this.regService.getAll({
        search: this.search, status: this.status,
        course: this.course, page: this.page, limit: this.limit,
      });
      this.registrations = res.data;
      this.total         = res.pagination.total;
      this.pages         = res.pagination.pages;
      this.newCount       = 0; // reset banner whenever a fresh load happens
    } catch {
      this.error = 'Failed to load registrations.';
    } finally {
      this.loading = false;
    }
  }

  /* ── Background polling for new registrations ── */
  private startPolling() {
    this.pollInterval = setInterval(async () => {
      try {
        const res = await this.regService.getAll({
          search: this.search, status: this.status,
          course: this.course, page: 1, limit: 1,
        });
        // Only surface a banner if we're on page 1 — avoids confusing
        // an admin who's deep in pagination with a count that doesn't match what they see
        if (res.pagination.total > this.total && this.page === 1) {
          this.newCount = res.pagination.total - this.total;
        }
      } catch {
        // fail silently — a background poll shouldn't interrupt the admin's work
      }
    }, 20000); // every 20 seconds
  }

  async refreshNow() {
    this.newCount = 0;
    this.page = 1;
    await this.load();
  }

  async search$() { this.page = 1; await this.load(); }
  async clearFilters() { this.search = ''; this.status = ''; this.course = ''; this.page = 1; await this.load(); }

  /* ── CSV Export ── */
  exporting = false;

  async exportCsv() {
    this.exporting = true;
    try {
      // Pull every record matching the CURRENT filters (not just this page)
      const records = await this.regService.getAllForExport({
        search: this.search,
        status: this.status,
        course: this.course,
      });

      if (!records.length) {
        alert('No registrations match the current filters — nothing to export.');
        return;
      }

      const csv = this.buildCsv(records);
      this.downloadCsv(csv);
    } catch {
      alert('Failed to export. Please try again.');
    } finally {
      this.exporting = false;
    }
  }

  private buildCsv(records: any[]): string {
    const headers = ['Full Name', 'Email', 'Phone', 'Course', 'Source', 'Status', 'Notes', 'Message', 'Date Registered'];

    const escapeCell = (val: any): string => {
      const str = (val ?? '').toString().replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = records.map(r => [
      r.fullName,
      r.email,
      r.phone,
      r.course,
      r.source || '',
      r.status,
      r.notes || '',
      r.message || '',
      this.formatDate(r.createdAt),
    ].map(escapeCell).join(','));

    return [headers.map(escapeCell).join(','), ...rows].join('\r\n');
  }

  private downloadCsv(csv: string) {
    // BOM ensures Excel opens UTF-8 (e.g. ₦, accented names) correctly
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);

    const filterParts: string[] = [];
    if (this.status) filterParts.push(this.status);
    if (this.course) filterParts.push(this.course.replace(/[^\w]+/g, '-').toLowerCase());
    const suffix = filterParts.length ? `-${filterParts.join('-')}` : '';

    const date = new Date().toISOString().slice(0, 10);
    const filename = `akiira-registrations${suffix}-${date}.csv`;

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  openModal(reg: any) {
    this.selected      = reg;
    this.newStatus     = reg.status;
    this.newNotes      = reg.notes || '';
    this.deleteConfirm = false;
    this.modalOpen     = true;
  }
  closeModal() { this.modalOpen = false; this.selected = null; }

  async saveStatus() {
    if (!this.selected) return;
    this.updatingStatus = true;
    try {
      const updated = await this.regService.updateStatus(this.selected._id, this.newStatus, this.newNotes);
      const idx = this.registrations.findIndex(r => r._id === this.selected._id);
      if (idx !== -1) this.registrations[idx] = updated.data;
      this.selected = updated.data;
    } catch { alert('Failed to update. Please try again.'); }
    finally { this.updatingStatus = false; }
  }

  async deleteReg() {
    if (!this.deleteConfirm) { this.deleteConfirm = true; return; }
    try {
      await this.regService.delete(this.selected._id);
      this.registrations = this.registrations.filter(r => r._id !== this.selected._id);
      this.closeModal();
    } catch { alert('Failed to delete.'); }
  }

  getWhatsAppLink(phone: string): string {
    const cleaned = phone ? phone.replace(/\D/g, '') : '';
    return `https://wa.me/${cleaned}`;
  }

  getStatusColor(status: string): string {
    const map: any = { pending: '#f59e0b', contacted: '#3b82f6', enrolled: '#10b981', cancelled: '#ef4444' };
    return map[status] || '#6b7280';
  }

  formatDate(d: string): string {
    return new Date(d).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  prevPage() { if (this.page > 1) { this.page--; this.load(); } }
  nextPage() { if (this.page < this.pages) { this.page++; this.load(); } }
}