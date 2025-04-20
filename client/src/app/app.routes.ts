import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AdminViewComponent } from './components/admin-view/admin-view.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { LayoutComponent } from './components/layout/layout.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { TaskListComponent } from './components/tasks/task-list/task-list.component';
import { TaskFormComponent } from './components/tasks/task-form/task-form.component';
import { TaskDetailsComponent } from './components/tasks/task-details/task-details.component';

export const routes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent 
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { 
        path: 'admin', 
        component: AdminViewComponent, 
        canActivate: [AuthGuard, AdminGuard] 
      },
      { 
        path: 'profile', 
        component: UserProfileComponent, 
        canActivate: [AuthGuard] 
      },
      // Nuevas rutas para tareas
      { 
        path: 'tasks', 
        children: [
          { 
            path: '', 
            component: TaskListComponent, 
            canActivate: [AuthGuard] 
          },
          { 
            path: 'new', 
            component: TaskFormComponent, 
            canActivate: [AuthGuard] 
          },
          { 
            path: ':id', 
            component: TaskDetailsComponent, 
            canActivate: [AuthGuard] 
          },
          { 
            path: ':id/edit', 
            component: TaskFormComponent, 
            canActivate: [AuthGuard] 
          }
        ]
      },
      { 
        path: '', 
        redirectTo: 'profile', 
        pathMatch: 'full' 
      }
    ]
  },
  { 
    path: '**', 
    redirectTo: 'profile' 
  }
];