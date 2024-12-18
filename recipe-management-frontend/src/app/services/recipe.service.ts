import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recipe } from '../interfaces/recipe';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private baseUrl = `${environment.apiBaseUrl}/api/recipes`;
  private ratingUrl = `${environment.apiBaseUrl}/api/ratings`;

  constructor(private http: HttpClient) { }


  createRecipe(recipe: any): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/create`, recipe);
  }
  

  getRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.baseUrl}`);
  }

  getRecipeById(id: number): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.baseUrl}/${id}`);
  }

  updateRecipe(id: number, recipe: any, userId: number): Observable<string> {
    return this.http.put(`${this.baseUrl}/${id}`, recipe, {
      headers: {
        'Content-Type': 'application/json',
        'userId': userId.toString(),
      },
      responseType: 'text', 
    });
  }

  deleteRecipe(id: number, userId: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'userId': userId.toString(),
      },
      responseType: 'text',
    });
  }
  
  getRecipesByCategory(category: string): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.baseUrl}/searchByKind?recipeKind=${category}`);
  }

  searchRecipes(query: string): Observable<Recipe[]> {
    const encodedQuery = encodeURIComponent(query); 
    return this.http.get<Recipe[]>(`${this.baseUrl}/search?query=${encodedQuery}`);
  }

  submitRating(payload: { recipeId: number; userId: number; rating: number }): Observable<string> {
    return this.http.post<string>(`${this.ratingUrl}`, payload, { responseType: 'text' as 'json' });
  }
  
  getAverageRating(recipeId: number): Observable<number> {
    return this.http.get<number>(`${this.ratingUrl}/average/${recipeId}`);
  }
  
}
