import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthHelper } from '../helpers/auth.helper';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = `http://localhost:5242/api/tasks`;

  constructor(
    private http: HttpClient,
    private authHelper: AuthHelper
  ) { }

  getTasks() {
    return this.http.get<Task[]>(this.apiUrl, {
      headers: this.authHelper.getAuthHeaders()
    });
  }

  getTask(id: number) {
    return this.http.get<Task>(`${this.apiUrl}/${id}`, {
      headers: this.authHelper.getAuthHeaders()
    });
  }

  createTask(task: Task) {
    return this.http.post<Task>(this.apiUrl, task, {
      headers: this.authHelper.getAuthHeaders()
    });
  }

  updateTask(id: number, task: Task) {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task, {
      headers: this.authHelper.getAuthHeaders()
    });
  }

  deleteTask(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.authHelper.getAuthHeaders()
    });
  }

  assignTask(taskId: number, userId: number) {
    return this.http.put(`${this.apiUrl}/${taskId}/assign/${userId}`, null, {
      headers: this.authHelper.getAuthHeaders()
    });
  }

  searchTasks(query: string) {
    return this.http.get<Task[]>(`${this.apiUrl}/search?query=${query}`, {
      headers: this.authHelper.getAuthHeaders()
    });
  }
}