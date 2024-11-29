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
  onDeleteExpense?: (expense: Expense) => void;
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
  const visibleCategories = categories.filter(c => !c.is_hidden);
  const visibleExpenses = expenses.filter(e => 
    visibleCategories.some(c => c.id === e.category_id)
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
        categories={categoriesWithBudgets}
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
        categories={visibleCategories}
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