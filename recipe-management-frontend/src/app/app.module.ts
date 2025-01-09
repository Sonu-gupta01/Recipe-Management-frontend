import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
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
import { MenuCreateComponent } from './components/menu/menu-create/menu-create.component';
import { MenuDeleteComponent } from './components/menu/menu-delete/menu-delete.component';
import { MenuListComponent } from './components/menu/menu-list/menu-list.component';
import { FormsModule } from '@angular/forms';
import { RecipeDetailsComponent } from './components/recipe/recipe-details/recipe-details.component';
import { MenuUpdateComponent } from './components/menu/menu-update/menu-update.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ForgotPasswordComponent } from './components/user-auth/forgot-password/forgot-password.component';
import { RecipeUpdateComponent } from './components/recipe/recipe-update/recipe-update.component';
import { RecipeSearchComponent } from './components/recipe/recipe-search/recipe-search.component';
import { IngredientUpdateComponent } from './components/ingredient/ingredient-update/ingredient-update.component';
import { IngredientDeleteComponent } from './components/ingredient/ingredient-delete/ingredient-delete.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    RecipeListComponent,
    RecipeCreateComponent,
    RecipeDeleteComponent,
    CategoryListComponent,
    RecipeDetailsComponent,
    CategoryCreateComponent,
    IngredientListComponent,
    IngredientCreateComponent,
    RatingListComponent,
    RatingCreateComponent,
    ChatListComponent,
    ChatCreateComponent,
    MenuCreateComponent,
    MenuDeleteComponent,
    MenuListComponent,
    MenuUpdateComponent,
    ForgotPasswordComponent,
    RecipeUpdateComponent,
    RecipeSearchComponent,
    IngredientUpdateComponent,
    IngredientDeleteComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgSelectModule,
    SweetAlert2Module.forRoot(),
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true, 
  },],
  bootstrap: [AppComponent]
})
export class AppModule { }
