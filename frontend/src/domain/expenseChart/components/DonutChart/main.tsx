import { useState } from 'react';
import type { ExpenseChartData } from '../../types/expenseChart';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/core/components/tooltip';

interface DonutChartProps {
  data: ExpenseChartData;
}

function DonutChart({ data }: DonutChartProps) {
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

    const outerRadius = 45;
    const innerRadius = 25;

    const x1Outer = 50 + outerRadius * Math.cos(startRad);
    const y1Outer = 50 + outerRadius * Math.sin(startRad);
    const x2Outer = 50 + outerRadius * Math.cos(endRad);
    const y2Outer = 50 + outerRadius * Math.sin(endRad);

    const x1Inner = 50 + innerRadius * Math.cos(startRad);
    const y1Inner = 50 + innerRadius * Math.sin(startRad);
    const x2Inner = 50 + innerRadius * Math.cos(endRad);
    const y2Inner = 50 + innerRadius * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;

    const path = [
      `M ${x1Outer} ${y1Outer}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2Outer} ${y2Outer}`,
      `L ${x2Inner} ${y2Inner}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x1Inner} ${y1Inner}`,
      `Z`,
    ].join(' ');

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
        <circle cx="50" cy="50" r="25" fill="white" />
        <text
          x="50"
          y="50"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-xs font-semibold fill-foreground"
        >
          Total
        </text>
        <text
          x="50"
          y="56"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-[0.5rem] fill-muted-foreground"
        >
          R$ {data.totalAmount.toFixed(0)}
        </text>
      </svg>
    </div>
  );
}

export { DonutChart };
