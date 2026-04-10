import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
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
  userRole: string = '';
  private subscriptions: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.updateUserState();
    
    this.subscriptions.add(
      this.authService.currentUser.subscribe(user => {
        console.log('Navbar received user update:', user);
        this.updateUserState();
      })
    );

    // Only subscribe to cart if user is NOT admin
    this.subscriptions.add(
      this.cartService.cartItems$.subscribe(() => {
        if (this.isLoggedIn && !this.isAdmin) {
          this.updateCartCount();
        }
      })
    );
  }

  updateUserState() {
    this.isLoggedIn = this.authService.isLoggedIn();
    
    if (this.isLoggedIn) {
      const user = this.authService.getUser();
      this.userName = user?.fullName?.split(' ')[0] || 'User';
      this.isAdmin = this.authService.isAdmin();
      this.userRole = user?.role || 'Customer';
      
      // Only update cart for non-admin users
      if (!this.isAdmin) {
        this.updateCartCount();
      } else {
        this.cartCount = 0;
      }
      
      console.log('Navbar state:', {
        isLoggedIn: this.isLoggedIn,
        userName: this.userName,
        isAdmin: this.isAdmin,
        userRole: this.userRole,
        cartCount: this.cartCount
      });
    } else {
      this.userName = '';
      this.isAdmin = false;
      this.userRole = '';
      this.cartCount = 0;
    }
  }

  updateCartCount() {
    this.cartCount = this.cartService.getCartCount();
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  logout() {
    this.authService.logout();
    this.updateUserState();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}