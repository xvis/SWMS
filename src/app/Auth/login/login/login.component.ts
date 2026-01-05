import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone:true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatIconModule,MatCardModule,ReactiveFormsModule,FormsModule],
})
export class LoginComponent {
  email = '';
  password = '';
  message = '';
  showPassword = false;
  rememberMe = false;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    if (!this.email || !this.password) {
      this.message = 'Please enter both email and password!';
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        this.message = 'Login successful! Redirecting...';
        console.log('Login response:', res);
        console.log('Access Token stored:', res.accessToken);
        
        // Navigate to dashboard after successful login
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 500);
      },
      error: (err) => {
        this.message = err.error?.message || 'Invalid email or password!';
        console.error('Login error:', err);
      }
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
}

