import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../../services/categoryService';
import type { DeleteCategoryDto } from '../../types/category';

export const useCategoryDelete = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: deleteCategory, ...mutationInfo } = useMutation({
    mutationFn: (data: DeleteCategoryDto) => categoryService.delete(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  return { deleteCategory, ...mutationInfo };
};
