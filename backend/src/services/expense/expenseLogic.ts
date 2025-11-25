/**
 * @summary
 * Expense business logic implementation.
 * Handles expense creation with in-memory storage.
 *
 * @module services/expense/expenseLogic
 */

import { ExpenseCreateRequest, ExpenseEntity } from './expenseTypes';

const expenses: ExpenseEntity[] = [];
let nextId = 1;

export async function expenseCreate(params: ExpenseCreateRequest): Promise<{ idExpense: number }> {
  if (params.amount <= 0) {
    throw new Error('amountMustBePositive');
  }

  if (params.description && params.description.length > 100) {
    throw new Error('descriptionTooLong');
  }

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

export async function getExpensesByCategory(
  idAccount: number,
  idCategory: number
): Promise<ExpenseEntity[]> {
  return expenses.filter(
    (exp) => exp.idAccount === idAccount && exp.idCategory === idCategory && !exp.deleted
  );
}

export async function getExpensesByAccount(idAccount: number): Promise<ExpenseEntity[]> {
  return expenses.filter((exp) => exp.idAccount === idAccount && !exp.deleted);
}

export async function reassignExpenseCategory(
  idAccount: number,
  oldCategoryId: number,
  newCategoryId: number
): Promise<void> {
  expenses.forEach((exp) => {
    if (exp.idAccount === idAccount && exp.idCategory === oldCategoryId && !exp.deleted) {
      exp.idCategory = newCategoryId;
      exp.dateModified = new Date();
    }
  });
}
