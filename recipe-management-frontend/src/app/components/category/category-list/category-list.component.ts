import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../../services/recipe.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  recipes: any[] = [];
  selectedCategory: string = '';  // Declare selectedCategory

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.loadRecipes();  // Load recipes on initialization
  }

  loadRecipes(): void {
    const category = this.selectedCategory;
    if (category) {
      this.recipeService.getRecipesByCategory(category).subscribe(
        (data: any[]) => {
          this.recipes = data;  // Set the recipes based on category
        },
        (error: any) => { 
          console.error('Error fetching recipes by category', error);
        }
      );
    } else {
      this.recipeService.getRecipes().subscribe( 
        (data: any[]) => {
          this.recipes = data;  // Load all recipes if no category is selected
        },
        (error: any) => { 
          console.error('Error fetching all recipes', error);
        }
      );
    }
  }

  // Handle category change
  onCategoryChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedCategory = target.value;  
    this.loadRecipes();  // Reload recipes based on the new category
  }
}
