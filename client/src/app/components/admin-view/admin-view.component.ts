import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { UserEditModalComponent } from './user-edit-modal/user-edit-modal.component';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthHelper } from '../../helpers/auth.helper';
import { ToastHelper } from '../../helpers/toast.helper';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-admin-view',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.scss']
})
export class AdminViewComponent implements OnInit {
  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'email', 'role', 'actions'];
  dataSource!: MatTableDataSource<User>;
  apiUrl = 'http://localhost:5242/api/users';
  isLoading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
      private http: HttpClient, 
      private dialog: MatDialog,
      private authHelper: AuthHelper,
      private toast: ToastHelper
  ){
    this.dataSource = new MatTableDataSource<User>([]);
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadUsers(): void {
    this.isLoading = true;
    this.http.get<User[]>(this.apiUrl, { headers: this.authHelper.getAuthHeaders() }).subscribe({
      next: (users) => {
        this.dataSource = new MatTableDataSource(users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openEditDialog(user: User): void {
    const isNewUser = !user.id; // Check if this is a new user (no ID)
    const dialogRef = this.dialog.open(UserEditModalComponent, {
      width: '500px',
      data: { ...user }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (isNewUser) {
          this.createUser(result);
        } else {
          this.updateUser(result);
        }
      }
    });
  }
  
  createUser(user: User): void {
    // Remove any empty ID field before sending
    const { id, ...userWithoutId } = user;
    
    this.http.post<User>(this.apiUrl, userWithoutId, { 
      headers: this.authHelper.getAuthHeaders() 
    }).subscribe({
      next: () => {
        this.loadUsers(); // Refresh the list
        this.toast.showSuccess('User created successfully!');
      },
      error: (error) => {
        console.error('Error creating user:', error);
        this.toast.showError('Error creating user. Please try again.');
      }
    });
  }

  updateUser(user: User): void {
    this.http.put(`${this.apiUrl}/${user.id}`, user, { headers: this.authHelper.getAuthHeaders()}).subscribe({
      next: () => {
        this.loadUsers();
        this.toast.showSuccess('User updated successfully!');
      },
      error: (error) => {
        console.error('Error updating user:', error);
        this.toast.showError('Error updating user. Please try again.');
      }
    });
  }

  openDeleteDialog(userId: string): void {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      width: '350px',
      data: { 
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this user?',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteUser(userId);
      }
    });
  }

  deleteUser(userId: string): void {
    this.http.delete(`${this.apiUrl}/${userId}`, { headers: this.authHelper.getAuthHeaders()}).subscribe({
      next: () => {
        this.loadUsers();
        this.toast.showSuccess('User deleted successfully!');
      },
      error: (error) => {
        console.error('Error deleting user:', error);
        this.toast.showError('Error deleting user. Please try again.');
      }
    });
  }
}