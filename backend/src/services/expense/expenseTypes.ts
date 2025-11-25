/**
 * @summary
 * Type definitions for expense service operations.
 * Defines interfaces for expense entities and request/response structures.
 *
 * @module services/expense/expenseTypes
 */

/**
 * @interface ExpenseEntity
 * @description Represents an expense record in the system
 *
 * @property {number} idExpense - Unique expense identifier
 * @property {number} idAccount - Associated account identifier
 * @property {number} idUser - User who created the expense
 * @property {number} idCategory - Category identifier
 * @property {number} amount - Expense amount
 * @property {Date} expenseDate - Date of expense
 * @property {string | null} description - Optional expense description
 * @property {Date} dateCreated - Creation timestamp
 * @property {Date} dateModified - Last modification timestamp
 * @property {boolean} deleted - Soft delete flag
 */
export interface ExpenseEntity {
  idExpense: number;
  idAccount: number;
  idUser: number;
  idCategory: number;
  amount: number;
  expenseDate: Date;
  description: string | null;
  dateCreated: Date;
  dateModified: Date;
  deleted: boolean;
}

/**
 * @interface ExpenseCreateRequest
 * @description Request parameters for creating a new expense
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idUser - User identifier
 * @property {number} amount - Expense amount (must be positive)
 * @property {Date} expenseDate - Date of expense
 * @property {string | null} description - Optional description (max 100 chars)
 * @property {number} idCategory - Category identifier
 */
export interface ExpenseCreateRequest {
  idAccount: number;
  idUser: number;
  amount: number;
  expenseDate: Date;
  description: string | null;
  idCategory: number;
}
