import { useState } from 'react';
import { MonthPicker } from '@/components/MonthPicker';
import { BudgetSummary } from '@/components/BudgetSummary';
import { CategoryList } from '@/components/CategoryList';
import { ExpenseList } from '@/components/ExpenseList';
import { AddCategoryDialog } from '@/components/AddCategoryDialog';
import { AddExpenseDialog } from '@/components/AddExpenseDialog';
import { generateMockData } from '@/utils/mockData';
import { exportToCSV } from '@/utils/csvExport';
import { Category, Expense, MonthlyBudget } from '@/types';
import { useToast } from '@/components/ui/use-toast';

const getCurrentMonth = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

const Index = () => {
  const { toast } = useToast();
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonth());
  const [budgets, setBudgets] = useState<Record<string, MonthlyBudget>>({
    [currentMonth]: generateMockData(currentMonth)
  });
  
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category>();
  const [addExpenseOpen, setAddExpenseOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense>();

  const currentBudget = budgets[currentMonth] || generateMockData(currentMonth);

  const handleMonthChange = (month: string) => {
    setCurrentMonth(month);
    if (!budgets[month]) {
      setBudgets(prev => ({
        ...prev,
        [month]: generateMockData(month)
      }));
    }
  };

  const handleAddCategory = (categoryData: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: Math.random().toString(36).substr(2, 9)
    };

    setBudgets(prev => ({
      ...prev,
      [currentMonth]: {
        ...currentBudget,
        categories: [...currentBudget.categories, newCategory]
      }
    }));

    toast({
      title: "Catégorie créée",
      description: `La catégorie ${categoryData.name} a été créée avec succès.`
    });
  };

  const handleEditCategory = (categoryData: Omit<Category, 'id'>) => {
    if (!editingCategory) return;

    setBudgets(prev => ({
      ...prev,
      [currentMonth]: {
        ...currentBudget,
        categories: currentBudget.categories.map(cat =>
          cat.id === editingCategory.id ? { ...cat, ...categoryData } : cat
        )
      }
    }));

    toast({
      title: "Catégorie modifiée",
      description: `La catégorie ${categoryData.name} a été modifiée avec succès.`
    });
  };

  const handleAddExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: Math.random().toString(36).substr(2, 9)
    };

    setBudgets(prev => ({
      ...prev,
      [currentMonth]: {
        ...currentBudget,
        expenses: [...currentBudget.expenses, newExpense]
      }
    }));

    toast({
      title: "Dépense ajoutée",
      description: `La dépense de ${expenseData.amount}€ a été ajoutée avec succès.`
    });
  };

  const handleEditExpense = (expenseData: Omit<Expense, 'id'>) => {
    if (!editingExpense) return;

    setBudgets(prev => ({
      ...prev,
      [currentMonth]: {
        ...currentBudget,
        expenses: currentBudget.expenses.map(exp =>
          exp.id === editingExpense.id ? { ...exp, ...expenseData } : exp
        )
      }
    }));

    toast({
      title: "Dépense modifiée",
      description: `La dépense a été modifiée avec succès.`
    });
  };

  const handleExportCSV = () => {
    exportToCSV(currentBudget.expenses, currentBudget.categories);
    toast({
      title: "Export réussi",
      description: "Les dépenses ont été exportées au format CSV."
    });
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Budget Familial</h1>
        <MonthPicker 
          currentMonth={currentMonth}
          onMonthChange={handleMonthChange}
        />
      </div>

      <BudgetSummary 
        categories={currentBudget.categories}
        expenses={currentBudget.expenses}
      />

      <CategoryList 
        categories={currentBudget.categories}
        expenses={currentBudget.expenses}
        onAddCategory={() => {
          setEditingCategory(undefined);
          setAddCategoryOpen(true);
        }}
        onEditCategory={category => {
          setEditingCategory(category);
          setAddCategoryOpen(true);
        }}
      />

      <ExpenseList 
        categories={currentBudget.categories}
        expenses={currentBudget.expenses}
        onAddExpense={() => {
          setEditingExpense(undefined);
          setAddExpenseOpen(true);
        }}
        onEditExpense={expense => {
          setEditingExpense(expense);
          setAddExpenseOpen(true);
        }}
        onExportCSV={handleExportCSV}
      />

      <AddCategoryDialog 
        open={addCategoryOpen}
        onOpenChange={setAddCategoryOpen}
        onSave={editingCategory ? handleEditCategory : handleAddCategory}
        initialCategory={editingCategory}
      />

      <AddExpenseDialog 
        open={addExpenseOpen}
        onOpenChange={setAddExpenseOpen}
        onSave={editingExpense ? handleEditExpense : handleAddExpense}
        categories={currentBudget.categories}
        initialExpense={editingExpense}
      />
    </div>
  );
};

export default Index;