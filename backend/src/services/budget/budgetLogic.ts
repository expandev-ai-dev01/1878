/**
 * @summary
 * Budget business logic implementation.
 * Handles budget operations with in-memory storage.
 *
 * @module services/budget/budgetLogic
 */

import { BudgetEntity, BudgetGetRequest } from './budgetTypes';

// In-memory storage for budgets
// Key: idAccount, Value: BudgetEntity
const budgets: Record<number, BudgetEntity> = {};

/**
 * @summary
 * Retrieves the monthly budget for an account.
 * Returns 0 if no budget is defined.
 *
 * @param {BudgetGetRequest} params - Request parameters
 * @returns {Promise<number>} The budget amount
 */
export async function budgetGet(params: BudgetGetRequest): Promise<number> {
  const budget = budgets[params.idAccount];

  if (!budget || budget.deleted) {
    return 0;
  }

  return budget.amount;
}

/**
 * @summary
 * Internal helper to set budget (for testing or future feature implementation)
 */
export async function _budgetSet(idAccount: number, amount: number): Promise<void> {
  budgets[idAccount] = {
    idBudget: Date.now(),
    idAccount,
    amount,
    dateCreated: new Date(),
    dateModified: new Date(),
    deleted: false,
  };
}
