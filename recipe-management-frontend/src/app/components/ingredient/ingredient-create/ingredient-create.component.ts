import { Component } from '@angular/core';
import { IngredientService } from '../../../services/ingredient.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../services/toast.service'; 

@Component({
  selector: 'app-ingredient-create',
  templateUrl: './ingredient-create.component.html',
  styleUrls: ['./ingredient-create.component.css'],
})
export class IngredientCreateComponent {
  ingredient = {
    name: '',
    quantity: null,
    unit: '',
  };

  constructor(
    private ingredientService: IngredientService,
    private router: Router,
    private toastService: ToastService 
  ) {}

  createIngredient() {
    // Ensure that all fields are not null or undefined
    if (
      this.ingredient.name?.trim() &&
      this.ingredient.quantity != null &&
      this.ingredient.quantity > 0 &&
      this.ingredient.unit?.trim()
    ) {
      this.ingredientService.createIngredient(this.ingredient).subscribe({
        next: () => {
          this.toastService.showSuccess('Ingredient created successfully.'); 
          this.router.navigate(['/home']);
        },
        error: (error) => {
          this.toastService.showError('Error creating ingredient: ' + error.message); 
        },
      });
    } else {
      this.toastService.showWarning('Please fill all fields with valid data.'); 
    }
  }
}
