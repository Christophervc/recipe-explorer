import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { RecipeDetailComponent } from './features/recipe-detail/recipe-detail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'recipe/:id', component: RecipeDetailComponent },
  { path: '**', redirectTo: '' },
];
