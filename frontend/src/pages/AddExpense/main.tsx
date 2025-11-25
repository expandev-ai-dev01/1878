import { ExpenseForm } from '@/domain/expense/components/ExpenseForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/components/card';
import { useNavigation } from '@/core/hooks/useNavigation';

function AddExpensePage() {
  const { goHome } = useNavigation();

  return (
    <div className="mx-auto max-w-2xl space-y-6 py-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Adicionar Gasto</h1>
        <p className="text-muted-foreground">
          Registre um novo gasto para manter o controle das suas finanças
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Novo Gasto</CardTitle>
          <CardDescription>
            Preencha os campos abaixo para registrar um novo gasto no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ExpenseForm onSuccess={goHome} />
        </CardContent>
      </Card>
    </div>
  );
}

export { AddExpensePage };
