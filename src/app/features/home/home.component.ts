import { Component, inject, OnInit, signal } from '@angular/core';
import { RecipeService } from '../../core/services/recipe/recipe.service';
import { Meal } from '../../interfaces/recipe.interface';
import { RecipeCardComponent } from '../../shared/components/recipe-card/recipe-card.component';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RecipeCardComponent, SearchBarComponent, RouterLink],
  template: `
    <main class="min-h-screen bg-gray-50 p-6 md:p-12">
      <div class="max-w-7xl mx-auto">
        <header class="mb-12 text-center">
          <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 italic">
            Chef<span class="text-orange-500">Explorer</span>
          </h1>
          <p class="text-gray-600 max-w-2xl mx-auto mb-6">
            Descubre las mejores recetas del mundo con un solo click. Busca ingredientes, categorías
            o regiones.
          </p>
          <!-- Usamos el componente y escuchamos el evento (search) -->
          <app-search-bar (search)="onSearch($event)" />
        </header>

        @if (randomLoading()) {
          <div class="animate-pulse bg-gray-200 rounded-3xl h-64 mb-12 w-full"></div>
        } @else if (randomRecipe(); as random) {
          <section class="mb-16 bg-white rounded-3xl shadow-lg overflow-hidden border border-orange-100 transition-transform hover:shadow-xl">
            <div class="md:flex">
               <div class="md:w-1/3 lg:w-2/5">
                 <img [src]="random.thumbnail" [alt]="random.title" class="w-full h-full object-cover aspect-video md:aspect-auto" />
               </div>
               
               <div class="md:w-2/3 lg:w-3/5 p-8 flex flex-col justify-center">
                  <div class="flex items-center gap-2 mb-4">
                     <span class="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold uppercase tracking-wider">
                       🔥 Receta Sugerida
                     </span>
                     <span class="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-bold">
                       {{ random.category }}
                     </span>
                  </div>
                  
                  <h2 class="text-3xl font-extrabold text-gray-900 mb-4">{{ random.title }}</h2>
                  
                  <h3 class="font-bold text-gray-700 mb-2">Preparación rápida:</h3>
                  <p class="text-gray-600 line-clamp-4 mb-6 whitespace-pre-line text-sm md:text-base">
                    {{ random.instructions }}
                  </p>
                  
                  <div>
                    <a [routerLink]="['/recipe', random.id]" class="inline-flex items-center px-6 py-3 bg-orange-500 text-white font-medium rounded-xl hover:bg-orange-600 transition-colors shadow-md shadow-orange-200">
                      Ver receta completa
                      <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </a>
                  </div>
               </div>
            </div>
          </section>
        }

        <section>
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Explorar Recetas</h2>
          </div>

          @if (loading()) {
            <div class="flex flex-col items-center justify-center py-10">
              <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mb-4"></div>
            </div>
          } @else if (recipes().length > 0) {
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              @for (item of recipes(); track item.id) {
                <app-recipe-card [recipe]="item" />
              }
            </div>
          } @else {
            <div class="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-dashed border-gray-300">
              <h3 class="text-xl font-bold text-gray-700">No hay resultados</h3>
              <p class="text-gray-500 mt-2">Intenta buscar con otros términos.</p>
            </div>
          }
        </section>
      </div>
    </main>
  `,
})
export class HomeComponent implements OnInit {
  private recipeService = inject(RecipeService);

  recipes = signal<Meal[]>([]);
  loading = signal<boolean>(true);
  randomRecipe = signal<Meal | null>(null);
  randomLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.fetchRandomRecipe();
    this.fetchRecipes('burger');
  }

  onSearch(query: string): void {
    this.fetchRecipes(query);
  }

  private fetchRandomRecipe(): void {
    this.randomLoading.set(true);
    this.recipeService.getRandomRecipe().subscribe({
      next: (data) => {
        this.randomRecipe.set(data);
        this.randomLoading.set(false);
      },
      error: (err) => {
        console.error('Error cargando receta aleatoria:', err);
        this.randomLoading.set(false);
      }
    });
  }

  private fetchRecipes(query: string): void {
    this.loading.set(true);
    this.recipeService.searchRecipes(query).subscribe({
      next: (data) => {
        this.recipes.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error buscando recetas:', err);
        this.recipes.set([]);
        this.loading.set(false);
      },
    });
  }
}
