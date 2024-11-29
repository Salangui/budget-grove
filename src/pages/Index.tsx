import { useState } from 'react';
import { AddCategoryDialog } from '@/components/AddCategoryDialog';
import { AddExpenseDialog } from '@/components/AddExpenseDialog';
import { BudgetHeader } from '@/components/budget/BudgetHeader';
import { BudgetContent } from '@/components/budget/BudgetContent';
import { QuickExpenseForm } from '@/components/QuickExpenseForm';
import { Category, Expense } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useBudgetData } from '@/hooks/useBudgetData';
import { useBudgetMutations } from '@/hooks/useBudgetMutations';
import { useMonthlyBudgets } from '@/hooks/useMonthlyBudgets';
import { exportToCSV, parseCSV } from '@/utils/csvExport';

const getCurrentMonth = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

const Index = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonth());
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category>();
  const [addExpenseOpen, setAddExpenseOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense>();

  const { categories, expenses } = useBudgetData(currentMonth);
  const { monthlyBudgets, addMonthlyBudget } = useMonthlyBudgets(currentMonth);
  const { 
    addCategoryMutation, 
    updateCategoryMutation,
    addExpenseMutation,
    updateExpenseMutation,
    deleteExpenseMutation 
  } = useBudgetMutations();

  const handleAddCategory = async (category: Omit<Category, 'id'>, monthlyBudget: number) => {
    const newCategory = await addCategoryMutation.mutateAsync(category);
    if (newCategory && user) {
      await addMonthlyBudget({
        category_id: newCategory.id,
        budget: monthlyBudget,
        user_id: user.id
      });
    }
    setAddCategoryOpen(false);
  };

  const handleEditCategory = async (category: Category, monthlyBudget: number) => {
    await updateCategoryMutation.mutateAsync(category);
    if (user) {
      await addMonthlyBudget({
        category_id: category.id,
        budget: monthlyBudget,
        user_id: user.id
      });
    }
    setAddCategoryOpen(false);
    setEditingCategory(undefined);
  };

  const handleAddExpense = async (expense: Omit<Expense, 'id'>) => {
    await addExpenseMutation.mutateAsync(expense);
    setAddExpenseOpen(false);
  };

  const handleEditExpense = async (expense: Expense) => {
    await updateExpenseMutation.mutateAsync(expense);
    setAddExpenseOpen(false);
    setEditingExpense(undefined);
  };

  const handleDeleteExpense = async (expense: Expense) => {
    if (!expense?.id) return;
    await deleteExpenseMutation.mutateAsync(expense);
  };

  const handleExportCSV = () => {
    exportToCSV(expenses, categories, monthlyBudgets);
  };

  const handleImportCSV = async (file: File) => {
    try {
      if (!user) throw new Error('User not authenticated');
      const { expenses: parsedExpenses, categories: parsedCategories } = await parseCSV(file, categories);
      
      // Import categories first
      for (const category of parsedCategories) {
        const newCategory = await addCategoryMutation.mutateAsync({
          ...category,
          user_id: user.id
        });
        
        if (newCategory) {
          await addMonthlyBudget({
            category_id: newCategory.id,
            budget: category.budget,
            user_id: user.id
          });
        }
      }
      
      // Then import expenses
      for (const expense of parsedExpenses) {
        await addExpenseMutation.mutateAsync({
          ...expense,
          user_id: user.id
        });
      }
      
      toast({
        title: "Import réussi",
        description: "Les données ont été importées avec succès."
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de l'import",
        variant: "destructive"
      });
    }
  };

  const getCurrentBudget = (categoryId: string) => {
    return monthlyBudgets.find(mb => mb.category_id === categoryId)?.budget || 0;
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <BudgetHeader 
        currentMonth={currentMonth}
        onMonthChange={setCurrentMonth}
      />

      <QuickExpenseForm
        categories={categories}
        onSave={handleAddExpense}
        currentMonth={currentMonth}
      />

      <BudgetContent 
        categories={categories}
        expenses={expenses}
        onAddCategory={() => {
          setEditingCategory(undefined);
          setAddCategoryOpen(true);
        }}
        onEditCategory={category => {
          setEditingCategory(category);
          setAddCategoryOpen(true);
        }}
        onAddExpense={() => {
          setEditingExpense(undefined);
          setAddExpenseOpen(true);
        }}
        onEditExpense={expense => {
          setEditingExpense(expense);
          setAddExpenseOpen(true);
        }}
        onDeleteExpense={handleDeleteExpense}
        onExportCSV={handleExportCSV}
        onImportCSV={handleImportCSV}
        monthlyBudgets={monthlyBudgets}
      />

      <AddCategoryDialog 
        open={addCategoryOpen}
        onOpenChange={setAddCategoryOpen}
        onSave={editingCategory ? handleEditCategory : handleAddCategory}
        initialCategory={editingCategory}
        currentMonthBudget={editingCategory ? getCurrentBudget(editingCategory.id) : undefined}
      />

      <AddExpenseDialog 
        open={addExpenseOpen}
        onOpenChange={setAddExpenseOpen}
        onSave={editingExpense ? handleEditExpense : handleAddExpense}
        categories={categories}
        initialExpense={editingExpense}
        currentMonth={currentMonth}
      />
    </div>
  );
};

export default Index;
