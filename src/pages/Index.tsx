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

  const handleAddCategory = async (categoryData: Omit<Category, 'id' | 'user_id' | 'created_at'>) => {
    if (!profile) {
      toast({
        title: "Erreur",
        description: "Votre profil n'est pas encore créé. Veuillez réessayer.",
        variant: "destructive"
      });
      return;
    }
    await addCategoryMutation.mutateAsync(categoryData);
  };

  const handleEditCategory = async (categoryData: Omit<Category, 'id' | 'user_id' | 'created_at'>) => {
    if (!editingCategory) return;
    await updateCategoryMutation.mutateAsync({ ...categoryData, id: editingCategory.id, user_id: user?.id || '' });
  };

  const handleAddExpense = async (expenseData: Omit<Expense, 'id' | 'user_id' | 'created_at'>) => {
    await addExpenseMutation.mutateAsync(expenseData);
  };

  const handleEditExpense = async (expenseData: Omit<Expense, 'id' | 'user_id' | 'created_at'>) => {
    if (!editingExpense) return;
    await updateExpenseMutation.mutateAsync({ ...expenseData, id: editingExpense.id, user_id: user?.id || '' });
  };

  const handleExportCSV = () => {
    // Export logic here
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
        categories={categories}
        initialExpense={editingExpense}
      />
    </div>
  );
};

export default Index;
