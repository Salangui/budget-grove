import { BudgetSummary } from '@/components/BudgetSummary';
import { CategoryList } from '@/components/CategoryList';
import { ExpenseList } from '@/components/ExpenseList';
import { Category, Expense } from '@/types';

interface BudgetContentProps {
  categories: Category[];
  expenses: Expense[];
  onAddCategory: () => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory?: (category: Category) => void;
  onAddExpense: () => void;
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (expense: Expense) => void;
  onExportCSV: () => void;
  onImportCSV: (file: File) => void;
  monthlyBudgets: any[];
}

export const BudgetContent = ({
  categories,
  expenses,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onAddExpense,
  onEditExpense,
  onDeleteExpense,
  onExportCSV,
  onImportCSV,
  monthlyBudgets
}: BudgetContentProps) => {
  // On affiche toutes les catégories dans la liste mais on filtre les dépenses
  const visibleCategories = categories;
  const visibleExpenses = expenses.filter(e => 
    categories.some(c => c.id === e.category_id && !c.is_hidden)
  );

  const getCategoryBudget = (categoryId: string) => {
    return monthlyBudgets.find(mb => mb.category_id === categoryId)?.budget || 0;
  };

  const categoriesWithBudgets = visibleCategories.map(category => ({
    ...category,
    budget: getCategoryBudget(category.id)
  }));

  return (
    <div className="space-y-8">
      <BudgetSummary 
        categories={categoriesWithBudgets.filter(c => !c.is_hidden)}
        expenses={visibleExpenses}
      />

      <CategoryList 
        categories={categories}
        expenses={expenses}
        onAddCategory={onAddCategory}
        onEditCategory={onEditCategory}
        onDeleteCategory={onDeleteCategory}
        monthlyBudgets={monthlyBudgets}
      />

      <ExpenseList 
        categories={categories.filter(c => !c.is_hidden)}
        expenses={visibleExpenses}
        onAddExpense={onAddExpense}
        onEditExpense={onEditExpense}
        onDeleteExpense={onDeleteExpense}
        onExportCSV={onExportCSV}
        onImportCSV={onImportCSV}
      />
    </div>
  );
};