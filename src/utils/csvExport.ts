import { Expense, Category } from '@/types';

export const exportToCSV = (expenses: Expense[], categories: Category[], monthlyBudgets: any[]) => {
  // Export expenses
  const categoryMap = new Map(categories.map(c => [c.id, c.name]));
  
  const expensesContent = [
    ['Date', 'Catégorie', 'Description', 'Montant'].join(','),
    ...expenses.map(expense => [
      expense.date,
      categoryMap.get(expense.category_id),
      `"${expense.description.replace(/"/g, '""')}"`,
      expense.amount.toString()
    ].join(','))
  ].join('\n');

  // Export categories and budgets
  const categoriesContent = [
    ['Nom', 'Budget', 'Couleur', 'Masquée'].join(','),
    ...categories.map(category => {
      const monthlyBudget = monthlyBudgets.find(mb => mb.category_id === category.id);
      return [
        `"${category.name.replace(/"/g, '""')}"`,
        monthlyBudget?.budget.toString() || '0',
        category.color,
        category.is_hidden ? 'true' : 'false'
      ].join(',');
    })
  ].join('\n');

  const blob = new Blob([
    'CATEGORIES\n',
    categoriesContent,
    '\n\nDEPENSES\n',
    expensesContent
  ], { type: 'text/csv;charset=utf-8;' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `budget_export_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
};

export const parseCSV = async (file: File, categories: Category[]): Promise<{
  expenses: Omit<Expense, 'id' | 'user_id' | 'created_at'>[],
  categories: Omit<Category, 'id' | 'user_id' | 'created_at'>[]
}> => {
  const text = await file.text();
  const sections = text.split('\n\n');
  
  const categorySection = sections.find(s => s.startsWith('CATEGORIES'))?.split('\n').slice(2) || [];
  const expenseSection = sections.find(s => s.startsWith('DEPENSES'))?.split('\n').slice(2) || [];
  
  const categoryNameToId = new Map(categories.map(c => [c.name, c.id]));
  
  const parsedCategories = categorySection
    .filter(line => line.trim())
    .map(line => {
      const [name, budget, color, isHidden] = line.split(',').map(field => 
        field.trim().replace(/^"(.*)"$/, '$1').replace(/""/g, '"')
      );
      
      return {
        name,
        budget: parseFloat(budget),
        color,
        is_hidden: isHidden === 'true'
      };
    });

  const parsedExpenses = expenseSection
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

  return {
    expenses: parsedExpenses,
    categories: parsedCategories
  };
};