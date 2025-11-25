import { authenticatedClient } from '@/core/lib/api';
import type { Category } from '../types/category';

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
};
