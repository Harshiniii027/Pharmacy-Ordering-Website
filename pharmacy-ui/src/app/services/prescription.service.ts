import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {

  baseUrl = 'http://localhost:5268/api/prescription';

  constructor(private http: HttpClient) {}

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
  }
}