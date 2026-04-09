import { Component } from '@angular/core';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent {

  userId = 1;
  prescriptionId: number | null = null;

  cart = [
    { medicineId: 1, quantity: 2 },
    { medicineId: 2, quantity: 1 }
  ];

  constructor(private orderService: OrderService) {}

  placeOrder() {
    const order = {
      userId: this.userId,
      prescriptionId: this.prescriptionId,
      items: this.cart
    };

    this.orderService.placeOrder(order).subscribe({
      next: () => alert("Order placed successfully"),
      error: (err) => alert(err.error)
    });
  }
}