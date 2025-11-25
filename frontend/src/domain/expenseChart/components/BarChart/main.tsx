import { useState } from 'react';
import type { ExpenseChartData } from '../../types/expenseChart';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/core/components/tooltip';

interface BarChartProps {
  data: ExpenseChartData;
}

function BarChart({ data }: BarChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const maxAmount = Math.max(...data.categories.map((cat) => cat.amount));
  const barHeight = 100 / data.categories.length;
  const padding = 10;

  return (
    <div className="flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="h-full w-full max-w-2xl">
        {data.categories.map((category, index) => {
          const barWidth = (category.amount / maxAmount) * 80;
          const y = index * barHeight + padding / 2;
          const isHovered = hoveredIndex === index;
          const isSelected = selectedIndex === index;
          const isActive = isHovered || isSelected;

          return (
            <Tooltip key={category.idCategory}>
              <TooltipTrigger asChild>
                <rect
                  x="10"
                  y={y}
                  width={barWidth}
                  height={barHeight - padding}
                  fill={category.color}
                  className="cursor-pointer transition-all duration-200"
                  style={{
                    opacity: isActive ? 1 : 0.9,
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => setSelectedIndex(selectedIndex === index ? null : index)}
                />
              </TooltipTrigger>
              <TooltipContent>
                <div className="space-y-1">
                  <p className="font-semibold">{category.name}</p>
                  <p className="text-sm">R$ {category.amount.toFixed(2).replace('.', ',')}</p>
                  <p className="text-sm text-muted-foreground">{category.percentage.toFixed(1)}%</p>
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </svg>
    </div>
  );
}

export { BarChart };
