import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  requiresPrescription: boolean;
  stockQuantity: number;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject: BehaviorSubject<CartItem[]> = new BehaviorSubject<CartItem[]>([]);
  public cartItems$: Observable<CartItem[]> = this.cartItemsSubject.asObservable();
  private storageKey = 'pharmacy_cart';

  constructor(private authService: AuthService) {
    // Only load cart if user is logged in
    if (this.authService.isLoggedIn()) {
      this.loadCartFromStorage();
    }
    
    // Listen to login/logout events
    this.authService.currentUser.subscribe(user => {
      if (user) {
        this.loadCartFromStorage();
      } else {
        this.clearCart();
      }
    });
  }

  private loadCartFromStorage(): void {
    const storedCart = localStorage.getItem(`${this.storageKey}_${this.authService.getUser()?.id}`);
    if (storedCart) {
      this.cartItemsSubject.next(JSON.parse(storedCart));
    } else {
      this.cartItemsSubject.next([]);
    }
  }

  private saveCartToStorage(cart: CartItem[]): void {
    const userId = this.authService.getUser()?.id;
    if (userId) {
      localStorage.setItem(`${this.storageKey}_${userId}`, JSON.stringify(cart));
      this.cartItemsSubject.next(cart);
    }
  }

  getCartItems(): CartItem[] {
    if (!this.authService.isLoggedIn()) {
      return [];
    }
    return this.cartItemsSubject.value;
  }

  getCartCount(): number {
    if (!this.authService.isLoggedIn()) {
      return 0;
    }
    return this.cartItemsSubject.value.reduce((sum: any, item: { quantity: any; }) => sum + item.quantity, 0);
  }

  getTotalAmount(): number {
    if (!this.authService.isLoggedIn()) {
      return 0;
    }
    return this.cartItemsSubject.value.reduce((sum: number, item: { price: number; quantity: number; }) => sum + (item.price * item.quantity), 0);
  }

  addToCart(item: CartItem): boolean {
    // CRITICAL: Check if user is logged in
    if (!this.authService.isLoggedIn()) {
      return false;
    }
    
    const currentCart = this.getCartItems();
    const existingItem = currentCart.find(i => i.id === item.id);
    
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      currentCart.push(item);
    }
    
    this.saveCartToStorage(currentCart);
    return true;
  }

  updateQuantity(itemId: number, quantity: number): boolean {
    if (!this.authService.isLoggedIn()) {
      return false;
    }
    
    const currentCart = this.getCartItems();
    const item = currentCart.find(i => i.id === itemId);
    
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(itemId);
      } else if (quantity <= item.stockQuantity) {
        item.quantity = quantity;
        this.saveCartToStorage(currentCart);
      }
      return true;
    }
    return false;
  }

  removeFromCart(itemId: number): boolean {
    if (!this.authService.isLoggedIn()) {
      return false;
    }
    
    const currentCart = this.getCartItems();
    const updatedCart = currentCart.filter(item => item.id !== itemId);
    this.saveCartToStorage(updatedCart);
    return true;
  }

  clearCart(): void {
    if (!this.authService.isLoggedIn()) {
      return;
    }
    const userId = this.authService.getUser()?.id;
    if (userId) {
      localStorage.removeItem(`${this.storageKey}_${userId}`);
      this.cartItemsSubject.next([]);
    }
  }
}