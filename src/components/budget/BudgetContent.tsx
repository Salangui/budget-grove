import { BudgetSummary } from '@/components/BudgetSummary';
import { CategoryList } from '@/components/CategoryList';
import { ExpenseList } from '@/components/ExpenseList';
import { Category, Expense } from '@/types';

interface BudgetContentProps {
  categories: Category[];
  expenses: Expense[];
  onAddCategory: () => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (category: Category) => void;
  onAddExpense: () => void;
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (expense: Expense) => void;
  onExportCSV: () => void;
  onImportCSV: (file: File) => void;
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
  onImportCSV
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
        onDeleteCategory={onDeleteCategory}
      />

      <ExpenseList 
        categories={categories}
        expenses={expenses}
        onAddExpense={onAddExpense}
        onEditExpense={onEditExpense}
        onDeleteExpense={onDeleteExpense}
        onExportCSV={onExportCSV}
        onImportCSV={onImportCSV}
      />
    </>
  );
};