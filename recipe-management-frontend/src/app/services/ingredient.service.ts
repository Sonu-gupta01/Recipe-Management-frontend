import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class IngredientService {
  private baseUrl = `${environment.apiBaseUrl}/api/ingredients`; 

  constructor(private http: HttpClient) {}

  getIngredients(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  createIngredient(ingredient: any): Observable<string> {
    return this.http.post(this.baseUrl, ingredient, { responseType: 'text' });
  }
  
  
  updateIngredient(id: number, ingredient: any): Observable<string> {
    return this.http.put(`${this.baseUrl}/${id}`, ingredient,  { responseType: 'text' });
  }
  
  deleteIngredient(id: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

  getIngredientById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }
}
