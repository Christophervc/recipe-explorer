import { Component, effect, inject, input, signal } from '@angular/core';
import { RecipeService } from '../../core/services/recipe/recipe.service';
import { Meal } from '../../interfaces/recipe.interface';
import { RecipeCardComponent } from '../../shared/components/recipe-card/recipe-card.component';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [RecipeCardComponent, SearchBarComponent, RouterLink],
  template: `
    <main class="min-h-screen bg-gray-50 p-6 md:p-12">
      <div class="max-w-7xl mx-auto">
        <header class="mb-10">
          <a
          routerLink="/"
          class="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium mb-4 transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            ></path>
          </svg>
          Volver al inicio
        </a>
          <h1 class="text-3xl font-bold text-gray-900 mb-6">
            Resultados para: <span class="text-orange-500">"{{ q() }}"</span>
          </h1>
          <app-search-bar (search)="onSearch($event)" />
        </header>

        <section>
          @if (loading()) {
            <div class="flex flex-col items-center justify-center py-20">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
            </div>
          } @else if (recipes().length > 0) {
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              @for (item of recipes(); track item.id) {
                <app-recipe-card [recipe]="item" />
              }
            </div>
          } @else {
             <div class="text-center py-20">
               <h3 class="text-xl font-bold text-gray-700">No encontramos recetas para "{{ q() }}"</h3>
               <p class="text-gray-500 mt-2">Intenta con otros ingredientes.</p>
             </div>
          }
        </section>
      </div>
    </main>
  `
})
export class SearchResultsComponent {
  // Query Param "?q=algo" entra automáticamente aquí
  q = input<string>(''); 
  
  private recipeService = inject(RecipeService);
  private router = inject(Router);

  recipes = signal<Meal[]>([]);
  loading = signal<boolean>(false);

  constructor() {
    // Escuchamos los cambios en el input 'q' que viene de la URL
    effect(() => {
      const query = this.q();
      if (query) {
        this.fetchRecipes(query);
      } else {
        this.recipes.set([]);
      }
    });
  }

  // Si el usuario busca otra cosa desde esta misma página, actualizamos la URL
  onSearch(newQuery: string): void {
    if (newQuery.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: newQuery } });
    }
  }

  private fetchRecipes(query: string): void {
    this.loading.set(true);
    this.recipeService.searchRecipes(query).subscribe({
      next: (data) => {
        this.recipes.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}