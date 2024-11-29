import { Expense, Category } from '@/types';

export const exportToCSV = (expenses: Expense[], categories: Category[]) => {
  const categoryMap = new Map(categories.map(c => [c.id, c.name]));
  
  const csvContent = [
    ['Date', 'Catégorie', 'Description', 'Montant'].join(','),
    ...expenses.map(expense => [
      expense.date,
      categoryMap.get(expense.category_id),
      expense.description,
      expense.amount.toString()
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'budget_export.csv';
  link.click();
};