// src/app/services/registration.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RegistrationService {
  private readonly API = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll(filters: any = {}): Promise<any> {
    let params = new HttpParams();
    Object.keys(filters).forEach(k => { if (filters[k]) params = params.set(k, filters[k]); });
    return firstValueFrom(this.http.get(`${this.API}/registrations`, { params }));
  }
/**
   * Fetches ALL records matching the given filters (ignores pagination)
   * by requesting a very high limit. Used for CSV export so the file
   * isn't capped at whatever page size the table is using.
   */
async getAllForExport(filters: any = {}): Promise<any[]> {
  let params = new HttpParams().set('limit', '100000').set('page', '1');
  Object.keys(filters).forEach(k => { if (filters[k]) params = params.set(k, filters[k]); });
  const res: any = await firstValueFrom(this.http.get(`${this.API}/registrations`, { params }));
  return res.data || [];
}
  getById(id: string): Promise<any> {
    return firstValueFrom(this.http.get(`${this.API}/registrations/${id}`));
  }

  updateStatus(id: string, status: string, notes?: string): Promise<any> {
    return firstValueFrom(this.http.patch(`${this.API}/registrations/${id}`, { status, notes }));
  }

  delete(id: string): Promise<any> {
    return firstValueFrom(this.http.delete(`${this.API}/registrations/${id}`));
  }

  getStats(): Promise<any> {
    return firstValueFrom(this.http.get(`${this.API}/admin/stats`));
  }
}