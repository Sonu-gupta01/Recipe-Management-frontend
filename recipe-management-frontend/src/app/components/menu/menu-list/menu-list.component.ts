import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../../services/menu.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../../services/toast.service';
import Swal from 'sweetalert2'; 

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.css'],
})
export class MenuListComponent implements OnInit {
  menuId: string = '';
  menus: any[] = [];
  totalMenus: number = 0;
  currentPage: number = 0;
  pageSize: number = 3;
  userId: number | null = null;
  totalPages: number = 0;

  constructor(
    private menuService: MenuService,
    private authService: AuthService,
    private toastService: ToastService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    const email = localStorage.getItem('email');
    if (!email) {
      this.toastService.showError('User information is missing. Please log in again.', 'Error');
      this.router.navigate(['/login']);
      return;
    }

    this.authService.getUserIdByEmail(email).subscribe({
      next: (user) => {
        this.userId = user.id;
        this.fetchMenus();
      },
      error: (err) => {
        console.error('Error fetching user details:', err);
        this.toastService.showError('Failed to fetch user information. Please log in again.', 'Error');
        this.router.navigate(['/login']);
      },
    });
  }

  fetchMenus(): void {
    if (this.userId === null) {
      console.error('User ID is missing. Cannot fetch menus.');
      return;
    }

    this.menuService.getMenusForUser(this.userId, this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.menus = response.content;
        this.totalMenus = response.totalElements;
        this.totalPages = Math.ceil(this.totalMenus / this.pageSize);
      },
      error: (error) => {
        console.error('Error fetching menus:', error);
        this.toastService.showError('Failed to fetch menus.', 'Error');
      },
    });
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.fetchMenus();
    }
  }

  nextPage() {
    if ((this.currentPage + 1) * this.pageSize < this.totalMenus) {
      this.currentPage++;
      this.fetchMenus();
    }
  }

  deleteMenu(menuId: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to recover this menu!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        const email = localStorage.getItem('email');
        if (!email) {
          this.toastService.showError('User information is missing. You do not have access to delete this menu.', 'Error');
          return;
        }

        this.authService.getUserIdByEmail(email).subscribe({
          next: (user) => {
            const userId = user.id;

            this.menuService.deleteMenu(menuId, userId).subscribe({
              next: (response: any) => {
                console.log('Response from server:', response);
                const successMessage =
                  response && typeof response === 'string' ? response : 'Menu deleted successfully';
                this.toastService.showSuccess(successMessage, 'Deleted');

                const currentMenusOnPage = this.menus.length;

                this.fetchMenus();

                if (currentMenusOnPage === 1 && this.currentPage > 0) {
                  this.currentPage--;
                  this.fetchMenus();
                } else if (this.currentPage === this.totalPages - 1 && this.menus.length === 0) {
                  this.currentPage--;
                  this.fetchMenus();
                }
              },
              error: (error: HttpErrorResponse) => {
                console.error('Error deleting menu:', error);
                this.toastService.showError(error.error || 'Error deleting menu. Please try again.', 'Error');
              },
            });
          },
          error: (err) => {
            console.error('Error fetching user details:', err);
            this.toastService.showError('Failed to fetch user details. You may not have access.', 'Error');
          },
        });
      }
    });
  }

  updateMenu(menu: any) {
    console.log('Updating menu:', menu);
    this.router.navigate([`/update-menu`, menu.id]);
  }

  createMenu(): void {
    this.router.navigate(['/menu-create']);
  }
}
