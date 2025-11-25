import { useMutation, useQueryClient } from '@tanstack/react-query';
import { expenseService } from '../../services/expenseService';
import type { CreateExpenseDto } from '../../types/expense';

export const useExpenseCreate = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: createExpense, ...mutationInfo } = useMutation({
    mutationFn: (data: CreateExpenseDto) => expenseService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });

  return { createExpense, ...mutationInfo };
};
