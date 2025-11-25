import { CategoryList } from '@/domain/category/components/CategoryList';
import { Button } from '@/core/components/button';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { CategoryFormDialog } from '@/domain/category/components/CategoryFormDialog';

function CategoriesPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <div className="space-y-8 py-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Categorias</h1>
          <p className="text-muted-foreground">Gerencie suas categorias de gastos personalizadas</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} size="lg">
          <PlusIcon className="mr-2" />
          Nova Categoria
        </Button>
      </div>

      <CategoryList />

      <CategoryFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        mode="create"
      />
    </div>
  );
}

export { CategoriesPage };
