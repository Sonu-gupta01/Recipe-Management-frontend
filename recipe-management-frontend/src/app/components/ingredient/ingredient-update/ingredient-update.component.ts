import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IngredientService } from '../../../services/ingredient.service';
import { Ingredient } from '../../../interfaces/ingredient';

@Component({
  selector: 'app-ingredient-update',
  templateUrl: './ingredient-update.component.html',
  styleUrls: ['./ingredient-update.component.css'],
})
export class IngredientUpdateComponent implements OnInit {
  ingredient: Ingredient = {
    id: 0, 
    name: '',
    quantity: 0,
    unit: '',
  };

  constructor(
    private ingredientService: IngredientService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Fetch the ingredient ID from the route and load ingredient details
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.ingredientService.getIngredientById(+id).subscribe(
        (data) => {
          this.ingredient = data;
        },
        (error) => {
          alert('Error fetching ingredient: ' + error.message);
        }
      );
    } else {
      alert('Invalid ingredient ID in route.');
    }
  }

  updateIngredient(): void {
    // Ensure the ID is valid before making the API call
    if (this.ingredient.id !== null && this.ingredient.id !== undefined) {
      this.ingredientService.updateIngredient(this.ingredient.id, this.ingredient).subscribe(
        () => {
          alert('Ingredient updated successfully.');
          this.router.navigate(['/home']);
        },
        (error) => {
          alert('Error updating ingredient: ' + error.message);
        }
      );
    } else {
      alert('Invalid ingredient ID.');
    }
  }
}
