export interface MonthlyTotal {
  monthReference: string;
  totalCurrentMonth: number;
  totalPreviousMonth: number;
  percentageVariation: number | null;
  visualIndicator: 'green' | 'yellow' | 'red' | 'gray';
  budgetPercentage: number | null;
  budgetAmount: number | null;
}
