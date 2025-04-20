import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../../services/task.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-reports',
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
  templateUrl: './task-reports.component.html',
  styleUrls: ['./task-reports.component.scss']
})
export class TaskReportsComponent implements OnInit {
  completedTasks = 0;
  pendingTasks = 0;
  totalTasks = 0;
  completionPercentage = 0;
  isLoading = true;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadReportData();
  }

  loadReportData(): void {
    this.isLoading = true;
    this.taskService.getTasks().subscribe({
      next: tasks => {
        this.completedTasks = tasks.filter(t => t.isCompleted).length;
        this.pendingTasks = tasks.filter(t => !t.isCompleted).length;
        this.totalTasks = tasks.length;
        this.completionPercentage = this.totalTasks > 0 
          ? Math.round((this.completedTasks / this.totalTasks) * 100)
          : 0;
        this.isLoading = false;
      },
      error: err => {
        console.error('Error loading report data:', err);
        this.isLoading = false;
      }
    });
  }
}