
import { Component } from '@angular/core';
import { IngredientService } from '../../../services/ingredient.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ingredient-delete',
  templateUrl: './ingredient-delete.component.html',
  styleUrls: ['./ingredient-delete.component.css'],
})
export class IngredientDeleteComponent {
  ingredientId: number | null = null;

  constructor(
    private ingredientService: IngredientService,
    private router: Router
  ) {}

  deleteIngredient() {
    if (this.ingredientId) {
      this.ingredientService.deleteIngredient(this.ingredientId).subscribe(
        () => {
          alert('Ingredient deleted successfully.');
          this.router.navigate(['/home']); 
        },
        (error) => alert('Error deleting ingredient: ' + error.message)
      );
    }
  }

  cancelDeletion() {
    this.router.navigate(['/home']);
  }
}
