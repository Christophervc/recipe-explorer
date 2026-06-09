import { Component, inject, OnInit, signal } from '@angular/core';
import { RecipeService } from '../../core/services/recipe/recipe.service';
import { Meal } from '../../interfaces/recipe.interface';
import { RecipeCardComponent } from '../../shared/components/recipe-card/recipe-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RecipeCardComponent],
  template: `
  <main class="min-h-screen bg-gray-50 p-6 md:p-12">
      <div class="max-w-7xl mx-auto">
        <header class="mb-12 text-center">
          <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 italic">
            Chef<span class="text-orange-500">Explorer</span>
          </h1>
          <p class="text-gray-600 max-w-2xl mx-auto">
            Descubre las mejores recetas del mundo con un solo click. 
            Busca ingredientes, categorías o regiones.
          </p>
        </header>

        <section>
          @if (recipes().length > 0) {
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              @for (item of recipes(); track item.id) {
                <app-recipe-card [recipe]="item" />
              }
            </div>
          } @else {
            <div class="flex flex-col items-center justify-center py-20">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
              <p class="text-gray-500">Buscando las mejores recetas...</p>
            </div>
          }
        </section>
      </div>
    </main>
  `
})
export class HomeComponent implements OnInit {

  private recipeService = inject(RecipeService);

  recipes = signal<Meal[]>([]);

  ngOnInit(): void {
    this.recipeService.searchRecipes('burger').subscribe({
      next: (data) => {
        this.recipes.set(data);
        console.log('Datos limpios recibidos:', data);       
      },
      error: (err) => console.error('Error al obtener recetas:', err)
    });
  }
}
