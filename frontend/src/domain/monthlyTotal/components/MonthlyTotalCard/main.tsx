import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/components/card';
import { Progress } from '@/core/components/progress';
import { Badge } from '@/core/components/badge';
import { TrendingUpIcon, TrendingDownIcon, AlertCircleIcon } from 'lucide-react';
import { useMonthlyTotal } from '../../hooks/useMonthlyTotal';
import { LoadingSpinner } from '@/core/components/loading-spinner';
import { Alert, AlertDescription, AlertTitle } from '@/core/components/alert';
import { cn } from '@/core/lib/utils';

interface MonthlyTotalCardProps {
  month?: string;
}

function MonthlyTotalCard({ month }: MonthlyTotalCardProps) {
  const { monthlyTotal, isLoading, error } = useMonthlyTotal(month);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <LoadingSpinner className="h-8 w-8" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon />
        <AlertTitle>Erro ao carregar dados</AlertTitle>
        <AlertDescription>
          Não foi possível carregar o total mensal. Tente novamente mais tarde.
        </AlertDescription>
      </Alert>
    );
  }

  if (!monthlyTotal) {
    return null;
  }

  const {
    monthReference,
    totalCurrentMonth,
    totalPreviousMonth,
    percentageVariation,
    visualIndicator,
    budgetPercentage,
    budgetAmount,
  } = monthlyTotal;

  const indicatorColors = {
    green: 'text-green-600 bg-green-50 border-green-200',
    yellow: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    red: 'text-red-600 bg-red-50 border-red-200',
    gray: 'text-gray-600 bg-gray-50 border-gray-200',
  };

  const progressColors = {
    green: '[&>div]:bg-green-600',
    yellow: '[&>div]:bg-yellow-600',
    red: '[&>div]:bg-red-600',
    gray: '[&>div]:bg-gray-400',
  };

  const hasVariation = percentageVariation !== null;
  const isIncrease = hasVariation && percentageVariation > 0;
  const hasBudget = budgetAmount !== null && budgetPercentage !== null;

  return (
    <Card className={cn('transition-all', indicatorColors[visualIndicator])}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Gasto Total Mensal</CardTitle>
            <CardDescription className="mt-1">{monthReference}</CardDescription>
          </div>
          {hasBudget && (
            <Badge
              variant={visualIndicator === 'red' ? 'destructive' : 'secondary'}
              className="text-sm"
            >
              {budgetPercentage.toFixed(1)}% do orçamento
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-4xl font-bold">
              R$ {totalCurrentMonth.toFixed(2).replace('.', ',')}
            </span>
            {hasVariation && (
              <div
                className={cn(
                  'flex items-center gap-1 text-sm font-medium',
                  isIncrease ? 'text-red-600' : 'text-green-600'
                )}
              >
                {isIncrease ? (
                  <TrendingUpIcon className="h-4 w-4" />
                ) : (
                  <TrendingDownIcon className="h-4 w-4" />
                )}
                {Math.abs(percentageVariation).toFixed(1)}%
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Mês anterior: R$ {totalPreviousMonth.toFixed(2).replace('.', ',')}
          </p>
        </div>

        {hasBudget && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Progresso do orçamento</span>
              <span className="text-muted-foreground">
                R$ {budgetAmount.toFixed(2).replace('.', ',')}
              </span>
            </div>
            <Progress
              value={Math.min(budgetPercentage, 100)}
              className={cn('h-3', progressColors[visualIndicator])}
            />
            {budgetPercentage > 100 && (
              <p className="text-sm font-medium text-red-600">
                Orçamento excedido em R${' '}
                {(totalCurrentMonth - budgetAmount).toFixed(2).replace('.', ',')}
              </p>
            )}
          </div>
        )}

        {!hasBudget && (
          <Alert>
            <AlertCircleIcon />
            <AlertDescription className="text-sm">
              Defina um orçamento mensal para acompanhar seus gastos com indicadores visuais.
            </AlertDescription>
          </Alert>
        )}

        {!hasVariation && (
          <p className="text-sm text-muted-foreground">Sem dados para comparação</p>
        )}
      </CardContent>
    </Card>
  );
}

export { MonthlyTotalCard };
