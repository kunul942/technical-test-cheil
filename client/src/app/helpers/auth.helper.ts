// src/app/shared/helpers/auth.helper.ts
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthHelper {
  private readonly TOKEN_KEY = 'auth_token';

  constructor() {}

  // Get the authentication token from localStorage
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Create headers with authorization token
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getUserId(): string | null {
    const token = this.getToken();
    if (!token) return null;
    
    const userData = localStorage.getItem('auth_user');
    return userData ? JSON.parse(userData).id : null;
  }

  // Store the token
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // Remove the token (logout)
  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }
}