import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/core/components/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/core/components/select';
import { Label } from '@/core/components/label';
import { useCategoryDelete } from '../../hooks/useCategoryDelete';
import { useCategoryList } from '../../hooks/useCategoryList';
import { toast } from 'sonner';
import type { Category } from '../../types/category';
import { useState, useEffect } from 'react';
import { LoadingSpinner } from '@/core/components/loading-spinner';
import { Alert, AlertDescription } from '@/core/components/alert';
import { InfoIcon } from 'lucide-react';

interface CategoryDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category;
}

function CategoryDeleteDialog({ open, onOpenChange, category }: CategoryDeleteDialogProps) {
  const { deleteCategory, isPending } = useCategoryDelete();
  const { categories } = useCategoryList();
  const [substituteId, setSubstituteId] = useState<number | undefined>(undefined);
  const [hasExpenses, setHasExpenses] = useState(false);

  const availableCategories =
    categories?.filter((cat) => cat.idCategory !== category.idCategory) ?? [];

  useEffect(() => {
    if (open) {
      setSubstituteId(undefined);
      setHasExpenses(false);
    }
  }, [open]);

  const handleDelete = async () => {
    try {
      await deleteCategory({
        idCategory: category.idCategory,
        idSubstituteCategory: hasExpenses ? substituteId : undefined,
      });
      toast.success(`Categoria "${category.name}" excluída com sucesso!`);
      onOpenChange(false);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || 'Não foi possível excluir a categoria.';

      if (
        errorMessage.includes('gastos associados') ||
        errorMessage.includes('substituteCategory')
      ) {
        setHasExpenses(true);
        toast.error('Esta categoria possui gastos associados. Selecione uma categoria substituta.');
      } else {
        toast.error(errorMessage);
      }
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir categoria</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir a categoria "{category.name}"?
            {!hasExpenses && ' Esta ação não pode ser desfeita.'}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {hasExpenses && (
          <div className="space-y-4 py-4">
            <Alert>
              <InfoIcon />
              <AlertDescription>
                Esta categoria possui gastos associados. Selecione uma categoria substituta para
                reclassificar esses gastos.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="substitute-category">Categoria substituta *</Label>
              <Select
                value={substituteId?.toString()}
                onValueChange={(value) => setSubstituteId(parseInt(value))}
                disabled={isPending}
              >
                <SelectTrigger id="substitute-category">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.map((cat) => (
                    <SelectItem key={cat.idCategory} value={cat.idCategory.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending || (hasExpenses && !substituteId)}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {isPending ? (
              <>
                <LoadingSpinner className="mr-2" />
                Excluindo...
              </>
            ) : (
              'Excluir'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export { CategoryDeleteDialog };
