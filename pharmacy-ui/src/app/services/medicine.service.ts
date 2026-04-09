import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Medicine, Category } from '../models/models';

@Injectable({ providedIn: 'root' })
export class MedicineService {
  private apiUrl = 'http://localhost:5268/api';

  constructor(private http: HttpClient) {}

  getMedicines(categoryId?: number, search?: string): Observable<Medicine[]> {
    let url = `${this.apiUrl}/Medicines`;
    const params: any = {};
    if (categoryId) params.categoryId = categoryId;
    if (search) params.search = search;
    return this.http.get<Medicine[]>(url, { params });
  }

  getMedicineById(id: number): Observable<Medicine> {
    return this.http.get<Medicine>(`${this.apiUrl}/Medicines/${id}`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/Categories`);
  }
}