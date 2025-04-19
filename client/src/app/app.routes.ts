import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AdminViewComponent } from './components/admin-view/admin-view.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { LayoutComponent } from './components/layout/layout.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

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