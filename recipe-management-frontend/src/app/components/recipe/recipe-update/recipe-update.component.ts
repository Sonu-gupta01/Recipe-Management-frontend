import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../../../services/recipe.service';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service'; 
import {environment} from '../../../../environments/environment'

@Component({
  selector: 'app-recipe-update',
  templateUrl: './recipe-update.component.html',
  styleUrls: ['./recipe-update.component.css'],
})
export class RecipeUpdateComponent implements OnInit {
  recipe: any = {
    title: '',
    description: '',
    prepTimeMinute: 0,
    imagePath: '',
    recipeKind: '',
  };
  originalRecipe: any = {};
  uploadingImage: boolean = false;
  uploadError: string = '';

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService 
  ) {}

  ngOnInit(): void {
    const recipeId = +this.route.snapshot.paramMap.get('id')!;
    this.loadRecipe(recipeId);
  }

  loadRecipe(id: number): void {
    this.recipeService.getRecipeById(id).subscribe({
      next: (data) => {
        this.recipe = data;
        this.originalRecipe = { ...data }; // Save a copy of the original data for comparison
      },
      error: (error) => {
        console.error('Error fetching recipe:', error);
        this.toastService.showError('Could not fetch recipe details.', 'Error');
        this.router.navigate(['/recipes']);
      },
    });
  }

  uploadImage(event: any): void {
    this.uploadingImage = true;
    this.uploadError = '';

    const file = event.target.files[0];
    if (!file) {
      this.uploadingImage = false;
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('key', environment.apiKey);

    fetch(environment.uploadUrl, {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.data && data.data.url) {
          this.recipe.imagePath = data.data.url;
          this.toastService.showSuccess('Image uploaded successfully!', 'Success');
        } else {
          this.uploadError = 'Failed to upload image. Please try again.';
          this.toastService.showError(this.uploadError, 'Error');
        }
      })
      .catch((error) => {
        console.error('Error uploading image:', error);
        this.uploadError = 'Failed to upload image. Please try again.';
        this.toastService.showError(this.uploadError, 'Error');
      })
      .finally(() => {
        this.uploadingImage = false;
      });
  }

  updateRecipe(recipeForm: any): void {
    console.log(recipeForm)
    if (recipeForm.invalid) return;

    // Check if fields are updated
    if (JSON.stringify(this.recipe) === JSON.stringify(this.originalRecipe)) {
      this.toastService.showInfo("You haven't changed any fields.", 'Info');
      return;
    }

    const email = localStorage.getItem('email');
    if (!email) {
      this.toastService.showError('User email is missing. You do not have access to modify this recipe.', 'Error');
      this.router.navigate(['/recipes']);
      return;
    }

    this.authService.getUserIdByEmail(email).subscribe({
      next: (user) => {
        const userId = user.id;

        this.recipeService.updateRecipe(this.recipe.id, this.recipe, userId).subscribe({
          next: () => {
            this.toastService.showSuccess('Recipe updated successfully!', 'Success');
            this.router.navigate(['/recipes']);
          },
          error: (error) => {
            console.error('Error updating recipe:', error);

            // Check for specific error status
            if (error.status === 403) {
              this.toastService.showError('You do not have permission to update this recipe.', 'Forbidden');
            } else {
              this.toastService.showError('Failed to update recipe.', 'Error');
            }
          },
        });
      },
      error: (err) => {
        console.error('Error fetching user ID:', err);
        this.toastService.showError('Failed to fetch user details.', 'Error');
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/recipes']);
  }
}
