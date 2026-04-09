import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  cartCount: number = 0;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.updateCartCount();
    // Listen to cart changes
    window.addEventListener('storage', () => this.updateCartCount());
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get userName(): string {
    const user = this.authService.getUser();
    return user ? user.fullName.split(' ')[0] : '';
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    this.cartCount = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}