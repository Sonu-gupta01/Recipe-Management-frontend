import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  private apiUrl = `${environment.apiBaseUrl}api/ratings`

  constructor(private http: HttpClient) {}

  createRating(rating: { recipeId: number; userId: number; rating: number }): Observable<any> {
    return this.http.post(this.apiUrl, rating, { responseType: 'text' as 'json' });
  }
}
