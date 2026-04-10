import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../../services/cart.service';
import { OrderService } from '../../../services/order.service';
import { AuthService } from '../../../services/auth.service';
import { PrescriptionService } from '../../../services/prescription.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalAmount: number = 0;
  prescriptions: any[] = [];
  selectedPrescriptionId: number | null = null;
  loading = false;
  orderPlaced = false;
  orderId: number | null = null;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private prescriptionService: PrescriptionService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCart();
    this.loadPrescriptions();
  }

  loadCart() {
    this.cartItems = this.cartService.getCartItems();
    this.totalAmount = this.cartService.getTotalAmount();
    
    if (this.cartItems.length === 0) {
      this.router.navigate(['/cart']);
    }
  }

  loadPrescriptions() {
    const user = this.authService.getUser();
    if (user) {
      this.prescriptionService.getUserPrescriptions(user.id).subscribe({
        next: (data: any) => {
          this.prescriptions = data;
        },
        error: (error) => console.error('Error loading prescriptions:', error)
      });
    }
  }

  placeOrder() {
    const user = this.authService.getUser();
    if (!user) {
      alert('Please login to place order');
      this.router.navigate(['/login']);
      return;
    }

    // Check for prescription required items
    const prescriptionItems = this.cartItems.filter(item => item.requiresPrescription);
    if (prescriptionItems.length > 0 && !this.selectedPrescriptionId) {
      alert('Please upload a prescription for prescription medicines');
      return;
    }

    this.loading = true;
    
    const orderData = {
      userId: user.id,
      prescriptionId: this.selectedPrescriptionId || undefined,
      items: this.cartItems.map(item => ({
        medicineId: item.id,
        quantity: item.quantity
      })),
      shippingAddress: '',
      paymentMethod: ''
    };

    this.orderService.placeOrder(orderData).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.orderPlaced = true;
        this.orderId = response.id;
        this.cartService.clearCart();
      },
      error: (error) => {
        this.loading = false;
        alert('Failed to place order: ' + (error.error?.message || 'Unknown error'));
      }
    });
  }

  goToOrders() {
    this.router.navigate(['/my-orders']);
  }

  continueShopping() {
    this.router.navigate(['/shop']);
  }
}