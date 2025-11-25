import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../../services/categoryService';

export const useCategoryRestore = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: restoreCategory, ...mutationInfo } = useMutation({
    mutationFn: (idCategory: number) => categoryService.restore(idCategory),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  return { restoreCategory, ...mutationInfo };
};
