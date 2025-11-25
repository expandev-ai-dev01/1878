import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../../services/categoryService';
import type { UpdateCategoryDto } from '../../types/category';

export const useCategoryUpdate = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: updateCategory, ...mutationInfo } = useMutation({
    mutationFn: (data: UpdateCategoryDto) => categoryService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  return { updateCategory, ...mutationInfo };
};
