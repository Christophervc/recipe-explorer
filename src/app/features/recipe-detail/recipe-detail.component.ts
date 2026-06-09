import { Component, effect, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RecipeService } from '../../core/services/recipe/recipe.service';
import { Meal } from '../../interfaces/recipe.interface';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="min-h-screen bg-gray-50 p-6 md:p-12">
      <div class="max-w-5xl mx-auto">
        <!-- Botón de regreso -->
        <a
          routerLink="/"
          class="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium mb-8 transition-colors"
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

        @if (loading()) {
          <!-- Skeleton Loader simple -->
          <div class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        } @else if (recipe(); as currentRecipe) {
          <!-- Contenedor Principal -->
          <article class="bg-white rounded-3xl shadow-xl overflow-hidden">
            <!-- Hero de la receta -->
            <div class="md:flex">
              <div class="md:w-1/2 lg:w-2/5">
                <img
                  [src]="currentRecipe.thumbnail"
                  [alt]="currentRecipe.title"
                  class="w-full h-full object-cover aspect-square md:aspect-auto"
                />
              </div>

              <div class="p-8 md:w-1/2 lg:w-3/5 flex flex-col justify-center">
                <div class="flex items-center gap-3 mb-4">
                  <span
                    class="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold"
                    >{{ currentRecipe.category }}</span
                  >
                  <span
                    class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold"
                    >{{ currentRecipe.area }}</span
                  >
                </div>

                <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
                  {{ currentRecipe.title }}
                </h1>

                @if (currentRecipe.youtube) {
                  <a
                    [href]="currentRecipe.youtube"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center w-max px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
                  >
                    <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"
                      />
                    </svg>
                    Ver en YouTube
                  </a>
                }
              </div>
            </div>

            <!-- Detalles (Ingredientes e Instrucciones) -->
            <div class="p-8 md:p-12 border-t border-gray-100 bg-gray-50/50">
              <div class="grid md:grid-cols-3 gap-12">
                <!-- Ingredientes -->
                <div class="md:col-span-1">
                  <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <svg
                      class="w-6 h-6 mr-2 text-orange-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      ></path>
                    </svg>
                    Ingredientes
                  </h2>
                  <ul class="space-y-3">
                    @for (item of currentRecipe.ingredients; track item.name) {
                      <li
                        class="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-gray-100"
                      >
                        <span class="font-medium text-gray-800">{{ item.name }}</span>
                        <span
                          class="text-orange-600 font-bold text-sm bg-orange-50 px-2 py-1 rounded"
                          >{{ item.measure }}</span
                        >
                      </li>
                    }
                  </ul>
                </div>

                <!-- Instrucciones -->
                <div class="md:col-span-2">
                  <h2 class="text-2xl font-bold text-gray-900 mb-6">Instrucciones</h2>
                  <div
                    class="prose prose-orange max-w-none text-gray-600 space-y-4 whitespace-pre-line"
                  >
                    {{ currentRecipe.instructions }}
                  </div>
                </div>
              </div>
            </div>
          </article>
        } @else {
          <!-- Estado vacío o error -->
          <div class="text-center py-20">
            <h2 class="text-2xl font-bold text-gray-700">No pudimos encontrar la receta</h2>
          </div>
        }
      </div>
    </main>
  `,
})
export class RecipeDetailComponent {
  id = input.required<string>();
  private recipeService = inject(RecipeService);

  // Estado inicial de la receta y carga
  recipe = signal<Meal | null>(null);
  loading = signal<boolean>(true);
  constructor() {
    // El effect se ejecuta automáticamente cuando el componente se monta
    // y cada vez que la señal `this.id()` cambia su valor.
    effect(() => {
      this.loading.set(true);

      this.recipeService.getRecipeById(this.id()).subscribe({
        next: (data) => {
          this.recipe.set(data);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error cargando la receta', err);
          this.loading.set(false);
        },
      });
    });
  }
}
