import { Component } from '@angular/core';
import { MenuService } from '../../../services/menu.service';
import { AuthService } from '../../../services/auth.service'; 
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../../services/toast.service'; 

@Component({
  selector: 'app-menu-delete',
  templateUrl: './menu-delete.component.html',
  styleUrls: ['./menu-delete.component.css'],
})
export class MenuDeleteComponent {
  menuId: string = '';

  constructor(
    private menuService: MenuService,
    private authService: AuthService, 
    private toastService: ToastService, 
    private router: Router
  ) {}

  deleteMenu() {
    const email = localStorage.getItem('email'); 
    if (!email) {
      this.toastService.showError('User information is missing. You do not have access to delete this menu.');
      return;
    }

    this.authService.getUserIdByEmail(email).subscribe({
      next: (user) => {
        const userId = user.id; 

        // Call delete API with userId
        this.menuService.deleteMenu(this.menuId, userId).subscribe({
          next: (response: any) => {
            console.log('Response from server:', response);
            const successMessage =
              response && typeof response === 'string' ? response : 'Menu deleted successfully';
            this.toastService.showSuccess(successMessage); // Use ToastService for success message
            this.router.navigate(['/menus']);
          },
          error: (error: HttpErrorResponse) => {
            console.error('Error deleting menu:', error);
            const errorMessage =
              error.error || 'Error deleting menu. Please try again.';
            this.toastService.showError(errorMessage); // Use ToastService for error message
          },
        });
      },
      error: (err) => {
        console.error('Error fetching user details:', err);
        this.toastService.showError('Failed to fetch user details. You may not have access.');
      },
    });
  }
}
