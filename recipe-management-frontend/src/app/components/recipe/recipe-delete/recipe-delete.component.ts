import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../../../services/recipe.service';
import { AuthService } from '../../../services/auth.service';
import { Recipe } from '../../../interfaces/recipe';
import { ToastService } from '../../../services/toast.service'; 
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recipe-delete',
  templateUrl: './recipe-delete.component.html',
  styleUrls: ['./recipe-delete.component.css'],
})
export class RecipeDeleteComponent implements OnInit {
  recipeId!: number;
  recipe?: Recipe;

  // Store user details
  userId: number | null = null;
  userRole: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private authService: AuthService,
    public router: Router,
    private toastService: ToastService // Inject the ToastService
  ) {}

  ngOnInit(): void {
    // Get the recipe ID from the route parameters
    this.recipeId = +this.route.snapshot.paramMap.get('id')!;
    this.fetchRecipe();

    // Fetch user details from the backend
    const email = localStorage.getItem('email');
    if (email) {
      this.authService.getUserIdByEmail(email).subscribe({
        next: (user) => {
          this.userId = user.id;
          //this.userRole = user.role;
        },
        error: (err) => {
          console.error('Error fetching user details:', err);
          this.toastService.showError('Failed to fetch user details. You may not have access.', 'Error');
        },
      });
    }
  }

  // Fetch recipe details
  fetchRecipe(): void {
    this.recipeService.getRecipeById(this.recipeId).subscribe({
      next: (data) => {
        this.recipe = data;
      },
      error: (error) => {
        console.error('Error fetching recipe:', error);
        this.toastService.showError('Could not fetch recipe details.', 'Error');
        this.router.navigate(['/recipes']);
      },
    });
  }

  confirmDelete(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to recover this recipe!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteRecipe();
      }
    });
  }

  deleteRecipe(): void {
    const email = localStorage.getItem('email'); // Retrieve email from localStorage
    if (!email) {
      this.toastService.showError('User email is missing. You do not have access to delete this recipe.', 'Error');
      return;
    }

    // Fetch userId using email
    this.authService.getUserIdByEmail(email).subscribe({
      next: (user) => {
        const userId = user.id; 

        // Call delete API
        this.recipeService.deleteRecipe(this.recipeId, userId).subscribe({
          next: () => {
            this.toastService.showSuccess('Recipe deleted successfully.', 'Deleted');
            this.router.navigate(['/recipes']);
          },
          error: (error) => {
            console.error('Error deleting recipe:', error);
            this.toastService.showError(
              error.error || 'Failed to delete the recipe. Please try again.',
              'Error'
            );
          },
        });
      },
      error: (err) => {
        console.error('Error fetching user details:', err);
        this.toastService.showError('Failed to fetch user details. You may not have access.', 'Error');
      },
    });
  }
}
