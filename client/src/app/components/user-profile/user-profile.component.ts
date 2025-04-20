import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { UserEditModalComponent } from '../admin-view/user-edit-modal/user-edit-modal.component';
import { AuthHelper } from '../../helpers/auth.helper';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { ToastHelper } from '../../helpers/toast.helper';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  user: User | null = null;
  isLoading = true;
  apiUrl = 'http://localhost:5242/api/users';

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private authHelper: AuthHelper,
    private toast: ToastHelper
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    const userId = this.authHelper.getUserId(); // You'll need to implement this in AuthHelper
    if (!userId) return;

    this.isLoading = true;
    this.http.get<User>(`${this.apiUrl}/${userId}`, { 
      headers: this.authHelper.getAuthHeaders() 
    }).subscribe({
      next: (user) => {
        this.user = user;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
        this.isLoading = false;
        this.toast.showError('Failed to load profile');
      }
    });
  }

  openEditDialog(): void {
    if (!this.user) return;

    const dialogRef = this.dialog.open(UserEditModalComponent, {
      width: '500px',
      data: { ...this.user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateUser(result);
      }
    });
  }

  updateUser(user: User): void {
    this.http.put(`${this.apiUrl}/${user.id}`, user, { 
      headers: this.authHelper.getAuthHeaders()
    }).subscribe({
      next: () => {
        this.loadUserProfile();
        this.toast.showSuccess('Profile updated successfully!');
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.toast.showError(error.error?.message || 'Failed to update profile');
      }
    });
  }
}