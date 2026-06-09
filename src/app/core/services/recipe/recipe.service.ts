import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { mapRawMealToMeal, Meal, MealAPIResponse } from '../../../interfaces/recipe.interface';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private http = inject(HttpClient);
  private readonly API_URL = 'https://www.themealdb.com/api/json/v1/1';

  searchRecipes(query: string = ''): Observable<Meal[]> {
    return this.http.get<MealAPIResponse>(`${this.API_URL}/search.php?s=${query}`).pipe(
      map((response) => {
        if (!response.meals) return [];
        return response.meals.map((rawMeal) => mapRawMealToMeal(rawMeal));
      }),
    );
  }

  // Obtener una receta por ID
  getRecipeById(id: string): Observable<Meal | null> {
    return this.http.get<MealAPIResponse>(`${this.API_URL}/lookup.php?i=${id}`).pipe(
      map((response) => {
        if (!response.meals || response.meals.length === 0) return null;
        return mapRawMealToMeal(response.meals[0]);
      })
    );
  }

  // Obtener un receta aleatoria
  getRandomRecipe(): Observable<Meal | null> {
    return this.http.get<MealAPIResponse>(`${this.API_URL}/random.php`).pipe(
      map((response) => {
        if (!response.meals || response.meals.length === 0) return null;
        return mapRawMealToMeal(response.meals[0]);
      })
    );
  }

}
