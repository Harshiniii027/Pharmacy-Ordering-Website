import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit {

  orders: any[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  // 🔹 Load all orders
  loadOrders() {
    this.orderService.getAllOrders().subscribe({
      next: (res: any) => {
        this.orders = res;
      },
      error: () => {
        alert("Failed to load orders");
      }
    });
  }

  // 🔹 Update order status
  updateStatus(orderId: number, status: string) {
    this.orderService.updateStatus(orderId, status).subscribe({
      next: () => {
        alert("Status updated");
        this.loadOrders(); // refresh list
      },
      error: () => {
        alert("Update failed");
      }
    });
  }
}