/**
 * @summary
 * Category business logic implementation.
 * Handles category listing with in-memory storage.
 *
 * @module services/category/categoryLogic
 */

import { CategoryListRequest, CategoryEntity } from './categoryTypes';

/**
 * @remarks
 * In-memory storage for categories (no database persistence)
 * Pre-populated with default categories
 */
const categories: CategoryEntity[] = [
  {
    idCategory: 1,
    idAccount: 1,
    name: 'Alimentação',
    dateCreated: new Date(),
    dateModified: new Date(),
    deleted: false,
  },
  {
    idCategory: 2,
    idAccount: 1,
    name: 'Contas',
    dateCreated: new Date(),
    dateModified: new Date(),
    deleted: false,
  },
  {
    idCategory: 3,
    idAccount: 1,
    name: 'Lazer',
    dateCreated: new Date(),
    dateModified: new Date(),
    deleted: false,
  },
  {
    idCategory: 4,
    idAccount: 1,
    name: 'Outros',
    dateCreated: new Date(),
    dateModified: new Date(),
    deleted: false,
  },
  {
    idCategory: 5,
    idAccount: 1,
    name: 'Transporte',
    dateCreated: new Date(),
    dateModified: new Date(),
    deleted: false,
  },
];

/**
 * @summary
 * Retrieves all active categories for an account, ordered alphabetically
 *
 * @function categoryList
 * @module services/category
 *
 * @param {CategoryListRequest} params - Category list parameters
 * @param {number} params.idAccount - Account identifier
 *
 * @returns {Promise<Array<{ idCategory: number; name: string }>>} List of categories
 */
export async function categoryList(
  params: CategoryListRequest
): Promise<Array<{ idCategory: number; name: string }>> {
  /**
   * @rule {fn-category-list} Filter and sort categories
   */
  return categories
    .filter((cat) => cat.idAccount === params.idAccount && !cat.deleted)
    .map((cat) => ({
      idCategory: cat.idCategory,
      name: cat.name,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
