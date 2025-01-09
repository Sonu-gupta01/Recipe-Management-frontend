export interface Recipe {
  id?: number;
  title: string;              
  description: string;
  imagePath: string;
  ingredients: string[];      
  rating?: number;
  recipeKind: string;         
  prepTimeMinutes: number | string;     
  selected?: boolean;
  
}


