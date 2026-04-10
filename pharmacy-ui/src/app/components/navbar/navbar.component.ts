import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  cartCount: number = 0;
  isLoggedIn: boolean = false;
  userName: string = '';
  isAdmin: boolean = false;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.subscriptions.add(
      this.authService.currentUser.subscribe(user => {
        this.isLoggedIn = !!user;
        this.userName = user?.fullName?.split(' ')[0] || '';
        this.isAdmin = this.authService.isAdmin();
        
        // Update cart count when login status changes
        if (this.isLoggedIn) {
          this.updateCartCount();
        } else {
          this.cartCount = 0;
        }
      })
    );

    this.subscriptions.add(
      this.cartService.cartItems$.subscribe(() => {
        if (this.isLoggedIn) {
          this.updateCartCount();
        }
      })
    );
  }

  updateCartCount() {
    this.cartCount = this.cartService.getCartCount();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}