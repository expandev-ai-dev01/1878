export interface Category {
  idCategory: number;
  name: string;
  icon: string;
  color: string;
  type: 'predefinida' | 'personalizada';
  edited: boolean;
}

export interface CreateCategoryDto {
  name: string;
  icon: string;
  color: string;
}

export interface UpdateCategoryDto {
  idCategory: number;
  name: string;
  icon: string;
  color: string;
}

export interface DeleteCategoryDto {
  idCategory: number;
  idSubstituteCategory?: number;
}
