import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData = {
    email: '',
    password: ''
  };
  errorMessage = '';
  loading = false;
  returnUrl: string = '/dashboard';

  constructor(
    private authService: AuthService, 
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    
    // If already logged in, redirect to dashboard
    if (this.authService.isLoggedIn()) {
      const user = this.authService.getUser();
      console.log('Already logged in as:', user);
      if (user?.role?.toLowerCase() === 'admin') {
        this.router.navigate(['/admin/dashboard']);
      } else {
        this.router.navigate(['/dashboard']);
      }
    }
  }

  onSubmit() {
    this.loading = true;
    this.errorMessage = '';
    
    console.log('Attempting login with:', this.loginData.email);
    
    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        this.loading = false;
        console.log('Login successful, response:', response);
        
        const user = this.authService.getUser();
        console.log('User after login:', user);
        
        // Redirect based on role
        if (user?.role?.toLowerCase() === 'admin') {
          console.log('Redirecting to admin dashboard');
          this.router.navigate(['/admin/dashboard']);
        } else {
          console.log('Redirecting to user dashboard');
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.message || 'Invalid email or password';
        console.error('Login error:', error);
      }
    });
  }
}