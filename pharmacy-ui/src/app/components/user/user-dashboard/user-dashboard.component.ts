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

    this.subscriptions.add(
      this.dashboardService.getUserStats(this.user.id).subscribe({
        next: (data) => {
          this.stats = data;
        },
        error: (error) => console.error('Error loading stats:', error)
      })
    );

    this.subscriptions.add(
      this.dashboardService.getRecentOrders(this.user.id, 5).subscribe({
        next: (data) => {
          this.recentOrders = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading orders:', error);
          this.loading = false;
        }
      })
    );
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
      case 'cancelled': return 'fa-times-circle';
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