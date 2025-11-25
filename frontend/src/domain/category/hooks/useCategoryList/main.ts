import { useQuery } from '@tanstack/react-query';
import { categoryService } from '../../services/categoryService';

export const useCategoryList = () => {
  const { data: categories, ...queryInfo } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.list(),
  });

  return { categories: categories ?? [], ...queryInfo };
};
