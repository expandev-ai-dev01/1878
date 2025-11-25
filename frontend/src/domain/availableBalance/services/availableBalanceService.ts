import { authenticatedClient } from '@/core/lib/api';
import type { AvailableBalance } from '../types/availableBalance';

/**
 * @service AvailableBalanceService
 * @domain availableBalance
 * @type REST
 */
export const availableBalanceService = {
  /**
   * Retrieves the remaining available balance for the current month
   * @returns Available balance data with status indicators
   */
  async get(): Promise<AvailableBalance> {
    const { data } = await authenticatedClient.get('/available-balance');
    return data.data;
  },
};
