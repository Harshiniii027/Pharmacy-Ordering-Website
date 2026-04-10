import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prescription } from '../models/models';

@Injectable({ providedIn: 'root' })
export class PrescriptionService {
  private apiUrl = 'http://localhost:5268/api/Prescription';

  constructor(private http: HttpClient) {}

  // Upload prescription
  uploadPrescription(userId: number, file: File): Observable<Prescription> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId.toString());
    return this.http.post<Prescription>(`${this.apiUrl}/upload`, formData);
  }

  // Get user's prescriptions
  getUserPrescriptions(userId: number): Observable<Prescription[]> {
    return this.http.get<Prescription[]>(`${this.apiUrl}/user/${userId}`);
  }

  // Get my prescriptions (for current logged-in user)
  getMyPrescriptions(): Observable<Prescription[]> {
    return this.http.get<Prescription[]>(`${this.apiUrl}/my`);
  }

  // Admin: Get all prescriptions
  getAllPrescriptions(): Observable<Prescription[]> {
    return this.http.get<Prescription[]>(`${this.apiUrl}/all`);
  }

  // Admin: Update prescription status
  updatePrescriptionStatus(id: number, status: string, notes?: string): Observable<Prescription> {
    return this.http.put<Prescription>(`${this.apiUrl}/status/${id}`, { status, notes });
  }

  // Simple status update (without notes)
  updateStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/status/${id}?status=${status}`, {});
  }
}