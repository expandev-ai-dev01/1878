import { useCategoryList } from '../../hooks/useCategoryList';
import { LoadingSpinner } from '@/core/components/loading-spinner';
import {
  Empty,
  EmptyHeader,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from '@/core/components/empty';
import { PackageIcon } from 'lucide-react';
import { CategoryItem } from '../CategoryItem';
import { Alert, AlertDescription, AlertTitle } from '@/core/components/alert';
import { InfoIcon } from 'lucide-react';

function CategoryList() {
  const { categories, isLoading, error } = useCategoryList();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <InfoIcon />
        <AlertTitle>Erro ao carregar categorias</AlertTitle>
        <AlertDescription>
          Não foi possível carregar as categorias. Tente novamente mais tarde.
        </AlertDescription>
      </Alert>
    );
  }

  const predefinedCategories = categories?.filter((cat) => cat.type === 'predefinida') ?? [];
  const customCategories = categories?.filter((cat) => cat.type === 'personalizada') ?? [];
  const customCategoriesCount = customCategories.length;
  const remainingSlots = 15 - customCategoriesCount;

  if (!categories || categories.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <PackageIcon />
          </EmptyMedia>
          <EmptyTitle>Nenhuma categoria encontrada</EmptyTitle>
          <EmptyDescription>Comece criando sua primeira categoria personalizada</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="space-y-6">
      <Alert>
        <InfoIcon />
        <AlertTitle>Limite de categorias</AlertTitle>
        <AlertDescription>
          Você pode criar até 15 categorias personalizadas. Atualmente você tem{' '}
          <strong>{customCategoriesCount}</strong> categoria{customCategoriesCount !== 1 ? 's' : ''}{' '}
          personalizada{customCategoriesCount !== 1 ? 's' : ''} e pode criar mais{' '}
          <strong>{remainingSlots}</strong>.
        </AlertDescription>
      </Alert>

      {predefinedCategories.length > 0 && (
        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold tracking-tight">Categorias Pré-definidas</h2>
            <p className="text-sm text-muted-foreground">
              Categorias padrão do sistema que podem ser editadas
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {predefinedCategories.map((category) => (
              <CategoryItem key={category.idCategory} category={category} />
            ))}
          </div>
        </section>
      )}

      {customCategories.length > 0 && (
        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold tracking-tight">Categorias Personalizadas</h2>
            <p className="text-sm text-muted-foreground">
              Suas categorias criadas ({customCategoriesCount}/15)
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {customCategories.map((category) => (
              <CategoryItem key={category.idCategory} category={category} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export { CategoryList };
