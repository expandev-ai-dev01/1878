import type { ExpenseChartData } from '../../types/expenseChart';
import { ScrollArea } from '@/core/components/scroll-area';
import { Badge } from '@/core/components/badge';

interface ChartLegendProps {
  data: ExpenseChartData;
}

function ChartLegend({ data }: ChartLegendProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="font-semibold">Categorias</h3>
        <p className="text-sm text-muted-foreground">
          {data.categories.length} categoria{data.categories.length !== 1 ? 's' : ''}
        </p>
      </div>
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-3">
          {data.categories.map((category) => (
            <div
              key={category.idCategory}
              className="flex items-start justify-between gap-3 rounded-lg border p-3 transition-colors hover:bg-accent"
            >
              <div className="flex items-start gap-3">
                <div
                  className="mt-0.5 h-4 w-4 shrink-0 rounded-sm"
                  style={{ backgroundColor: category.color }}
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium leading-none">{category.name}</p>
                    {category.isOthers && (
                      <Badge variant="secondary" className="text-xs">
                        Outros
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    R$ {category.amount.toFixed(2).replace('.', ',')}
                  </p>
                </div>
              </div>
              <span className="text-sm font-semibold">{category.percentage.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

export { ChartLegend };
