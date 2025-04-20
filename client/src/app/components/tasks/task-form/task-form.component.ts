import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../../services/task.service';
import { Task } from '../../../models/task.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService } from '../../../services/user.service';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClient } from '@angular/common/http';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-task-form',
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
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {
  task: Task = {
    id: 0,
    title: '',
    description: '',
    isCompleted: false,
    createdAt: new Date(),
    userId: 0
  };
  
  isEditMode = false;
  isLoading = false;
  users: User[] = [];
  apiUrl = 'http://localhost:5242/api/users';

  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private http: HttpClient,
    private route: ActivatedRoute,
    public router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.loadTask(id);
    }
  }

  loadUsers(): void {
    this.isLoading = true;
    this.http.get<User[]>(this.apiUrl).subscribe({
      next: (users) => {
        console.log(users,' que soy profe')
        this.users = users;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.snackBar.open('Error loading users', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  loadTask(id: number): void {
    this.isLoading = true;
    this.taskService.getTask(id).subscribe({
      next: (task) => {
        this.task = task;
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Error loading task', 'Close', { duration: 3000 });
        this.router.navigate(['/tasks']);
      }
    });
  }

  onSubmit(): void {
    this.isLoading = true;
    
    const operation = this.isEditMode
      ? this.taskService.updateTask(this.task.id, this.task)
      : this.taskService.createTask(this.task);

    operation.subscribe({
      next: () => {
        this.snackBar.open(`Task ${this.isEditMode ? 'updated' : 'created'} successfully`, 'Close', { duration: 3000 });
        this.router.navigate(['/tasks']);
      },
      error: (err) => {
        console.error('Error saving task:', err);
        this.snackBar.open('Error saving task', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }
}