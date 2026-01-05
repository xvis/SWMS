import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
// import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  fullName = '';
  email = '';
  password = '';
  message = '';

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    if (!this.fullName || !this.email || !this.password) {
      this.message = 'Please fill in all fields!';
      return;
    }
    
    this.authService.register(this.email, this.password, this.fullName).subscribe({
      next: (res) => {
        this.message = 'Registration successful! Redirecting to login...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err) => {
        this.message = err.error?.message || 'Registration failed! Please try again.';
        console.error('Registration error:', err);
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
