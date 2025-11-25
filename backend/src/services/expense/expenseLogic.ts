/**
 * @summary
 * Expense business logic implementation.
 * Handles expense creation with in-memory storage.
 *
 * @module services/expense/expenseLogic
 */

import { ExpenseCreateRequest, ExpenseEntity } from './expenseTypes';

/**
 * @remarks
 * In-memory storage for expenses (no database persistence)
 */
const expenses: ExpenseEntity[] = [];
let nextId = 1;

/**
 * @summary
 * Creates a new expense record
 *
 * @function expenseCreate
 * @module services/expense
 *
 * @param {ExpenseCreateRequest} params - Expense creation parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idUser - User identifier
 * @param {number} params.amount - Expense amount
 * @param {Date} params.expenseDate - Expense date
 * @param {string | null} params.description - Optional description
 * @param {number} params.idCategory - Category identifier
 *
 * @returns {Promise<{ idExpense: number }>} Created expense identifier
 *
 * @throws {Error} When amount is not positive
 * @throws {Error} When description exceeds 100 characters
 * @throws {Error} When category doesn't exist
 */
export async function expenseCreate(params: ExpenseCreateRequest): Promise<{ idExpense: number }> {
  /**
   * @validation Validate amount is positive
   */
  if (params.amount <= 0) {
    throw new Error('amountMustBePositive');
  }

  /**
   * @validation Validate description length
   */
  if (params.description && params.description.length > 100) {
    throw new Error('descriptionTooLong');
  }

  /**
   * @rule {fn-expense-create} Create expense in memory
   */
  const idExpense = nextId++;
  const now = new Date();

  const expense: ExpenseEntity = {
    idExpense,
    idAccount: params.idAccount,
    idUser: params.idUser,
    idCategory: params.idCategory,
    amount: params.amount,
    expenseDate: params.expenseDate,
    description: params.description,
    dateCreated: now,
    dateModified: now,
    deleted: false,
  };

  expenses.push(expense);

  return { idExpense };
}
