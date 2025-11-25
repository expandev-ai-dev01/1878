import { authenticatedClient } from '@/core/lib/api';
import type {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
  DeleteCategoryDto,
} from '../types/category';

/**
 * @service CategoryService
 * @domain category
 * @type REST
 */
export const categoryService = {
  /**
   * Retrieves all active categories ordered alphabetically
   * @returns List of categories
   */
  async list(): Promise<Category[]> {
    const { data } = await authenticatedClient.get('/category');
    return data.data;
  },

  /**
   * Creates a new custom category
   * @param data - Category creation data
   * @returns Created category ID
   */
  async create(data: CreateCategoryDto): Promise<{ idCategory: number }> {
    const { data: response } = await authenticatedClient.post('/category', data);
    return response.data;
  },

  /**
   * Updates an existing category
   * @param data - Category update data
   * @returns Updated category ID
   */
  async update(data: UpdateCategoryDto): Promise<{ idCategory: number }> {
    const { idCategory, ...updateData } = data;
    const { data: response } = await authenticatedClient.put(`/category/${idCategory}`, updateData);
    return response.data;
  },

  /**
   * Deletes a custom category
   * @param data - Category deletion data with optional substitute
   * @returns Deleted category ID
   */
  async delete(data: DeleteCategoryDto): Promise<{ idCategory: number }> {
    const { idCategory, idSubstituteCategory } = data;
    const { data: response } = await authenticatedClient.delete(`/category/${idCategory}`, {
      data: idSubstituteCategory ? { idSubstituteCategory } : undefined,
    });
    return response.data;
  },

  /**
   * Restores a predefined category to original values
   * @param idCategory - Category ID to restore
   * @returns Restored category ID
   */
  async restore(idCategory: number): Promise<{ idCategory: number }> {
    const { data: response } = await authenticatedClient.post(`/category/${idCategory}/restore`);
    return response.data;
  },
};
