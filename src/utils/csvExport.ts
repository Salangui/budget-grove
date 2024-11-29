import { Expense, Category } from '@/types';

export const exportToCSV = (expenses: Expense[], categories: Category[]) => {
  const categoryMap = new Map(categories.map(c => [c.id, c.name]));
  
  const csvContent = [
    ['Date', 'Catégorie', 'Description', 'Montant'].join(','),
    ...expenses.map(expense => [
      expense.date,
      categoryMap.get(expense.category_id),
      `"${expense.description.replace(/"/g, '""')}"`,
      expense.amount.toString()
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `budget_export_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
};

export const parseCSV = async (file: File, categories: Category[]): Promise<Omit<Expense, 'id' | 'user_id' | 'created_at'>[]> => {
  const text = await file.text();
  const lines = text.split('\n');
  const headers = lines[0].split(',');
  
  const categoryNameToId = new Map(categories.map(c => [c.name, c.id]));
  
  return lines.slice(1)
    .filter(line => line.trim())
    .map(line => {
      const [date, categoryName, description, amount] = line.split(',').map(field => 
        field.trim().replace(/^"(.*)"$/, '$1').replace(/""/g, '"')
      );
      
      const category_id = categoryNameToId.get(categoryName);
      if (!category_id) {
        throw new Error(`Catégorie non trouvée: ${categoryName}`);
      }
      
      return {
        date,
        category_id,
        description,
        amount: parseFloat(amount)
      };
    });
};