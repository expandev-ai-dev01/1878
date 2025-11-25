import { useQuery } from '@tanstack/react-query';
import { availableBalanceService } from '../../services/availableBalanceService';

export const useAvailableBalance = () => {
  const { data, ...queryInfo } = useQuery({
    queryKey: ['available-balance'],
    queryFn: () => availableBalanceService.get(),
    // Invalidate when expenses or budget changes (handled by query invalidation in other hooks)
  });

  return { availableBalance: data, ...queryInfo };
};
