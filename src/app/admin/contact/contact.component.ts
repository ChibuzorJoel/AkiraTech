// src/app/admin/contact/contact.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContactService } from '../../services/contact.service';

@Component({
  selector:    'app-admin-contact',
  templateUrl: './contact.component.html',
  styleUrls:   ['./contact.component.css'],
})
export class AdminContactComponent implements OnInit, OnDestroy {
  contacts: any[] = [];
  loading  = true;
  error    = '';

  // Filters
  search   = '';
  status   = '';
  service  = '';
  page     = 1;
  limit    = 20;
  total    = 0;
  pages    = 0;

  // Detail modal
  selected:    any  = null;
  modalOpen        = false;
  updatingStatus   = false;
  newStatus        = '';
  newNotes         = '';
  deleteConfirm    = false;

  // Live polling
  newCount = 0;
  private pollInterval: any;

  statuses = ['new', 'contacted', 'in-progress', 'closed'];

  services = [
    'Website Development', 'Mobile App Development', 'EduTech',
    'E-Commerce Store', 'UI/UX Design',
    'SEO & Digital Marketing', 'Website Maintenance', 'Other',
  ];

  // CSV export
  exporting = false;

  constructor(private contactService: ContactService) {}

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
      const res = await this.contactService.getAll({
        search: this.search, status: this.status,
        service: this.service, page: this.page, limit: this.limit,
      });
      this.contacts = res.data;
      this.total    = res.pagination.total;
      this.pages    = res.pagination.pages;
      this.newCount = 0;
    } catch {
      this.error = 'Failed to load contact submissions.';
    } finally {
      this.loading = false;
    }
  }

  private startPolling() {
    this.pollInterval = setInterval(async () => {
      try {
        const res = await this.contactService.getAll({
          search: this.search, status: this.status,
          service: this.service, page: 1, limit: 1,
        });
        if (res.pagination.total > this.total && this.page === 1) {
          this.newCount = res.pagination.total - this.total;
        }
      } catch {
        // fail silently on background poll
      }
    }, 20000);
  }

  async refreshNow() {
    this.newCount = 0;
    this.page = 1;
    await this.load();
  }

  async search$() { this.page = 1; await this.load(); }
  async clearFilters() { this.search = ''; this.status = ''; this.service = ''; this.page = 1; await this.load(); }

  openModal(c: any) {
    this.selected      = c;
    this.newStatus     = c.status;
    this.newNotes      = c.notes || '';
    this.deleteConfirm = false;
    this.modalOpen     = true;
  }
  closeModal() { this.modalOpen = false; this.selected = null; }

  async saveStatus() {
    if (!this.selected) return;
    this.updatingStatus = true;
    try {
      const updated = await this.contactService.updateStatus(this.selected._id, this.newStatus, this.newNotes);
      const idx = this.contacts.findIndex(c => c._id === this.selected._id);
      if (idx !== -1) this.contacts[idx] = updated.data;
      this.selected = updated.data;
    } catch { alert('Failed to update. Please try again.'); }
    finally { this.updatingStatus = false; }
  }

  async deleteContact() {
    if (!this.deleteConfirm) { this.deleteConfirm = true; return; }
    try {
      await this.contactService.delete(this.selected._id);
      this.contacts = this.contacts.filter(c => c._id !== this.selected._id);
      this.closeModal();
    } catch { alert('Failed to delete.'); }
  }

  getWhatsAppLink(phone: string): string {
    const cleaned = phone ? phone.replace(/\D/g, '') : '';
    return `https://wa.me/${cleaned}`;
  }

  getStatusColor(status: string): string {
    const map: any = { new: '#f59e0b', contacted: '#3b82f6', 'in-progress': '#7a3d8c', closed: '#10b981' };
    return map[status] || '#6b7280';
  }

  formatDate(d: string): string {
    return new Date(d).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  prevPage() { if (this.page > 1) { this.page--; this.load(); } }
  nextPage() { if (this.page < this.pages) { this.page++; this.load(); } }

  /* ── CSV Export ── */
  async exportCsv() {
    this.exporting = true;
    try {
      const records = await this.contactService.getAllForExport({
        search: this.search, status: this.status, service: this.service,
      });

      if (!records.length) {
        alert('No contact submissions match the current filters — nothing to export.');
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
    const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Service', 'Budget', 'Status', 'Notes', 'Message', 'Date Submitted'];

    const escapeCell = (val: any): string => {
      const str = (val ?? '').toString().replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = records.map(r => [
      r.firstName, r.lastName, r.email, r.phone, r.service,
      r.budget || '', r.status, r.notes || '', r.message || '',
      this.formatDate(r.createdAt),
    ].map(escapeCell).join(','));

    return [headers.map(escapeCell).join(','), ...rows].join('\r\n');
  }

  private downloadCsv(csv: string) {
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);

    const filterParts: string[] = [];
    if (this.status)  filterParts.push(this.status);
    if (this.service) filterParts.push(this.service.replace(/[^\w]+/g, '-').toLowerCase());
    const suffix = filterParts.length ? `-${filterParts.join('-')}` : '';

    const date = new Date().toISOString().slice(0, 10);
    const filename = `akiira-contacts${suffix}-${date}.csv`;

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}