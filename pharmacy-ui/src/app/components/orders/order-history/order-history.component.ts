import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html'
})
export class OrderHistoryComponent implements OnInit {

  orders: any[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit() {
  this.orderService.getUserOrders(1).subscribe((res: any) => {
    this.orders = res;
  });
}

  loadOrders() {
    this.orderService.getUserOrders(1).subscribe((res: any) => {
      this.orders = res;
    });
  }
}