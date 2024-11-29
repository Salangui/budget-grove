import { BudgetSummary } from '@/components/BudgetSummary';
import { CategoryList } from '@/components/CategoryList';
import { ExpenseList } from '@/components/ExpenseList';
import { Category, Expense } from '@/types';

interface BudgetContentProps {
  categories: Category[];
  expenses: Expense[];
  onAddCategory: () => void;
  onEditCategory: (category: Category) => void;
  onAddExpense: () => void;
  onEditExpense: (expense: Expense) => void;
  onExportCSV: () => void;
}

export const BudgetContent = ({
  categories,
  expenses,
  onAddCategory,
  onEditCategory,
  onAddExpense,
  onEditExpense,
  onExportCSV
}: BudgetContentProps) => {
  return (
    <>
      <BudgetSummary 
        categories={categories}
        expenses={expenses}
      />

      <CategoryList 
        categories={categories}
        expenses={expenses}
        onAddCategory={onAddCategory}
        onEditCategory={onEditCategory}
      />

      <ExpenseList 
        categories={categories}
        expenses={expenses}
        onAddExpense={onAddExpense}
        onEditExpense={onEditExpense}
        onExportCSV={onExportCSV}
      />
    </>
  );
};