import { Routes } from '@angular/router';
import { ForgotPasswordComponent } from './Auth/forgetPassword/forget-password/forget-password.component';
import { LoginComponent } from './Auth/login/login/login.component';
import { RegisterComponent } from './Auth/register/register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard]
  }
];
