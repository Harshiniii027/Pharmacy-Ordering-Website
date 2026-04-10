import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserDashboardStats {
  totalOrders: number;
  totalSpent: number;
  pendingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  prescriptionsCount: number;
  approvedPrescriptions: number;
  pendingPrescriptions: number;
  wishlistCount: number;
  lastOrderDate?: string;
}

export interface RecentOrder {
  id: number;
  orderDate: string;
  totalAmount: number;
  status: string;
  itemsCount: number;
}

export interface UserActivity {
  id: number;
  type: string;
  description: string;
  date: string;
  icon: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserDashboardService {
  private apiUrl = 'http://localhost:5268/api';

  constructor(private http: HttpClient) {}

  getUserStats(userId: number): Observable<UserDashboardStats> {
    return this.http.get<UserDashboardStats>(`${this.apiUrl}/User/stats/${userId}`);
  }

  getRecentOrders(userId: number, limit: number = 5): Observable<RecentOrder[]> {
    return this.http.get<RecentOrder[]>(`${this.apiUrl}/Order/user/${userId}/recent?limit=${limit}`);
  }

  getUserActivities(userId: number): Observable<UserActivity[]> {
    return this.http.get<UserActivity[]>(`${this.apiUrl}/User/activities/${userId}`);
  }

  getUserWishlist(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/User/wishlist/${userId}`);
  }

  addToWishlist(userId: number, medicineId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/User/wishlist`, { userId, medicineId });
  }

  removeFromWishlist(userId: number, medicineId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/User/wishlist/${userId}/${medicineId}`);
  }
}