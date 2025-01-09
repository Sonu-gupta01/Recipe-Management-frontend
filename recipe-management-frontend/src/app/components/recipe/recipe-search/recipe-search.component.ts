import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '../../../services/recipe.service';
import { Recipe } from '../../../interfaces/recipe';

@Component({
  selector: 'app-recipe-search',
  templateUrl: './recipe-search.component.html',
  styleUrls: ['./recipe-search.component.css']
})
export class RecipeSearchComponent implements OnInit {
  query: string = '';
  results: Recipe[] = [];
  errorMessage: string = '';

  constructor(private route: ActivatedRoute, private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.query = params['query']?.trim();
      if (this.query) {
        this.fetchRecipes();
      } else {
        this.errorMessage = 'Search query is invalid or empty.';
      }
    });
  }

  private fetchRecipes(): void {
    this.recipeService.searchRecipes(this.query).subscribe({
      next: (recipes) => {
        this.results = recipes.filter((recipe) => recipe.id); 
        if (this.results.length === 0) {
          this.errorMessage = `No recipes found for "${this.query}".`;
        }
      },
      error: (err) => {
        console.error('Error fetching search results:', err);
        this.errorMessage = 'An error occurred while fetching search results.';
      }
    });
  }
}




