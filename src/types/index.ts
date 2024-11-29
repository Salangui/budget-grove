export interface Category {
  id: string;
  name: string;
  budget: number;
  color: string;
  user_id: string;
  created_at?: string;
  is_fake?: boolean;
  is_hidden?: boolean;
}

export interface Expense {
  id: string;
  category_id: string;
  amount: number;
  description: string;
  date: string;
  user_id: string;
  created_at?: string;
  is_fake?: boolean;
}

export interface MonthlyBudget {
  month: string; // Format: YYYY-MM
  categories: Category[];
  expenses: Expense[];
}