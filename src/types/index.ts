export interface Category {
  id: string;
  name: string;
  budget: number;
  color: string;
}

export interface Expense {
  id: string;
  categoryId: string;
  amount: number;
  description: string;
  date: string;
}

export interface MonthlyBudget {
  month: string; // Format: YYYY-MM
  categories: Category[];
  expenses: Expense[];
}