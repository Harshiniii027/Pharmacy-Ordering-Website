import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phone: string;
}

export interface AuthResponse {
  token: string;
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5268/api/Auth';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient, private router: Router) {
    const storedUser = this.getUser();
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser);
    this.currentUser = this.currentUserSubject.asObservable();
    
    // Log for debugging
    console.log('AuthService initialized. User:', storedUser);
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  register(data: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data).pipe(
      catchError(this.handleError)
    );
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
      tap((response: AuthResponse) => {
        console.log('Login response:', response);
        if (response && response.token) {
          this.setSession(response);
          const user = this.getUser();
          console.log('User after login:', user);
          this.currentUserSubject.next(user);
        }
      }),
      catchError(this.handleError)
    );
  }

  private setSession(authResult: AuthResponse): void {
    localStorage.setItem('token', authResult.token);
    const user = {
      id: authResult.id,
      fullName: authResult.fullName,
      email: authResult.email,
      phone: authResult.phone,
      role: authResult.role
    };
    localStorage.setItem('user', JSON.stringify(user));
    console.log('Session set. User role:', user.role);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    console.log('User logged out');
    this.router.navigate(['/home']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): User | null {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        console.log('getUser() returning:', parsedUser);
        return parsedUser;
      } catch (e) {
        console.error('Error parsing user:', e);
        return null;
      }
    }
    return null;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    const isLoggedIn = !!token;
    console.log('isLoggedIn():', isLoggedIn);
    return isLoggedIn;
  }

  isAdmin(): boolean {
    const user = this.getUser();
    const isAdmin = user?.role?.toLowerCase() === 'admin';
    console.log('isAdmin():', isAdmin, 'User role:', user?.role);
    return isAdmin;
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred';
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.status === 400) {
      errorMessage = 'Invalid request';
    } else if (error.status === 401) {
      errorMessage = 'Invalid email or password';
    }
    return throwError(() => new Error(errorMessage));
  }
}