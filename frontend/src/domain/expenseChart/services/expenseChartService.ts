import { authenticatedClient } from '@/core/lib/api';
import type { ExpenseChartData } from '../types/expenseChart';

/**
 * @service ExpenseChartService
 * @domain expenseChart
 * @type REST
 */
export const expenseChartService = {
  /**
   * Retrieves expense distribution by category for chart visualization
   * @param month - Optional month in YYYY-MM format (defaults to current month)
   * @returns Expense chart data with category distribution
   */
  async get(month?: string): Promise<ExpenseChartData> {
    const params = month ? { month } : {};
    const { data } = await authenticatedClient.get('/expense-chart', { params });
    return data.data;
  },
};
