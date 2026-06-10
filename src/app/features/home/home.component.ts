import { Component, inject, OnInit, signal } from '@angular/core';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { Router } from '@angular/router';
import { FeaturedRecipeComponent } from '../../shared/components/featured-recipe/featured-recipe.component';
import { CategorySectionComponent } from '../../shared/components/category-section/category-section';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SearchBarComponent, FeaturedRecipeComponent, CategorySectionComponent],
  template: `
    <main class="min-h-screen bg-gray-50 p-6 md:p-12">
      <div class="max-w-7xl mx-auto">
        <header class="mb-16 text-center">
          <h1 class="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4 italic">
            Chef<span class="text-orange-500">Explorer</span>
          </h1>
          <p class="text-gray-600 max-w-2xl mx-auto mb-8 text-lg">
            Descubre las mejores recetas del mundo con un solo click. Busca ingredientes, categorías
            o regiones.
          </p>

          <app-search-bar (search)="onSearch($event)" />
        </header>

        <app-featured-recipe />

        @defer (on viewport) {
          <app-category-section />
        } @placeholder {
          <div
            class="h-48 mb-16 border-2 border-dashed border-gray-200 rounded-3xl flex items-center justify-center"
          >
            <span class="text-gray-400 font-medium">Descubriendo categorías...</span>
          </div>
        }
      </div>
    </main>
  `,
})
export class HomeComponent {
  private router = inject(Router);

  onSearch(query: string): void {
    // Si el usuario escribe algo, lo mandamos a la ruta /search?q=query
    if (query.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: query } });
    }
  }
}
