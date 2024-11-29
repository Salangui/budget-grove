import { useState } from 'react';
import { AddCategoryDialog } from '@/components/AddCategoryDialog';
import { AddExpenseDialog } from '@/components/AddExpenseDialog';
import { BudgetHeader } from '@/components/budget/BudgetHeader';
import { BudgetContent } from '@/components/budget/BudgetContent';
import { Category, Expense } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useBudgetData } from '@/hooks/useBudgetData';
import { useBudgetMutations } from '@/hooks/useBudgetMutations';
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
  const { 
    addCategoryMutation, 
    updateCategoryMutation,
    addExpenseMutation,
    updateExpenseMutation 
  } = useBudgetMutations();

  const deleteCategoryMutation = useMutation({
    mutationFn: async (category: Category) => {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', category.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Catégorie supprimée",
        description: "La catégorie a été supprimée avec succès."
      });
    }
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: async (expense: Expense) => {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', expense.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast({
        title: "Dépense supprimée",
        description: "La dépense a été supprimée avec succès."
      });
    }
  });

  const importExpensesMutation = useMutation({
    mutationFn: async (expenses: Omit<Expense, 'id' | 'created_at'>[]) => {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('expenses')
        .insert(expenses.map(expense => ({
          ...expense,
          user_id: user.id
        })));
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast({
        title: "Import réussi",
        description: "Les dépenses ont été importées avec succès."
      });
    }
  });

  const handleAddCategory = async (category: Omit<Category, 'id'>) => {
    await addCategoryMutation.mutateAsync(category);
    setAddCategoryOpen(false);
  };

  const handleEditCategory = async (category: Category) => {
    await updateCategoryMutation.mutateAsync(category);
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

  const handleDeleteCategory = async (category: Category) => {
    const hasExpenses = expenses.some(e => e.category_id === category.id);
    if (hasExpenses) {
      toast({
        title: "Action impossible",
        description: "Vous devez d'abord supprimer ou déplacer les dépenses de cette catégorie.",
        variant: "destructive"
      });
      return;
    }
    await deleteCategoryMutation.mutateAsync(category);
  };

  const handleDeleteExpense = async (expense: Expense) => {
    await deleteExpenseMutation.mutateAsync(expense);
  };

  const handleExportCSV = () => {
    exportToCSV(expenses, categories);
  };

  const handleImportCSV = async (file: File) => {
    try {
      if (!user) throw new Error('User not authenticated');
      const parsedExpenses = await parseCSV(file, categories);
      const expensesWithUserId = parsedExpenses.map(expense => ({
        ...expense,
        user_id: user.id
      }));
      await importExpensesMutation.mutateAsync(expensesWithUserId);
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de l'import",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <BudgetHeader 
        currentMonth={currentMonth}
        onMonthChange={setCurrentMonth}
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
        onDeleteCategory={handleDeleteCategory}
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
        categories={categories}
        initialExpense={editingExpense}
      />
    </div>
  );
};

export default Index;