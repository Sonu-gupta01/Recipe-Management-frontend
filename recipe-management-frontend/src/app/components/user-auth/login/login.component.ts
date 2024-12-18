import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  showForgotPasswordLink: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  login(): void {
    const user = { email: this.email, password: this.password };

    this.authService.login(user).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        localStorage.setItem('email', this.email);
        this.authService.setAuthenticationStatus(true);
        this.toastService.showSuccess('You have logged in successfully!', 'Login Successful');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Login failed:', err);
        if (err.status === 400) {
          this.errorMessage = 'Invalid credentials. Please try again.';
          this.showForgotPasswordLink = true;
          this.toastService.showError(this.errorMessage, 'Login Failed');
        } else if (err.status === 500) {
          this.errorMessage = 'Server error. Please try again later.';
          this.toastService.showError(this.errorMessage, 'Server Error'); 
        } else {
          this.errorMessage = 'An unknown error occurred. Please try again.';
          this.toastService.showError(this.errorMessage, 'Unknown Error'); 
        }
      },
    });
  }
  navigateToForgotPassword(): void {
    this.router.navigate(['/forgot-password'], { queryParams: { email: this.email } });
  }
}
