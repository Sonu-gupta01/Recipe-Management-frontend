import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service'; 

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  email: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService 
  ) {}

  ngOnInit(): void {
    // Fetch the email from the query parameters if available
    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.email = params['email']; // Pre-fill the email field
      }
    });
  }

  updatePassword(): void {
    if (!this.email || !this.newPassword || !this.confirmPassword) {
      this.toastService.showError('Please enter all fields.', 'Validation Error');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.toastService.showError('Passwords do not match.', 'Validation Error');
      return;
    }

    const payload = { email: this.email, newPassword: this.newPassword };

    // Call the service to update the password
    this.authService.updatePassword(payload).subscribe({
      next: (response) => {
        this.toastService.showSuccess('Password updated successfully.', 'Success');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error updating password:', error);
        const errorMessage = error.error.message || 'An error occurred. Please try again.';
        this.toastService.showError(errorMessage, 'Error');
      }
    });
  }
}
