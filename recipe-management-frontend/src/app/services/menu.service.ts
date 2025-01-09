
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private baseUrl = `${environment.apiBaseUrl}/api/menus`;

  constructor(private http: HttpClient) {}

  getMenusWithPagination(page: number, size: number): Observable<any> {
    return this.http.get(`${this.baseUrl}?page=${page}&size=${size}`);
  }

  deleteMenu(menuId: string, userId: number): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/${menuId}`, {
      headers: {
        'Content-Type': 'application/json',
        'userId': userId.toString(), 
      },
      responseType: 'text' as 'json',
    });
  }
  
  createMenu(menuData: any): Observable<string> { 
    return this.http.post(`${this.baseUrl}`, menuData, { responseType: 'text' }); 
  }

  getMenuById(menuId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${menuId}`);
  }
  
  updateMenu(menuId: number, menuData: any): Observable<string> {
    return this.http.put(`${this.baseUrl}/${menuId}`, menuData, { responseType: 'text' }); 
  }

  getMenusForUser(userId: number, page: number, size: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/usermenu?page=${page}&size=${size}&userId=${userId}`);
  }
  
}
