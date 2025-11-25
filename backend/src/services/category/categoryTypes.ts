/**
 * @summary
 * Type definitions for category service operations.
 * Defines interfaces for category entities and request/response structures.
 *
 * @module services/category/categoryTypes
 */

/**
 * @interface CategoryEntity
 * @description Represents a category record in the system
 *
 * @property {number} idCategory - Unique category identifier
 * @property {number} idAccount - Associated account identifier
 * @property {string} name - Category name
 * @property {Date} dateCreated - Creation timestamp
 * @property {Date} dateModified - Last modification timestamp
 * @property {boolean} deleted - Soft delete flag
 */
export interface CategoryEntity {
  idCategory: number;
  idAccount: number;
  name: string;
  dateCreated: Date;
  dateModified: Date;
  deleted: boolean;
}

/**
 * @interface CategoryListRequest
 * @description Request parameters for listing categories
 *
 * @property {number} idAccount - Account identifier
 */
export interface CategoryListRequest {
  idAccount: number;
}
