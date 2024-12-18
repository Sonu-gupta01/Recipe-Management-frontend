import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../../services/chat.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-chat-create',
  templateUrl: './chat-create.component.html',
  styleUrls: ['./chat-create.component.css'],
})
export class ChatCreateComponent implements OnInit {
  users: any[] = [];
  selectedUser: any = null;
  messages: any[] = [];
  message: string = '';
  currentUserId: number | null = null; 

  constructor(private chatService: ChatService, private authService: AuthService) {}

  ngOnInit(): void {
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
      (data: any[]) => {
        this.users = data;
      },
      (error) => {
        console.error('Error fetching users', error);
      }
    );
  }

  // Fetch messages between logged-in user and the selected user
  onUserSelect(userId: number): void {
    this.selectedUser = this.users.find((user) => user.id === userId);
    if (this.selectedUser && this.currentUserId) {
      this.chatService.getMessages(this.currentUserId, this.selectedUser.id).subscribe(
        (messages: any[]) => {
          // Sort messages by `sentOn` to ensure chronological order
          this.messages = messages.sort((a, b) => new Date(a.sentOn).getTime() - new Date(b.sentOn).getTime());
          this.scrollToBottom();
        },
        (error) => {
          console.error('Error fetching messages', error);
        }
      );
    }
  }

  sendMessage(): void {
    if (this.message.trim() && this.selectedUser && this.currentUserId) {
      const messageData = {
        senderId: this.currentUserId,
        receiverId: this.selectedUser.id,
        messageText: this.message,
        sentOn: new Date(),
      };
      
      this.messages.push({
        ...messageData,
        timestamp: new Date() 
      });
  
      // Sort messages to maintain chronological order
      this.messages.sort((a, b) => new Date(a.sentOn).getTime() - new Date(b.sentOn).getTime());
  
      this.message = '';
  
      // Scroll to the bottom to show the latest message
      this.scrollToBottom();
  
      this.chatService.sendMessage(messageData).subscribe(
        (response) => {
        },
        (error) => {
          console.error('Error sending message', error);
        }
      );
    }
  }
  
  scrollToBottom(): void {
    setTimeout(() => {
      const chatWindow = document.querySelector('.messages');
      if (chatWindow) {
        chatWindow.scrollTop = chatWindow.scrollHeight;
      }
    });
  }
}