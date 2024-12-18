import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  email: string = '';

  // Subscribe method to handle form submission (optional)
  subscribe(): void {
    if (this.email) {
      console.log('Subscribed with email: ', this.email);
      // Implement the logic to handle email subscription here
      this.email = '';  // Clear the email input field after submission
    } else {
      console.log('Please enter a valid email');
    }
  }
}

