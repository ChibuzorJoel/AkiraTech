// src/app/services/contact.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly API = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Fetch a paginated, filtered list of contact submissions.
   * filters can include: search, status, service, page, limit
   */
  getAll(filters: any = {}): Promise<any> {
    let params = new HttpParams();
    Object.keys(filters).forEach(k => {
      if (filters[k]) params = params.set(k, filters[k]);
    });
    return firstValueFrom(this.http.get(`${this.API}/contact`, { params }));
  }

  /**
   * Fetch a single contact submission by its MongoDB _id.
   */
  getById(id: string): Promise<any> {
    return firstValueFrom(this.http.get(`${this.API}/contact/${id}`));
  }

  /**
   * Update the status and/or notes on a contact submission.
   */
  updateStatus(id: string, status: string, notes?: string): Promise<any> {
    return firstValueFrom(this.http.patch(`${this.API}/contact/${id}`, { status, notes }));
  }

  /**
   * Permanently delete a contact submission.
   */
  delete(id: string): Promise<any> {
    return firstValueFrom(this.http.delete(`${this.API}/contact/${id}`));
  }

  /**
   * Fetches ALL records matching the given filters (ignores pagination)
   * by requesting a very high limit. Used for CSV export so the file
   * isn't capped at whatever page size the table is using.
   */
  async getAllForExport(filters: any = {}): Promise<any[]> {
    let params = new HttpParams().set('limit', '100000').set('page', '1');
    Object.keys(filters).forEach(k => {
      if (filters[k]) params = params.set(k, filters[k]);
    });
    const res: any = await firstValueFrom(this.http.get(`${this.API}/contact`, { params }));
    return res.data || [];
  }
}