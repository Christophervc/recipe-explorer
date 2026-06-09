import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RecipeService } from '../../../core/services/recipe/recipe.service';
import { Meal } from '../../../interfaces/recipe.interface';

@Component({
  selector: 'app-featured-recipe',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (loading()) {
      <div class="animate-pulse bg-gray-200 rounded-3xl h-64 mb-12 w-full"></div>
    } @else if (recipe(); as random) {
      <section class="mb-16 bg-white rounded-3xl shadow-lg overflow-hidden border border-orange-100 transition-transform hover:shadow-xl">
        <div class="md:flex">
           <div class="md:w-1/3 lg:w-2/5">
             <img [src]="random.thumbnail" [alt]="random.title" class="w-full h-full object-cover aspect-video md:aspect-auto" />
           </div>
           <div class="md:w-2/3 lg:w-3/5 p-8 flex flex-col justify-center">
              <div class="flex items-center gap-2 mb-4">
                 <span class="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold uppercase tracking-wider">🔥 Receta Sugerida</span>
                 <span class="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-bold">{{ random.category }}</span>
              </div>
              <h2 class="text-3xl font-extrabold text-gray-900 mb-4">{{ random.title }}</h2>
              <h3 class="font-bold text-gray-700 mb-2">Preparación rápida:</h3>
              <p class="text-gray-600 line-clamp-4 mb-6 whitespace-pre-line text-sm md:text-base">{{ random.instructions }}</p>
              <div>
                <a [routerLink]="['/recipe', random.id]" class="inline-flex items-center px-6 py-3 bg-orange-500 text-white font-medium rounded-xl hover:bg-orange-600 transition-colors shadow-md shadow-orange-200">
                  Ver receta completa y medidas
                </a>
              </div>
           </div>
        </div>
      </section>
    }
  `
})
export class FeaturedRecipeComponent implements OnInit {
  private recipeService = inject(RecipeService);
  
  recipe = signal<Meal | null>(null);
  loading = signal<boolean>(true);

  ngOnInit(): void {
    this.recipeService.getRandomRecipe().subscribe({
      next: (data) => {
        this.recipe.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}