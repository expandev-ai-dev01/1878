import { authenticatedClient } from '@/core/lib/api';
import type { CreateExpenseDto } from '../types/expense';

/**
 * @service ExpenseService
 * @domain expense
 * @type REST
 */
export const expenseService = {
  /**
   * Creates a new expense record
   * @param data - Expense creation data
   * @returns Created expense ID
   */
  async create(data: CreateExpenseDto): Promise<{ idExpense: number }> {
    const { data: response } = await authenticatedClient.post('/expense', data);
    return response.data;
  },
};
