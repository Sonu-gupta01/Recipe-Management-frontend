
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = `${environment.apiBaseUrl}`;  

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/users`);  
  }
  
  getMessages(userId1: number, userId2: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/messages/${userId1}/${userId2}`);
  }

  sendMessage(messageData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/messages`, messageData);  
  }
  
}


