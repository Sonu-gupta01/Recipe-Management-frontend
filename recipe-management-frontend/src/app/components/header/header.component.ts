
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service'; // Adjust the import path as needed
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  email: string = '';
  searchQuery: string = ''; // Search query bound to the search bar

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Subscribe to the authentication status from AuthService
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isLoggedIn = isAuthenticated;
      if (this.isLoggedIn) {
        this.email = localStorage.getItem('email') || 'User';  // Retrieve username from localStorage
      }
    });
  }

  logout(): void {
    this.authService.logout();  // Call the logout method from the AuthService
    localStorage.removeItem('email'); // Clear username from localStorage
    this.router.navigate(['/login']); // Redirect to the login page
  }

  onCategorySelect(category: string): void {
    // Navigate with the selected category as a query parameter
    this.router.navigate(['/recipes'], { queryParams: { category } });
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/recipes/search'], { queryParams: { query: this.searchQuery.trim() } });
    }
  }
}

