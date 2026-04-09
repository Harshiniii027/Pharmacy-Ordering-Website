import { Component } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html'
})
export class CartComponent {

  cart = [
    { medicineId: 1, name: 'Paracetamol', quantity: 2, price: 50 },
    { medicineId: 2, name: 'Dolo', quantity: 1, price: 30 }
  ];

  getTotal() {
    return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
}