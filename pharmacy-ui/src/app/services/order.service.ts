import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  baseUrl = 'http://localhost:5268/api/order';

  constructor(private http: HttpClient) {}

  placeOrder(data: any) {
    return this.http.post(`${this.baseUrl}/place`, data);
  }

  getUserOrders(userId: number) {
    return this.http.get(`${this.baseUrl}/user/${userId}`);
  }

  getAllOrders() {
    return this.http.get(`${this.baseUrl}/all`);
  }

  updateStatus(orderId: number, status: string) {
    return this.http.put(`${this.baseUrl}/status/${orderId}?status=${status}`, {});
  }
}