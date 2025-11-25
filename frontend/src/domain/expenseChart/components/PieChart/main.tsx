import { useState } from 'react';
import type { ExpenseChartData } from '../../types/expenseChart';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/core/components/tooltip';

interface PieChartProps {
  data: ExpenseChartData;
}

function PieChart({ data }: PieChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const total = data.categories.reduce((sum, cat) => sum + cat.amount, 0);
  let currentAngle = 0;

  const slices = data.categories.map((category, index) => {
    const percentage = (category.amount / total) * 100;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (currentAngle * Math.PI) / 180;

    const x1 = 50 + 45 * Math.cos(startRad);
    const y1 = 50 + 45 * Math.sin(startRad);
    const x2 = 50 + 45 * Math.cos(endRad);
    const y2 = 50 + 45 * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;

    const path = [`M 50 50`, `L ${x1} ${y1}`, `A 45 45 0 ${largeArc} 1 ${x2} ${y2}`, `Z`].join(' ');

    return {
      path,
      category,
      index,
    };
  });

  const handleSliceClick = (index: number) => {
    setSelectedIndex(selectedIndex === index ? null : index);
  };

  return (
    <div className="flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="h-full w-full max-w-md">
        {slices.map(({ path, category, index }) => {
          const isHovered = hoveredIndex === index;
          const isSelected = selectedIndex === index;
          const isActive = isHovered || isSelected;

          return (
            <Tooltip key={category.idCategory}>
              <TooltipTrigger asChild>
                <path
                  d={path}
                  fill={category.color}
                  stroke="white"
                  strokeWidth="0.5"
                  className="cursor-pointer transition-all duration-200"
                  style={{
                    opacity: isActive ? 1 : 0.9,
                    transform: isActive ? 'scale(1.05)' : 'scale(1)',
                    transformOrigin: '50% 50%',
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => handleSliceClick(index)}
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

export { PieChart };
