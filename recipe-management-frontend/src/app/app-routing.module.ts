import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/user-auth/login/login.component';
import { RegisterComponent } from './components/user-auth/register/register.component';
import { RecipeListComponent } from './components/recipe/recipe-list/recipe-list.component';
import { RecipeCreateComponent } from './components/recipe/recipe-create/recipe-create.component';
import { RecipeDeleteComponent } from './components/recipe/recipe-delete/recipe-delete.component';
import { CategoryListComponent } from './components/category/category-list/category-list.component';
import { CategoryCreateComponent } from './components/category/category-create/category-create.component';
import { IngredientListComponent } from './components/ingredient/ingredient-list/ingredient-list.component';
import { IngredientCreateComponent } from './components/ingredient/ingredient-create/ingredient-create.component';
import { RatingListComponent } from './components/rating/rating-list/rating-list.component';
import { RatingCreateComponent } from './components/rating/rating-create/rating-create.component';
import { ChatListComponent } from './components/chat/chat-list/chat-list.component';
import { ChatCreateComponent } from './components/chat/chat-create/chat-create.component';
import { MenuListComponent } from './components/menu/menu-list/menu-list.component';
import { MenuCreateComponent } from './components/menu/menu-create/menu-create.component';
import { RecipeDetailsComponent } from './components/recipe/recipe-details/recipe-details.component';
import {MenuDeleteComponent} from './components/menu/menu-delete/menu-delete.component';
import { ForgotPasswordComponent } from './components/user-auth/forgot-password/forgot-password.component';
import { RecipeUpdateComponent } from './components/recipe/recipe-update/recipe-update.component';
import { MenuUpdateComponent } from './components/menu/menu-update/menu-update.component';
import { RecipeSearchComponent } from './components/recipe/recipe-search/recipe-search.component';
import { IngredientUpdateComponent } from './components/ingredient/ingredient-update/ingredient-update.component';
import { IngredientDeleteComponent } from './components/ingredient/ingredient-delete/ingredient-delete.component';
import { authGuard } from './guard/auth.guard';


const routes: Routes = [

  { path: 'login', component: LoginComponent, canActivate: [authGuard]},
  { path: 'register', component: RegisterComponent, canActivate: [authGuard] },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [authGuard] },
  { path: 'chat', component: ChatListComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  { path: 'recipes', component: RecipeListComponent, canActivate: [authGuard] },
  { path: 'recipe-create', component: RecipeCreateComponent, canActivate: [authGuard] },
  { path: 'delete-recipe/:id', component: RecipeDeleteComponent, canActivate: [authGuard] },
  { path: 'recipes/:id', component: RecipeDetailsComponent, canActivate: [authGuard] },
  { path: 'update-recipe/:id', component: RecipeUpdateComponent, canActivate: [authGuard] },
  { path: 'recipes/search', component: RecipeSearchComponent, canActivate: [authGuard] },
  
  { path: 'categories', component: CategoryListComponent, canActivate: [authGuard] },
  { path: 'category-create', component: CategoryCreateComponent, canActivate: [authGuard] },

  { path: 'menu-create', component: MenuCreateComponent, canActivate: [authGuard] },
  { path: 'menu-list', component: MenuListComponent, canActivate: [authGuard] },
  { path: 'menu-delete', component: MenuDeleteComponent, canActivate: [authGuard] },
  { path: 'menus', component: MenuListComponent, canActivate: [authGuard] },
  {path: 'update-menu/:id', component:MenuUpdateComponent, canActivate: [authGuard]},

  { path: 'ingredients', component: IngredientListComponent, canActivate: [authGuard] },
  { path: 'ingredient-create', component: IngredientCreateComponent, canActivate: [authGuard] },
  { path: 'ingredient-update/:id', component: IngredientUpdateComponent, canActivate: [authGuard] },
  { path: 'ingredient-delete', component: IngredientDeleteComponent, canActivate: [authGuard] },

  { path: 'ratings', component: RatingListComponent, canActivate: [authGuard] },
  { path: 'rate/:id', component: RatingCreateComponent, canActivate: [authGuard] },

  { path: 'chats', component: ChatListComponent, canActivate: [authGuard] },
  { path: 'chat-create', component: ChatCreateComponent, canActivate: [authGuard] },

  { path: '**', redirectTo: '/login', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)], 
  exports: [RouterModule]  
})
export class AppRoutingModule {}

