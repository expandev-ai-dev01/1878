import { Button } from '@/core/components/button';
import { useNavigation } from '@/core/hooks/useNavigation';
import { PlusIcon, FolderIcon } from 'lucide-react';
import { MonthlyTotalCard } from '@/domain/monthlyTotal/components/MonthlyTotalCard';
import { ExpenseChart } from '@/domain/expenseChart/components/ExpenseChart';
import { AvailableBalanceCard } from '@/domain/availableBalance/components/AvailableBalanceCard';

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

      <div className="grid gap-6 md:grid-cols-2">
        <AvailableBalanceCard />
        <MonthlyTotalCard />
      </div>

      <ExpenseChart />
    </div>
  );
}

export { HomePage };
