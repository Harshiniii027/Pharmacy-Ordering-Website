import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserDashboardService, UserDashboardStats, RecentOrder } from '../../../services/user-dashboard.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit, OnDestroy {
  user: any = null;
  stats: UserDashboardStats = {
    totalOrders: 0,
    totalSpent: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    prescriptionsCount: 0,
    approvedPrescriptions: 0,
    pendingPrescriptions: 0,
    wishlistCount: 0
  };
  recentOrders: RecentOrder[] = [];
  loading = true;
  currentTime = new Date();
  greeting: string = '';
  private subscriptions: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private dashboardService: UserDashboardService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.authService.getUser();
    this.setGreeting();
    this.loadDashboardData();
  }

  setGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) {
      this.greeting = 'Good Morning';
    } else if (hour < 17) {
      this.greeting = 'Good Afternoon';
    } else {
      this.greeting = 'Good Evening';
    }
  }

  loadDashboardData() {
    if (!this.user) return;

    // For now, using mock data until backend is ready
    this.stats = {
      totalOrders: 6,
      totalSpent: 1950,
      pendingOrders: 2,
      deliveredOrders: 4,
      cancelledOrders: 0,
      prescriptionsCount: 3,
      approvedPrescriptions: 2,
      pendingPrescriptions: 1,
      wishlistCount: 5
    };
    
    this.recentOrders = [
      { id: 1001, orderDate: '2025-04-15', totalAmount: 350, status: 'Delivered', itemsCount: 2 },
      { id: 1002, orderDate: '2025-04-10', totalAmount: 180, status: 'Processing', itemsCount: 1 },
      { id: 1003, orderDate: '2025-04-05', totalAmount: 425, status: 'Delivered', itemsCount: 4 }
    ];
    
    this.loading = false;
  }

  getStatusBadgeClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'pending': return 'status-pending';
      case 'processing': return 'status-processing';
      case 'delivered': return 'status-delivered';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-default';
    }
  }

  getStatusIcon(status: string): string {
    switch (status?.toLowerCase()) {
      case 'pending': return 'fa-clock';
      case 'processing': return 'fa-spinner';
      case 'delivered': return 'fa-check-circle';
      default: return 'fa-question-circle';
    }
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}