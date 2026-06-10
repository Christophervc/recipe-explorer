import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RecipeService } from '../../../core/services/recipe/recipe.service';
import { Category } from '../../../interfaces/recipe.interface';

@Component({
  selector: 'app-category-section',
  imports: [RouterLink],
  styleUrl: './category-section.css',
  templateUrl: './category-section.html'
})
export class CategorySectionComponent implements OnInit {
  private recipeService = inject(RecipeService);
  categories = signal<Category[]>([]);
  loading = signal(true);
  
  ngOnInit(): void {
    this.recipeService.getCategories().subscribe({
      next: (data) => {
        this.categories.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando categorías', err);
        this.loading.set(false);
      }
    });
  }
}
