import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
// import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgotPasswordComponent {
  email = '';
  newPassword = '';
  message = '';

  constructor(private authService: AuthService, private router: Router) {}

  onResetPassword() {
    if (!this.email || !this.newPassword) {
      this.message = 'Please fill in all fields!';
      return;
    }

    if (this.newPassword.length < 6) {
      this.message = 'Password must be at least 6 characters long!';
      return;
    }

    this.authService.resetPassword(this.email, this.newPassword).subscribe({
      next: (res: any) => {
        this.message = 'Password reset successfully! Redirecting to login...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err: any) => {
        this.message = err.error?.message || 'Reset failed! Please check your email.';
        console.error('Reset password error:', err);
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
