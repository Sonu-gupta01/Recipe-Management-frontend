import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RatingService } from '../../../services/rating.service';
import { AuthService } from '../../../services/auth.service'; // Import AuthService

@Component({
  selector: 'app-rating-create',
  templateUrl: './rating-create.component.html',
  styleUrls: ['./rating-create.component.css']
})
export class RatingCreateComponent implements OnInit {
  recipeId!: number; 
  rating: number | null = null; 
  userId: number | null = null; 

  constructor(
    private route: ActivatedRoute,
    private ratingService: RatingService,
    private authService: AuthService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.recipeId = +this.route.snapshot.paramMap.get('id')!;

    // Resolve the logged-in user's ID using the email from localStorage
    const email = localStorage.getItem('email');
    if (email) {
      this.authService.getUserIdByEmail(email).subscribe({
        next: (response) => {
          this.userId = response.id; // Extract the userId from the response
        },
        error: (error) => {
          console.error('Error fetching userId:', error);
          alert('Failed to fetch user information. Please try again.');
          this.router.navigate(['/login']); 
        }
      });
    } else {
      alert('No logged-in user found. Please log in.');
      this.router.navigate(['/login']); 
    }
  }

  submitRating(): void {
    if (!this.userId) {
      alert('User ID could not be resolved. Please log in again.');
      return;
    }

    if (this.rating === null || this.rating < 1 || this.rating > 5) {
      alert('Please enter a valid rating between 1 and 5.');
      return;
    }

    // Prepare the payload for submission
    const payload = {
      recipeId: this.recipeId,
      userId: this.userId,
      rating: this.rating
    };

    // Call the rating service to submit the data
    this.ratingService.createRating(payload).subscribe({
      next: () => {
        alert('Rating submitted successfully!');
        this.router.navigate(['/recipes', this.recipeId]); 
      },
      error: (err) => {
        console.error('Error submitting rating:', err);
        alert('An error occurred while submitting your rating. Please try again.');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/recipes', this.recipeId]);
  }
}
