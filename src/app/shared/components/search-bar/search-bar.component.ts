import { Component, OnInit, inject, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="relative max-w-xl mx-auto w-full">
      <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
      </div>

      <!-- Enlazamos el input HTML con nuestro control en TypeScript usando [formControl] -->
      <input
        type="search"
        [formControl]="searchInput"
        class="block w-full p-4 pl-12 text-sm text-gray-900 border border-gray-200 rounded-2xl bg-white focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all outline-none shadow-sm"
        placeholder="Busca tacos, pollo, pasta..."
      />

      <!-- Botón limpiar -->
      @if (searchInput.value) {
        <button
          (click)="clearSearch()"
          class="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      }
    </div>
  `,
})
export class SearchBarComponent implements OnInit {
  searchInput = new FormControl('');
  search = output<string>();

  ngOnInit(): void {
    this.searchInput.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => {
        this.search.emit(value || '');
      });
  }

  clearSearch(): void {
    this.searchInput.setValue('');
  }
}
