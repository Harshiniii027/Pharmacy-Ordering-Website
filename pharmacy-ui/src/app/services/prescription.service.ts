import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prescription } from '../models/models';

@Injectable({ providedIn: 'root' })
export class PrescriptionService {
  private apiUrl = 'http://localhost:5268/api/Prescription';

  constructor(private http: HttpClient) {}

<<<<<<< HEAD
  uploadPrescription(userId: number, file: File): Observable<Prescription> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId.toString());
    return this.http.post<Prescription>(`${this.apiUrl}/upload`, formData);
  }

  getUserPrescriptions(userId: number): Observable<Prescription[]> {
    return this.http.get<Prescription[]>(`${this.apiUrl}/user/${userId}`);
  }

  // Admin Methods
  getAllPrescriptions(): Observable<Prescription[]> {
    return this.http.get<Prescription[]>(`${this.apiUrl}/all`);
  }

  updatePrescriptionStatus(id: number, status: string, notes?: string): Observable<Prescription> {
    return this.http.put<Prescription>(`${this.apiUrl}/status/${id}`, { status, notes });
=======
  // upload(file: File, userId: number) {
  //   const formData = new FormData();
  //   formData.append('file', file);
  //   formData.append('userId', userId.toString());

  //   return this.http.post(`${this.baseUrl}/upload`, formData);
  // }

  upload(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  return this.http.post(`${this.baseUrl}/upload`, formData);
}

  // getUserPrescriptions(userId: number) {
  //   return this.http.get(`${this.baseUrl}/user/${userId}`);
  // }

  getMyPrescriptions() {
  return this.http.get(`${this.baseUrl}/my`);
}
      
  updateStatus(id: number, status: string) {
    return this.http.put(`${this.baseUrl}/status/${id}?status=${status}`, {});
>>>>>>> f4583b56475f008f8cd75e0f388066ae4e8abe03
  }
}