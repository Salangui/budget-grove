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

  const addCategoryMutation = useMutation({
    mutationFn: async (category: Omit<Category, 'id' | 'user_id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('categories')
        .insert([{ ...category, user_id: user?.id }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Catégorie créée",
        description: "La catégorie a été créée avec succès."
      });
    }
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, ...category }: Category) => {
      const { data, error } = await supabase
        .from('categories')
        .update(category)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Catégorie modifiée",
        description: "La catégorie a été modifiée avec succès."
      });
    }
  });

  const addExpenseMutation = useMutation({
    mutationFn: async (expense: Omit<Expense, 'id' | 'user_id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('expenses')
        .insert([{ ...expense, user_id: user?.id }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast({
        title: "Dépense ajoutée",
        description: "La dépense a été ajoutée avec succès."
      });
    }
  });

  const updateExpenseMutation = useMutation({
    mutationFn: async ({ id, ...expense }: Expense) => {
      const { data, error } = await supabase
        .from('expenses')
        .update(expense)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast({
        title: "Dépense modifiée",
        description: "La dépense a été modifiée avec succès."
      });
    }
  });

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
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la catégorie car elle contient des dépenses.",
        variant: "destructive"
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
    mutationFn: async (expenses: Omit<Expense, 'id' | 'user_id' | 'created_at'>[]) => {
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
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'import.",
        variant: "destructive"
      });
    }
  });

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
      const parsedExpenses = await parseCSV(file, categories);
      await importExpensesMutation.mutateAsync(parsedExpenses);
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
