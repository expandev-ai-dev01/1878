/**
 * @summary
 * Type definitions for category service operations.
 * Defines interfaces for category entities and request/response structures.
 *
 * @module services/category/categoryTypes
 */

export interface CategoryEntity {
  idCategory: number;
  idAccount: number;
  name: string;
  icon: string;
  color: string;
  type: 'predefined' | 'custom';
  edited: boolean;
  originalName: string | null;
  dateCreated: Date;
  dateModified: Date;
  deleted: boolean;
}

export interface CategoryListRequest {
  idAccount: number;
}

export interface CategoryCreateRequest {
  idAccount: number;
  idUser: number;
  name: string;
  icon: string;
  color: string;
}

export interface CategoryGetRequest {
  idAccount: number;
  idCategory: number;
}

export interface CategoryUpdateRequest {
  idAccount: number;
  idCategory: number;
  name: string;
  icon: string;
  color: string;
}

export interface CategoryDeleteRequest {
  idAccount: number;
  idCategory: number;
  idSubstituteCategory?: number;
}

export interface CategoryRestoreRequest {
  idAccount: number;
  idCategory: number;
}
