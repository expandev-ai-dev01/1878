import { Button } from '@/core/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/components/card';
import { useNavigation } from '@/core/hooks/useNavigation';
import { PlusIcon, FolderIcon } from 'lucide-react';

function HomePage() {
  const { navigate } = useNavigation();

  return (
    <div className="space-y-8 py-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Porquinho</h1>
          <p className="text-muted-foreground">Controle seus gastos do dia a dia</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => navigate('/categorias')} variant="outline" size="lg">
            <FolderIcon className="mr-2" />
            Categorias
          </Button>
          <Button onClick={() => navigate('/adicionar-gasto')} size="lg">
            <PlusIcon className="mr-2" />
            Adicionar Gasto
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Bem-vindo!</CardTitle>
            <CardDescription>Comece registrando seus gastos</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Clique no botão "Adicionar Gasto" para começar a controlar suas finanças.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gerencie Categorias</CardTitle>
            <CardDescription>Organize seus gastos por categoria</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Acesse "Categorias" para criar e personalizar suas categorias de gastos.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export { HomePage };
