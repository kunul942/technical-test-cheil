import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup; // Definite assignment assertion
  loading = false;
  submitted = false;
  returnUrl: string = '/'; // Initialize with default value
  error: string = ''; // Initialize with empty string

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { 
    if (this.authService.currentUserValue) { 
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]], // Changed from username to email
      password: ['', Validators.required]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = ''; // Clear previous errors
    
    this.authService.login(this.f['email'].value, this.f['password'].value)
      .subscribe({
        next: () => {
          if (this.authService.isAdmin) {
            this.router.navigate([this.returnUrl || '/admin']);
          } else {
            this.router.navigate([this.returnUrl || '/profile']);
          }
        },
        error: (error) => {
          this.error = error.message || 'Login failed. Please try again.';
          this.loading = false;
        }
      });
  }
}