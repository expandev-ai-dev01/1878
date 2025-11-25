import { authenticatedClient } from '@/core/lib/api';
import type { MonthlyTotal } from '../types/monthlyTotal';

/**
 * @service MonthlyTotalService
 * @domain monthlyTotal
 * @type REST
 */
export const monthlyTotalService = {
  /**
   * Retrieves total expenses for current month with comparison to previous month
   * @param month - Optional month in YYYY-MM format (defaults to current month)
   * @returns Monthly total data with comparisons and budget indicators
   */
  async get(month?: string): Promise<MonthlyTotal> {
    const params = month ? { month } : {};
    const { data } = await authenticatedClient.get('/monthly-total', { params });
    return data.data;
  },
};
