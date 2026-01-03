import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
// import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgotPasswordComponent {
  email = '';
  newPassword = '';
  message = '';

  constructor(private authService: AuthService, private router: Router) {}

  onResetPassword() {
    this.authService.resetPassword(this.email, this.newPassword).subscribe({
      next: () => {
        this.message = 'Password reset successfully!';
        this.router.navigate(['/login']);
      },
      error: () => {
        this.message = 'Reset failed!';
      }
    });
  }
}
