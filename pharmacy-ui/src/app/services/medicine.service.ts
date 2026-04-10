import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Medicine, Category, MedicineCreateRequest } from '../models/models';

@Injectable({ providedIn: 'root' })
export class MedicineService {
  private apiUrl = 'http://localhost:5268/api';

  constructor(private http: HttpClient) {}

  getMedicines(categoryId?: number, search?: string): Observable<Medicine[]> {
    let params = new HttpParams();
    if (categoryId) params = params.set('categoryId', categoryId.toString());
    if (search) params = params.set('search', search);
    return this.http.get<Medicine[]>(`${this.apiUrl}/Medicines`, { params });
  }

  getMedicineById(id: number): Observable<Medicine> {
    return this.http.get<Medicine>(`${this.apiUrl}/Medicines/${id}`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/Categories`);
  }

  // Admin Methods
  createMedicine(medicine: MedicineCreateRequest): Observable<Medicine> {
    return this.http.post<Medicine>(`${this.apiUrl}/Medicines`, medicine);
  }

  updateMedicine(id: number, medicine: Partial<Medicine>): Observable<Medicine> {
    return this.http.put<Medicine>(`${this.apiUrl}/Medicines/${id}`, medicine);
  }

  deleteMedicine(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Medicines/${id}`);
  }

  updateStock(medicineId: number, quantity: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/Medicines/${medicineId}/stock`, { quantity });
  }

  createCategory(category: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/Categories`, category);
  }

  updateCategory(id: number, category: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/Categories/${id}`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Categories/${id}`);
  }
}

export { Medicine, Category };
