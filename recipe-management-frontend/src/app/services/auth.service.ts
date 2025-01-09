
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiBaseUrl}/api/users`; 
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.checkAuthentication());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(user: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, user);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('email');
  }

  private checkAuthentication(): boolean {
    return this.isAuthenticated();
  }

  setAuthenticationStatus(isAuthenticated: boolean): void {
    this.isAuthenticatedSubject.next(isAuthenticated);
  }

  getCurrentUserId(): number | null {
    const user = JSON.parse(localStorage.getItem('user') || '{}'); 
    return user?.id ?? null; 
  }

  register(user: { username: string; password: string; email: string; role: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}`, user);  
  }

  updatePassword(payload: { email: string; newPassword: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, payload);  
  }
  
  getUserIdByEmail(email: string): Observable<{ id: number }> {
    return this.http.get<{ id: number }>(`${this.apiUrl}/findByEmail?email=${email}`);
  }
  
  
  logout(): void {
    localStorage.removeItem('email');
    localStorage.removeItem('user'); 
    this.setAuthenticationStatus(false);
  }
}
