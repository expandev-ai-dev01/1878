export interface Category {
  idCategory: number;
  name: string;
}

export interface Expense {
  idExpense: number;
  amount: number;
  expenseDate: string;
  description: string | null;
  idCategory: number;
  category?: Category;
}

export interface CreateExpenseDto {
  amount: number;
  expenseDate: string;
  description?: string | null;
  idCategory: number;
}
