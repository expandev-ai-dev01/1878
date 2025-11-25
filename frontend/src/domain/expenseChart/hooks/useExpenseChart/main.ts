import { useQuery } from '@tanstack/react-query';
import { expenseChartService } from '../../services/expenseChartService';

export const useExpenseChart = (month?: string) => {
  const { data, ...queryInfo } = useQuery({
    queryKey: ['expense-chart', month],
    queryFn: () => expenseChartService.get(month),
    refetchInterval: 30000,
  });

  return { chartData: data, ...queryInfo };
};
