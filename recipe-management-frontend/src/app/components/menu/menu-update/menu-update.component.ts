import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuService } from '../../../services/menu.service';
import { RecipeService } from '../../../services/recipe.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-menu-update',
  templateUrl: './menu-update.component.html',
  styleUrls: ['./menu-update.component.css']
})
export class MenuUpdateComponent implements OnInit {
  menuId!: number;
  originalMenu: any = {};
  menu: any = {
    menuName: '',
    mealType: '',
    scheduledDate: '',
    scheduledTime: '',
    recipeIds: []
  };
  recipes: any[] = [];
  showRecipeModal = false;

  isPastDate = false;
  isPastTime = false;
  minDate: string = '';

  constructor(
    private route: ActivatedRoute,
    private menuService: MenuService,
    private recipeService: RecipeService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit() {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

    this.menuId = +this.route.snapshot.paramMap.get('id')!;
    this.menuService.getMenuById(this.menuId).subscribe((menu) => {
      const [date, time] = menu.scheduledAt.split('T');
      this.menu = { ...menu, scheduledDate: date, scheduledTime: time };
      this.originalMenu = { ...this.menu }; 
    });

    this.recipeService.getRecipes().subscribe((recipes) => {
      this.recipes = recipes;
    });
  }

  validateDateAndTime(): void {
    const now = new Date();
    const selectedDate = new Date(this.menu.scheduledDate);

    // Check if the selected date is in the past.
    this.isPastDate = selectedDate < now;

    if (!this.isPastDate) {
      const [hours, minutes] = this.menu.scheduledTime.split(':').map(Number);

      // Check if the selected time is in the past on the current day.
      this.isPastTime =
        selectedDate.toDateString() === now.toDateString() &&
        (hours < now.getHours() || (hours === now.getHours() && minutes < now.getMinutes()));
    }
  }

  checkForChangesAndUpdate(menuForm: any): void {
    this.validateDateAndTime();

    if (JSON.stringify(this.menu) === JSON.stringify(this.originalMenu)) {
      this.toastService.showInfo('You haven’t updated any field.', 'No Changes');
      return;
    }
    if (menuForm.valid && !this.isPastDate && !this.isPastTime) {
      this.saveUpdatedMenu();
    } else {
      if (this.isPastDate) this.toastService.showError('Please select an upcoming date.', 'Invalid Date');
      if (this.isPastTime) this.toastService.showError('Please choose an upcoming time.', 'Invalid Time');
    }
  }

  saveUpdatedMenu(): void {
    this.menuService.updateMenu(this.menuId, this.menu).subscribe(
      () => {
        this.toastService.showSuccess('Menu updated successfully.', 'Success');
        this.router.navigate(['/menus']);
      },
      () => {
        this.toastService.showError('Failed to update menu. A menu with the same recipes already exists.', 'Error');
      }
    );
  }

  cancelUpdate(): void {
    this.router.navigate(['/menus']);
  }

  openRecipeSelection(): void {
    this.showRecipeModal = true;
  }

  closeRecipeSelection(): void {
    this.showRecipeModal = false;
  }

  toggleRecipeSelection(recipeId: number): void {
    const index = this.menu.recipeIds.indexOf(recipeId);
    index > -1 ? this.menu.recipeIds.splice(index, 1) : this.menu.recipeIds.push(recipeId);
  }

  getRecipeTitle(recipeId: number): string {
    const recipe = this.recipes.find((r) => r.id === recipeId);
    return recipe ? recipe.title : '';
  }
}
