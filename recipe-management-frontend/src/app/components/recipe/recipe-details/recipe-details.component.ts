import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../../../services/recipe.service';
import { AuthService } from '../../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../../services/toast.service'; 

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.css'],
})
export class RecipeDetailsComponent implements OnInit {
  recipe: any;
  currentUserId: number | null = null;
  selectedRating: number = 0; 
  averageRating: number = 0; 
  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService 
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.loadRecipe(id);
    this.fetchCurrentUserId();
    this.fetchAverageRating(id);
  }

  // Fetch the average rating for the recipe
  fetchAverageRating(recipeId: number): void {
    this.recipeService.getAverageRating(recipeId).subscribe({
      next: (rating) => {
        this.averageRating = rating;
      },
      error: (err) => {
        console.error('Error fetching average rating:', err);
        this.toastService.showError('Failed to fetch average rating.', 'Error');
        this.averageRating = 0; 
      },
    });
  }

  // Load the recipe details
  loadRecipe(id: number): void {
    this.recipeService.getRecipeById(id).subscribe({
      next: (data) => {
        this.recipe = data;
      },
      error: (error) => {
        console.error('Error fetching recipe details:', error);
        this.toastService.showError('Failed to load recipe details.', 'Error');
        this.router.navigate(['/recipes']);
      },
    });
  }

  // Fetch the current user ID from the backend
  fetchCurrentUserId(): void {
    const email = localStorage.getItem('email');
    if (email) {
      this.authService.getUserIdByEmail(email).subscribe({
        next: (user) => {
          this.currentUserId = user.id;
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error fetching current user ID:', err);
          this.toastService.showError('Failed to fetch user information.', 'Error');
        },
      });
    }
  }

  // Handle the rating submission
  rateRecipe(): void {
    console.log('Rating:', this.selectedRating);
    this.submitRating();
  }

  // Submit the user's rating for the recipe
  submitRating(): void {
    if (this.currentUserId === null) {
      console.error('User ID is null');
      this.toastService.showError('User information is missing.', 'Error');
      return; // Stop if userId is null
    }

    const payload = {
      recipeId: this.recipe.id,
      userId: this.currentUserId,
      rating: this.selectedRating,
    };

    this.recipeService.submitRating(payload).subscribe({
      next: () => {
        this.toastService.showSuccess('Rating submitted successfully!', 'Success');
        this.router.navigate(['/recipes', this.recipe.id]);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error submitting rating:', err);
        this.toastService.showError('Failed to submit rating. Please try again.', 'Error');
      },
    });
  }

  updateRecipe(): void {
    const recipeId = this.recipe.id;
    this.router.navigate(['/update-recipe', recipeId]);
  }

  deleteRecipe(): void {
    const recipeId = this.recipe.id;
    this.router.navigate(['/delete-recipe', recipeId]);
  }
}
