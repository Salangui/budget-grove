import { Category, Expense, MonthlyBudget } from '@/types';

const categories: Category[] = [
  { id: '1', name: 'Alimentation', budget: 600, color: '#0EA5E9' },
  { id: '2', name: 'Transport', budget: 200, color: '#22C55E' },
  { id: '3', name: 'Loisirs', budget: 150, color: '#EAB308' },
  { id: '4', name: 'Santé', budget: 100, color: '#EC4899' },
  { id: '5', name: 'Logement', budget: 800, color: '#8B5CF6' },
];

const generateExpenses = (categoryId: string, count: number, month: string): Expense[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `${categoryId}-${i}`,
    categoryId,
    amount: Math.floor(Math.random() * 100) + 10,
    description: `Dépense ${i + 1}`,
    date: `${month}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
  }));
};

export const generateMockData = (month: string): MonthlyBudget => {
  const expenses = categories.flatMap(cat => generateExpenses(cat.id, 10, month));
  return {
    month,
    categories,
    expenses,
  };
};