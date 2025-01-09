import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from '../../../services/menu.service';
import { RecipeService } from '../../../services/recipe.service';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { Recipe } from '../../../interfaces/recipe';

@Component({
  selector: 'app-menu-create',
  templateUrl: './menu-create.component.html',
  styleUrls: ['./menu-create.component.css']
})
export class MenuCreateComponent implements OnInit {
  mealTypes: string[] = ['Breakfast', 'Lunch', 'Dinner'];
  menuName: string = '';
  selectedMealType: string = '';
  scheduleDate: string = '';
  scheduleTime: string = '';
  selectedRecipes: Recipe[] = [];
  recipes: Recipe[] = [];
  userId: number | null = null;
  isModalOpen: boolean = false;
  formSubmitted: boolean = false;
  minDate: string = '';
  minTime: string = '';

  constructor(
    private menuService: MenuService,
    private recipeService: RecipeService,
    private authService: AuthService,
    private toastService: ToastService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRecipes();
    this.minDate = new Date().toISOString().split('T')[0]; 
    this.minTime = new Date().toISOString().split('T')[1].slice(0, 5); 

    const email = localStorage.getItem('email');
    if (email) {
      this.authService.getUserIdByEmail(email).subscribe({
        next: (response: any) => {
          this.userId = response.id;
        },
        error: (error) => {
          console.error('Error fetching userId:', error);
          this.toastService.showError('Failed to fetch user information. Please try again.');
        }
      });
    } else {
      this.toastService.showError('No logged-in user found. Please log in.');
      this.router.navigate(['/login']);
    }
  }

  loadRecipes(): void {
    this.recipeService.getRecipes().subscribe({
      next: (response: Recipe[]) => {
        this.recipes = response.map(recipe => ({
          ...recipe,
          selected: recipe.selected ?? false
        }));
      },
      error: (error) => {
        console.error('Error fetching recipes:', error);
        this.toastService.showError('Failed to load recipes. Please try again.');
      }
    });
  }

  onRecipeSelectionChange(recipe: Recipe, event: any): void {
    recipe.selected = event.target.checked ?? false;
  }

  createMenu(): void {
    this.formSubmitted = true;

    if (
      !this.menuName ||
      !this.selectedMealType ||
      !this.scheduleDate ||
      !this.scheduleTime ||
      this.selectedRecipes.length === 0
    ) {
      this.toastService.showError('Please fill in all required fields.');
      return;
    }

    // Validate menuName
    const menuNameRegex = /^[a-zA-Z0-9][a-zA-Z0-9_-]*[a-zA-Z0-9]$/;
    if (!menuNameRegex.test(this.menuName)) {
      this.toastService.showError(
        'Invalid Menu Name. It must start and end with alphanumeric characters and may contain hyphens or underscores.'
      );
      return;
    }

    const scheduledAt = `${this.scheduleDate}T${this.scheduleTime}`;
    const recipeIds = this.selectedRecipes.map(recipe => recipe.id).filter(id => id);

    if (!this.userId) {
      this.toastService.showError('Failed to fetch user information. Please log in.');
      return;
    }

    const menuData = {
      menuName: this.menuName,
      mealType: this.selectedMealType,
      scheduledAt: scheduledAt,
      userId: this.userId,
      recipeIds: recipeIds
    };

    this.menuService.createMenu(menuData).subscribe({
      next: () => {
        this.toastService.showSuccess('Menu created successfully!');
        this.router.navigate(['/menus']);
      },
      error: (error) => {
        console.error('Error creating menu:', error);
        this.toastService.showError('An error occurred while creating the menu. Please try again.');
      }
    });
  }

  openRecipeModal(): void {
    this.isModalOpen = true;
  }

  closeRecipeModal(): void {
    this.isModalOpen = false;
  }

  saveSelectedRecipes(): void {
    this.selectedRecipes = this.recipes.filter(recipe => recipe.selected);
    this.isModalOpen = false;
  }
}
