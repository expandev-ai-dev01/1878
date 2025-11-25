import { useQuery } from '@tanstack/react-query';
import { monthlyTotalService } from '../../services/monthlyTotalService';

export const useMonthlyTotal = (month?: string) => {
  const { data, ...queryInfo } = useQuery({
    queryKey: ['monthly-total', month],
    queryFn: () => monthlyTotalService.get(month),
  });

  return { monthlyTotal: data, ...queryInfo };
};
