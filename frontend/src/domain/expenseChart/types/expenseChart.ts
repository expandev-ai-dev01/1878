export interface CategoryExpense {
  idCategory: number;
  name: string;
  icon: string;
  color: string;
  amount: number;
  percentage: number;
  isOthers: boolean;
}

export interface ExpenseChartData {
  period: string;
  totalAmount: number;
  categories: CategoryExpense[];
  timestamp: string;
}

export type ChartType = 'Pizza' | 'Barras' | 'Rosca';
