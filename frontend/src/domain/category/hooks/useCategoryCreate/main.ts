import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../../services/categoryService';
import type { CreateCategoryDto } from '../../types/category';

export const useCategoryCreate = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: createCategory, ...mutationInfo } = useMutation({
    mutationFn: (data: CreateCategoryDto) => categoryService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  return { createCategory, ...mutationInfo };
};
