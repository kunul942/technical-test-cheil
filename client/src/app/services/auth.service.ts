import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5242/api/auth';
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  // Key names for localStorage
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  constructor(private http: HttpClient, private router: Router) {
    // Initialize with user data from localStorage if available
    const user = localStorage.getItem(this.USER_KEY);
    this.currentUserSubject = new BehaviorSubject<any>(user ? JSON.parse(user) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  public get token(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  public get isAdmin(): boolean {
    const user = this.currentUserValue;
    return user && user.role === 'admin';
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          if (response && response.token) {
            // Decode the token to get user information
            const decodedToken: any = jwtDecode(response.token);
            
            // Create user object from token
            const user = {
              id: decodedToken.sub || decodedToken.userId, // standard claims use 'sub'
              email: decodedToken.email,
              role: decodedToken.role,
              token: response.token
            };

            // Store token and user in localStorage
            this.storeAuthData(response.token, user);
            
            // Update the current user subject
            this.currentUserSubject.next(user);
          }
        }),
        catchError((error: HttpErrorResponse) => {
          console.log(error,'Error during login:', error.error?.message);
          return throwError(() => error.error?.message || 'Invalid email or password');         
        })
      )
  }

  logout(): void {
    // Clear all auth data
    this.clearAuthData();
    
    // Notify subscribers about the logout
    this.currentUserSubject.next(null);
    
    // Navigate to login page
    this.router.navigate(['/login']);
  }

  private storeAuthData(token: string, user: any): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }
}