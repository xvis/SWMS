import { Routes } from '@angular/router';
import { ForgotPasswordComponent } from './Auth/forgetPassword/forget-password/forget-password.component';
import { LoginComponent } from './Auth/login/login/login.component';
import { RegisterComponent } from './Auth/register/register/register.component';
// import { LoginComponent } from './login/login.component';
// import { RegisterComponent } from './register/register.component';
// import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
//   { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent) }
];
