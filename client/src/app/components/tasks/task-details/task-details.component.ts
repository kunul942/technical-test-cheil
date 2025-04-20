import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../../services/task.service';
import { Task } from '../../../models/task.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService } from '../../../services/user.service';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [
   CommonModule,
    FormsModule,
    RouterModule, 
    MatInputModule,
    MatChipsModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatSnackBarModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
  ],
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})
export class TaskDetailsComponent implements OnInit {
  task!: Task;
  assignedUser?: any;
  isLoading = true;

  apiUrl = 'http://localhost:5242/api/users';

  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private route: ActivatedRoute,
    private http: HttpClient,
    public router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.loadTask(id);
  }

  loadTask(id: number): void {
    this.isLoading = true;
    this.taskService.getTask(id).subscribe({
      next: (task) => {
        this.task = task;
        this.loadAssignedUser(task.userId);
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Task not found', 'Close', { duration: 3000 });
        this.router.navigate(['/tasks']);
      }
    });
  }

  loadAssignedUser(userId:number): void {

    this.isLoading = true;
    this.http.get<User>(`${this.apiUrl}/${userId}`).subscribe({
      next: (user) => {
        this.assignedUser = user;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
        this.isLoading = false;
      }
    });
  }

  toggleComplete(): void {
    this.task.isCompleted = !this.task.isCompleted;
    this.taskService.updateTask(this.task.id, this.task).subscribe({
      next: () => {
        this.snackBar.open('Task status updated', 'Close', { duration: 2000 });
      },
      error: () => {
        this.snackBar.open('Error updating task', 'Close', { duration: 2000 });
        this.task.isCompleted = !this.task.isCompleted; // Revert change
      }
    });
  }

  deleteTask(): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(this.task.id).subscribe({
        next: () => {
          this.snackBar.open('Task deleted', 'Close', { duration: 3000 });
          this.router.navigate(['/tasks']);
        },
        error: () => {
          this.snackBar.open('Error deleting task', 'Close', { duration: 3000 });
        }
      });
    }
  }
}