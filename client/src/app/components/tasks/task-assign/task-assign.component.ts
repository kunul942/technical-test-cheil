// import { Component, OnInit } from '@angular/core';
// import { TaskService } from '../../../services/task.service';
// import { UserService } from '../../../services/user.service';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { MatSelectModule } from '@angular/material/select';
// import { MatButtonModule } from '@angular/material/button';
// import { MatCardModule } from '@angular/material/card';
// import { ActivatedRoute, Router, RouterModule } from '@angular/router';
// import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
// import { Task } from '../../../models/task.model';
// import { MatInputModule } from '@angular/material/input';
// import { MatIconModule } from '@angular/material/icon';
// import { MatDividerModule } from '@angular/material/divider';
// import { MatChipsModule } from '@angular/material/chips';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { MatFormFieldModule } from '@angular/material/form-field';

// @Component({
//   selector: 'app-task-assign',
//   standalone: true,
//   imports: [
//     CommonModule,
//     RouterModule, 
//     MatInputModule,
//   MatButtonModule,
//   MatCardModule,
//   MatSelectModule,
//   MatSnackBarModule,
//   MatIconModule,
//   MatDividerModule,
//   MatProgressSpinnerModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatSelectModule,
//     MatButtonModule
//   ],
//   templateUrl: './task-assign.component.html',
//   styleUrls: ['./task-assign.component.scss']
// })
// export class TaskAssignComponent implements OnInit {
//   taskId!: number;
//   task?: Task;
//   users: any[] = [];
//   selectedUserId!: number;
//   isLoading = false;

//   constructor(
//     private taskService: TaskService,
//     private userService: UserService,
//     private route: ActivatedRoute,
//     public router: Router,
//     private snackBar: MatSnackBar
//   ) {}

//   ngOnInit(): void {
//     this.taskId = this.route.snapshot.params['id'];
//     this.loadTask();
//     this.loadUsers();
//   }

//   loadTask(): void {
//     this.isLoading = true;
//     this.taskService.getTask(this.taskId).subscribe({
//       next: (task) => {
//         this.task = task;
//         this.selectedUserId = task.userId;
//         this.isLoading = false;
//       },
//       error: () => {
//         this.snackBar.open('Error loading task', 'Close', { duration: 3000 });
//         this.router.navigate(['/tasks']);
//       }
//     });
//   }

// //   loadUsers(): void {
// //   this.userService.getAllUsers().subscribe({
// //     next: (users) => {
// //       console.log('Users loaded:', users); // ← AÑADE ESTO
// //       this.users = users;
// //     },
// //     error: () => {
// //       this.snackBar.open('Error loading users', 'Close', { duration: 3000 });
// //     }
// //   });
// // }

// loadUsers(): void {
//     this.isLoading = true;
//     this.http.get<User[]>(this.apiUrl).subscribe({
//       next: (users) => {
//         this.dataSource = new MatTableDataSource(users);
//         this.dataSource.paginator = this.paginator;
//         this.dataSource.sort = this.sort;
//         this.isLoading = false;
//       },
//       error: (error) => {
//         console.error('Error loading users:', error);
//         this.isLoading = false;
//       }
//     });
//   }


//   assignTask(): void {
//     if (!this.selectedUserId) return;

//     this.isLoading = true;
//     this.taskService.assignTask(this.taskId, this.selectedUserId).subscribe({
//       next: () => {
//         this.snackBar.open('Task assigned successfully', 'Close', { duration: 3000 });
//         this.router.navigate(['/tasks', this.taskId]);
//       },
//       error: () => {
//         this.snackBar.open('Error assigning task', 'Close', { duration: 3000 });
//         this.isLoading = false;
//       }
//     });
//   }
// }
import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../../services/task.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Task } from '../../../models/task.model';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
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
  selector: 'app-task-assign',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule, 
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatSnackBarModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    FormsModule
  ],
  templateUrl: './task-assign.component.html',
  styleUrls: ['./task-assign.component.scss']
})
export class TaskAssignComponent implements OnInit {
  taskId!: number;
  task?: Task;
  users: User[] = [];
  selectedUserId!: number;
  isLoading = false;
  apiUrl = 'http://localhost:5242/api/users'; // Ajusta esta URL según tu backend

  constructor(
    private taskService: TaskService,
    private http: HttpClient,
    private route: ActivatedRoute,
    public router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.taskId = this.route.snapshot.params['id'];
    this.loadTask();
    this.loadUsers();
  }

  loadTask(): void {
    this.isLoading = true;
    this.taskService.getTask(this.taskId).subscribe({
      next: (task) => {
        this.task = task;
        this.selectedUserId = task.userId;
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Error loading task', 'Close', { duration: 3000 });
        this.router.navigate(['/tasks']);
      }
    });
  }

  loadUsers(): void {
    this.isLoading = true;
    this.http.get<User[]>(this.apiUrl).subscribe({
      next: (users) => {
        console.log(users,'user')
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

  assignTask(): void {
    if (!this.selectedUserId) return;

    this.isLoading = true;
    this.taskService.assignTask(this.taskId, this.selectedUserId).subscribe({
      next: () => {
        this.snackBar.open('Task assigned successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/tasks', this.taskId]);
      },
      error: () => {
        this.snackBar.open('Error assigning task', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }
}
