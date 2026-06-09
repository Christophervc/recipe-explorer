export interface MealAPIResponse {
  meals: RawMeal[] | null;
}

export interface RawMeal {
  idMeal: string;
  strMeal: string;
  strDrinkAlternative: string | null;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags: string | null;
  strYoutube: string | null;
  strSource: string | null;
  strImageSource: string | null;
  strCreativeCommonsConfirmed: string | null;
  dateModified: string | null;
  [key: string]: string | null;
}

export interface Meal {
  id: string;
  title: string;
  category: string;
  area: string;
  instructions: string;
  thumbnail: string;
  tags: string[];
  youtube: string | null;
  ingredients: RecipeIngredient[];
}

export interface RecipeIngredient {
  name: string;
  measure: string;
}


export function mapRawMealToMeal(raw: RawMeal): Meal {
  const ingredients: RecipeIngredient[] = [];

  // Recorremos del 1 al 20 para agrupar ingredientes y medidas válidas
  for (let i = 1; i <= 20; i++) {
    const ingredientName = raw[`strIngredient${i}`];
    const ingredientMeasure = raw[`strMeasure${i}`];

    // Validamos que el ingrediente no sea nulo, indefinido o una cadena vacía
    if (ingredientName && ingredientName.trim() !== '') {
      ingredients.push({
        name: ingredientName.trim(),
        measure: ingredientMeasure ? ingredientMeasure.trim() : ''
      });
    }
  }

  // Procesamos los tags para transformarlos en un array manejable
  const tagsArray = raw.strTags 
    ? raw.strTags.split(',').map(tag => tag.trim()) 
    : [];

  return {
    id: raw.idMeal,
    title: raw.strMeal,
    category: raw.strCategory,
    area: raw.strArea,
    instructions: raw.strInstructions,
    thumbnail: raw.strMealThumb,
    tags: tagsArray,
    youtube: raw.strYoutube,
    ingredients: ingredients
  };
}