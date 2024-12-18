import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../../services/recipe.service';
import { IngredientService } from '../../../services/ingredient.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../services/toast.service';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-recipe-create',
  templateUrl: './recipe-create.component.html',
  styleUrls: ['./recipe-create.component.css']
})
export class RecipeCreateComponent implements OnInit {
  recipe: any = {
    title: '',
    description: '',
    prepTimeMinute: 0.0,
    imagePath: '', 
    recipeKind: '',
    ingredients: [],
    createdBy: null
  };

  availableIngredients: any[] = [];
  dropdownOpen: boolean = false;
  uploadingImage: boolean = false; 
  uploadError: string = ''; 
  popupOpen: boolean = false;

  constructor(
    private recipeService: RecipeService,
    private ingredientService: IngredientService,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService 
  ) {}

  ngOnInit(): void {
    this.loadIngredients();
    this.setCreatedBy();
  }

  // Load available ingredients
  loadIngredients(): void {
    this.ingredientService.getIngredients().subscribe({
      next: (data) => {
        this.availableIngredients = data;
      },
      error: (error) => {
        console.error('Error loading ingredients:', error);
        this.toastService.showError('Failed to load ingredients.', 'Error'); 
      }
    });
  }

  setCreatedBy(): void {
    const email = localStorage.getItem('email');
    if (email) {
      this.authService.getUserIdByEmail(email).subscribe({
        next: (response: any) => {
          this.recipe.createdBy = response.id;
        },
        error: (error) => {
          console.error('Error fetching user ID:', error);
          this.toastService.showError(
            'Failed to fetch user information. Please log out and log back in.',
            'Error'
          ); 
          this.router.navigate(['/login']);
        }
      });
    } else {
      this.toastService.showError('No logged-in user found. Please log in.', 'Error');
      this.router.navigate(['/login']);
    }
  }

  openIngredientsPopup(): void {
    this.popupOpen = true;
  }

  closeIngredientsPopup(): void {
    this.popupOpen = false;
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  // Toggle ingredient selection
  toggleIngredientSelection(ingredientId: number): void {
    const index = this.recipe.ingredients.findIndex((ing: any) => ing.id === ingredientId);
    if (index === -1) {
      const ingredient = this.availableIngredients.find((ing) => ing.id === ingredientId);
      if (ingredient) {
        this.recipe.ingredients.push(ingredient);
      }
    } else {
      this.recipe.ingredients.splice(index, 1);
    }
  }

  isIngredientSelected(ingredientId: number): boolean {
    return this.recipe.ingredients.some((ingredient: any) => ingredient.id === ingredientId);
  }

  // Save selected ingredients and close the popup
  saveSelectedIngredients(): void {
    this.closeIngredientsPopup();
  }

  // Remove an ingredient from the selection
  removeIngredient(ingredientId: number): void {
    this.recipe.ingredients = this.recipe.ingredients.filter((ingredient: any) => ingredient.id !== ingredientId);
  }
  // Upload an image to a cloud storage service and get the URL
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
      body: formData
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.data && data.data.url) {
          this.recipe.imagePath = data.data.url;
          this.toastService.showSuccess('Image uploaded successfully.', 'Upload Successful'); 
        } else {
          this.uploadError = 'Failed to upload image. Please try again.';
          this.toastService.showError(this.uploadError, 'Upload Failed'); 
        }
      })
      .catch((error) => {
        console.error('Error uploading image:', error);
        this.uploadError = 'Failed to upload image. Please try again.';
        this.toastService.showError(this.uploadError, 'Upload Failed'); 
      })
      .finally(() => {
        this.uploadingImage = false;
      });
  }

  saveRecipe(): void {
    if (!this.recipe.createdBy) {
      this.toastService.showError('User ID is missing. Please try again.', 'Error'); 
      return;
    }

    this.recipeService.createRecipe(this.recipe).subscribe({
      next: (response) => {
        this.toastService.showSuccess(response.message, 'Recipe Created'); 
        this.router.navigate(['/recipes']);
      },
      error: (error) => {
        console.error('Error creating recipe:', error);
        this.toastService.showError('Failed to create the recipe.', 'Error'); 
      }
    });
  }
}
