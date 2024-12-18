import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../../../services/recipe.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  recipes: any[] = [];
  selectedCategory: string = '';

  constructor(private recipeService: RecipeService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.selectedCategory = params['category'] || ''; 
      this.loadRecipes(); 
    });
  }

  loadRecipes(): void {
    if (this.selectedCategory) {
      this.recipeService.getRecipesByCategory(this.selectedCategory).subscribe(
        (data: any[]) => {
          this.recipes = data;
        },
        (error) => {
          console.error('Error fetching recipes by category', error);
        }
      );
    } else {
      this.recipeService.getRecipes().subscribe(
        (data: any[]) => {
          this.recipes = data;
        },
        (error) => {
          console.error('Error fetching all recipes', error);
        }
      );
    }
  }
  createRecipe(): void {
    this.router.navigate(['/recipe-create']);
  }
}

