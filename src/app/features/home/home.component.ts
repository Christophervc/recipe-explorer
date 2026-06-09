import { Component, inject, OnInit, signal } from '@angular/core';
import { RecipeService } from '../../core/services/recipe/recipe.service';
import { Meal } from '../../interfaces/recipe.interface';

@Component({
  selector: 'app-home',
  imports: [],
  template: `<div class="p-8">
      <h1 class="text-3xl font-bold text-red-800 mb-6">Recetas de Prueba</h1>
      
      @if (recipes().length > 0) {
        <ul class="list-disc pl-5 space-y-2">
          @for (recipe of recipes(); track recipe.id) {
            <li class="text-lg text-gray-600">
              <span class="font-semibold">{{ recipe.title }}</span> - {{ recipe.category }}
            </li>
          }
        </ul>
      } @else {
        <p class="text-gray-500 italic">Cargando recetas...</p>
      }
    </div>
  `
})
export class HomeComponent implements OnInit {

  private recipeService = inject(RecipeService);

  recipes = signal<Meal[]>([]);

  ngOnInit(): void {
    this.recipeService.searchRecipes('chicken').subscribe({
      next: (data) => {
        this.recipes.set(data);
        console.log('Datos limpios recibidos:', data);       
      },
      error: (err) => console.error('Error al obtener recetas:', err)
    });
  }
}
