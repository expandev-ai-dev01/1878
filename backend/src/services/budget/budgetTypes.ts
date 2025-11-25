/**
 * @summary
 * Type definitions for budget service operations.
 * Defines interfaces for budget entities and request/response structures.
 *
 * @module services/budget/budgetTypes
 */

export interface BudgetEntity {
  idBudget: number;
  idAccount: number;
  amount: number;
  dateCreated: Date;
  dateModified: Date;
  deleted: boolean;
}

export interface BudgetGetRequest {
  idAccount: number;
}
