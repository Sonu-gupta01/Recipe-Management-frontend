import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isAuthenticated = this.authService.isAuthenticated();
    const currentUrl = this.router.url;

    if (!isAuthenticated && currentUrl !== '/login' && currentUrl !== '/register') {
      this.router.navigate(['/login']);
    } else if (isAuthenticated && currentUrl === '/login') {
      this.router.navigate(['/home']);
    }

    return next.handle(req); 
  }
}
