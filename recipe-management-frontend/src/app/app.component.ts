import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const isAuthenticated = this.authService.isAuthenticated();
    const currentUrl = this.router.url;

    if (!isAuthenticated && currentUrl !== '/login' && currentUrl !== '/register') {
      this.router.navigate(['/login']);
    } else if (isAuthenticated && currentUrl === '/login') {
      this.router.navigate(['/home']);
    }
  }
}
