import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl = '/';
  error = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    const passwordField = document.querySelector('input[formControlName="password"]') as HTMLInputElement;
    if (passwordField) {
      passwordField.type = this.showPassword ? 'text' : 'password';
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.error = '';
    
    this.authService.login(
      this.loginForm.value.email,
      this.loginForm.value.password
    ).subscribe({
      next: () => {
        const redirectUrl = this.route.snapshot.queryParams['returnUrl'] || 
                          (this.authService.isAdmin ? '/admin' : '/profile');
        this.router.navigate([redirectUrl]);
      },
      error: (error) => {
        this.loading = false;
        this.error = error || 'Login failed. Please try again.';
        this.snackBar.open(this.error, 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}