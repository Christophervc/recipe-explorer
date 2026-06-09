import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Meal } from '../../../interfaces/recipe.interface';

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [RouterLink],
  template: `
    <article class="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col h-full">
      <div class="relative aspect-video overflow-hidden">
        <img 
          [src]="recipe().thumbnail" 
          [alt]="recipe().title"
          class="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
        />
        <div class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-sm">
          {{ recipe().area }}
        </div>
      </div>

      <div class="p-5 flex flex-col grow">
        <span class="text-orange-500 text-xs font-bold uppercase tracking-wider mb-2">
          {{ recipe().category }}
        </span>
        
        <h3 class="text-xl font-bold text-gray-900 mb-3 line-clamp-1">
          {{ recipe().title }}
        </h3>

        <div class="flex flex-wrap gap-2 mb-4">
          @for (tag of recipe().tags.slice(0, 2); track tag) {
            <span class="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded">
              #{{ tag }}
            </span>
          }
        </div>

        <div class="mt-auto">
          <a 
            [routerLink]="['/recipe', recipe().id]"
            class="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 focus:ring-4 focus:ring-orange-300 transition-colors"
          >
            Ver receta
            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </a>
        </div>
      </div>
    </article>
  `
})
export class RecipeCardComponent {
  recipe = input.required<Meal>();
}
