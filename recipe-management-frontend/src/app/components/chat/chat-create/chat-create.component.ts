import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from '../../../services/chat.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-chat-create',
  templateUrl: './chat-create.component.html',
  styleUrls: ['./chat-create.component.css'],
})
export class ChatCreateComponent implements OnInit, OnDestroy {
  users: any[] = [];
  selectedUser: any = null;
  messages: any[] = [];
  message: string = '';
  currentUserId: number | null = null;
  pollingInterval: any;
  isAtBottom: boolean = true; 

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

    this.chatService.getUsers().subscribe(
      (data: any[]) => {
        this.users = data;
      },
      (error) => {
        console.error('Error fetching users', error);
      }
    );
    this.startPolling();
  }

  ngOnDestroy(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  }

  // Poll for new messages every 1 seconds
  startPolling(): void {
    this.pollingInterval = setInterval(() => {
      if (this.selectedUser && this.currentUserId) {
        this.chatService.getMessages(this.currentUserId, this.selectedUser.id).subscribe(
          (messages: any[]) => {
            // Check if the user is at the bottom of the chat window
            const wasAtBottom = this.isAtBottom;
            // Add new messages and maintain chronological order
            this.messages = messages.sort(
              (a, b) => new Date(a.sentOn).getTime() - new Date(b.sentOn).getTime()
            );
            // If the user was at the bottom, scroll to the bottom after updating messages
            if (wasAtBottom) {
              this.scrollToBottom();
            }
          },

          (error) => {
            console.error('Error fetching messages', error);
          }
        );
      }
    }, 1000); 
  }

  // Scroll to the bottom of the chat window
  scrollToBottom(): void {
    setTimeout(() => {
      const chatWindow = document.querySelector('.messages');
      if (chatWindow) {
        chatWindow.scrollTop = chatWindow.scrollHeight;
      }
    });
  }

  // Handle the scroll event to check if the user is at the bottom
  onScroll(event: Event): void {
    const chatWindow = event.target as HTMLElement;
    const isAtBottom = chatWindow.scrollHeight - chatWindow.scrollTop === chatWindow.clientHeight;
    this.isAtBottom = isAtBottom;
  }

  // Fetch messages between logged-in user and the selected user
  onUserSelect(userId: number): void {
    this.selectedUser = this.users.find((user) => user.id === userId);
    if (this.selectedUser && this.currentUserId) {
      this.chatService.getMessages(this.currentUserId, this.selectedUser.id).subscribe(
        (messages: any[]) => {
          this.messages = messages.sort(
            (a, b) => new Date(a.sentOn).getTime() - new Date(b.sentOn).getTime()
          );
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
        timestamp: new Date(),
      });

      // Sort messages to maintain chronological order
      this.messages.sort((a, b) => new Date(a.sentOn).getTime() - new Date(b.sentOn).getTime());
      this.message = '';
      this.scrollToBottom();
      this.chatService.sendMessage(messageData).subscribe(
        (response) => {},
        (error) => {
          console.error('Error sending message', error);
        }
      );
    }
  }
}
