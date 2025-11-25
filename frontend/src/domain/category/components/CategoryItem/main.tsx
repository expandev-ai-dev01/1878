import { Card, CardContent } from '@/core/components/card';
import { Button } from '@/core/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/core/components/dropdown-menu';
import { Badge } from '@/core/components/badge';
import { MoreVerticalIcon, PencilIcon, TrashIcon, RotateCcwIcon } from 'lucide-react';
import type { Category } from '../../types/category';
import { useState } from 'react';
import { CategoryFormDialog } from '../CategoryFormDialog';
import { CategoryDeleteDialog } from '../CategoryDeleteDialog';
import { useCategoryRestore } from '../../hooks/useCategoryRestore';
import { toast } from 'sonner';
import { CATEGORY_ICONS } from '../../constants/icons';

interface CategoryItemProps {
  category: Category;
}

function CategoryItem({ category }: CategoryItemProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { restoreCategory, isPending: isRestoring } = useCategoryRestore();

  const IconComponent =
    CATEGORY_ICONS[category.icon as keyof typeof CATEGORY_ICONS] || CATEGORY_ICONS['circle'];
  const isPredefined = category.type === 'predefinida';
  const isEdited = category.edited;

  const handleRestore = async () => {
    try {
      await restoreCategory(category.idCategory);
      toast.success(`Categoria "${category.name}" restaurada com sucesso!`);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || 'Não foi possível restaurar a categoria.';
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <Card className="transition-all hover:shadow-md">
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${category.color}20`, color: category.color }}
              >
                <IconComponent className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{category.name}</h3>
                  {isPredefined && (
                    <Badge variant="secondary" className="text-xs">
                      Pré-definida
                    </Badge>
                  )}
                  {isEdited && (
                    <Badge variant="outline" className="text-xs">
                      Editada
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span>{category.color}</span>
                </div>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm">
                  <MoreVerticalIcon className="h-4 w-4" />
                  <span className="sr-only">Abrir menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                  <PencilIcon className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
                {isPredefined && isEdited && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleRestore} disabled={isRestoring}>
                      <RotateCcwIcon className="mr-2 h-4 w-4" />
                      Restaurar original
                    </DropdownMenuItem>
                  </>
                )}
                {!isPredefined && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => setIsDeleteDialogOpen(true)}
                    >
                      <TrashIcon className="mr-2 h-4 w-4" />
                      Excluir
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      <CategoryFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        mode="edit"
        category={category}
      />

      <CategoryDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        category={category}
      />
    </>
  );
}

export { CategoryItem };
