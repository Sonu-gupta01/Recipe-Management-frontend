import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from '../../../services/chat.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css'],
})
export class ChatListComponent implements OnInit {
  users: any[] = [];  
  selectedUserId: number | null = null;  
  errorMessage: string = '';
  messages: any[] = [];  
  currentUserId: number | null = null; 

  constructor(private chatService: ChatService, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Fetch the current user ID
    const email = localStorage.getItem('email');
    if (email) {
      this.authService.getUserIdByEmail(email).subscribe({
        next: (response) => {
          this.currentUserId = response.id; 
        },
        error: (err) => {
          console.error('Error fetching current user ID:', err);
        },
      });
    }

    // Fetch the users
    this.chatService.getUsers().subscribe(
      (users) => {
        this.users = users;
        this.errorMessage = '';
      },
      (error) => {
        console.error('Error fetching users:', error);
        this.errorMessage = 'Failed to load users. Please try again later.';
      }
    );
  }
  // When a user is selected, fetch messages and navigate to chat window
  onUserSelect(userId: number): void {
    this.selectedUserId = userId;
    if (this.currentUserId) {
      this.router.navigate(['/chat-create'], { queryParams: { userId: userId } });

      this.chatService.getMessages(this.currentUserId, userId).subscribe(
        (messages) => {
          this.messages = messages; 
        },
        (error) => {
          console.error('Error fetching messages:', error);
          this.errorMessage = 'Failed to load messages. Please try again later.';
        }
      );
    }
  }
}
