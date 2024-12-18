import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../services/toast.service'; 

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  email: string = '';
  role: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService 
  ) {}

  onRegister(): void {
    if (this.isFormValid()) {
      const newUser = {
        username: this.username,
        password: this.password,
        email: this.email,
        role: this.role,
      };

      this.authService.register(newUser).subscribe({
        next: () => {
          this.toastService.showSuccess('User registered successfully.', 'Success');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Error during registration:', err);
          const errorMessage = err.error.message || 'An error occurred while registering. Please try again.';
          this.toastService.showError(errorMessage, 'Error');
        },
      });
    }
  }

  isFormValid(): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|outlook|hotmail)\.com$/;
    if (!emailPattern.test(this.email)) {
      this.toastService.showError('Email must be a valid Gmail, Yahoo, Outlook, or Hotmail address.', 'Validation Error');
      return false;
    }
    if (/\s/.test(this.password)) {
      this.toastService.showError('Password cannot contain spaces.', 'Validation Error');
      return false;
    }
    if (/^[^A-Za-z]/.test(this.username)) {
      this.toastService.showError('Username cannot start with a special character.', 'Validation Error');
      return false;
    }
    return true;
  }
}
