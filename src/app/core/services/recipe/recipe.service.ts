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
}
