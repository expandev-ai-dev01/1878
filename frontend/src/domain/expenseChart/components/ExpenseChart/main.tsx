import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/components/card';
import { Tabs, TabsList, TabsTrigger } from '@/core/components/tabs';
import { LoadingSpinner } from '@/core/components/loading-spinner';
import { Alert, AlertDescription, AlertTitle } from '@/core/components/alert';
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from '@/core/components/empty';
import { InfoIcon, PieChartIcon } from 'lucide-react';
import { useExpenseChart } from '../../hooks/useExpenseChart';
import type { ChartType } from '../../types/expenseChart';
import { PieChart } from '../PieChart';
import { BarChart } from '../BarChart';
import { DonutChart } from '../DonutChart';
import { ChartLegend } from '../ChartLegend';

interface ExpenseChartProps {
  month?: string;
}

function ExpenseChart({ month }: ExpenseChartProps) {
  const { chartData, isLoading, error } = useExpenseChart(month);
  const [chartType, setChartType] = useState<ChartType>('Pizza');

  const hasData = useMemo(() => {
    return chartData?.categories && chartData.categories.length > 0;
  }, [chartData]);

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
        <InfoIcon />
        <AlertTitle>Erro ao carregar gráfico</AlertTitle>
        <AlertDescription>
          Não foi possível carregar os dados do gráfico. Tente novamente mais tarde.
        </AlertDescription>
      </Alert>
    );
  }

  if (!hasData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gráfico de Gastos por Categoria</CardTitle>
          <CardDescription>Mês Atual</CardDescription>
        </CardHeader>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <PieChartIcon />
              </EmptyMedia>
              <EmptyTitle>Não há gastos registrados no mês atual</EmptyTitle>
              <EmptyDescription>
                Comece adicionando gastos para visualizar a distribuição por categoria
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Gráfico de Gastos por Categoria</CardTitle>
            <CardDescription>{chartData?.period || 'Mês Atual'}</CardDescription>
          </div>
          <Tabs value={chartType} onValueChange={(value) => setChartType(value as ChartType)}>
            <TabsList>
              <TabsTrigger value="Pizza">Pizza</TabsTrigger>
              <TabsTrigger value="Barras">Barras</TabsTrigger>
              <TabsTrigger value="Rosca">Rosca</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <div className="flex-1">
            {chartType === 'Pizza' && <PieChart data={chartData!} />}
            {chartType === 'Barras' && <BarChart data={chartData!} />}
            {chartType === 'Rosca' && <DonutChart data={chartData!} />}
          </div>
          <div className="lg:w-80">
            <ChartLegend data={chartData!} />
          </div>
        </div>
        <div className="flex items-center justify-between border-t pt-4">
          <span className="text-sm font-medium text-muted-foreground">Total do período</span>
          <span className="text-2xl font-bold">
            R$ {chartData?.totalAmount.toFixed(2).replace('.', ',')}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export { ExpenseChart };
