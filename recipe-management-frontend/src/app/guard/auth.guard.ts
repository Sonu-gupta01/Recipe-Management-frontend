import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); // Get the authentication service
  const router = inject(Router); // Get the router instance
  const isAuthenticated = authService.isAuthenticated(); // Check if the user is logged in
  const publicRoutes = ['/login', '/register', '/forget-password']; // Public routes

  if (state.url === '/login' && !isAuthenticated) {
    return true; // Allow access to login route if not authenticated
  }

  if (isAuthenticated && publicRoutes.includes(state.url)) {
    // Redirect logged-in users from public pages to the home page
    router.navigate(['/home']);
    return false;
  }

  if (!isAuthenticated && !publicRoutes.includes(state.url)) {
    // Redirect unauthenticated users from protected pages to the login page
    router.navigate(['/login']);
    return false;
  }

  return true; // Allow navigation if none of the conditions are met
};
