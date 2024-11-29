import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Category, Expense } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "./useAuth";

export const useBudgetMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const addCategoryMutation = useMutation({
    mutationFn: async (category: Omit<Category, 'id' | 'created_at'>) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('categories')
        .insert([{ ...category, user_id: user.id }])
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
    mutationFn: async (expense: Omit<Expense, 'id' | 'created_at'>) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('expenses')
        .insert([{ ...expense, user_id: user.id }])
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

  const deleteExpenseMutation = useMutation({
    mutationFn: async (expense: Expense) => {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', expense.id);
      
      if (error) throw error;
      return expense;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast({
        title: "Dépense supprimée",
        description: "La dépense a été supprimée avec succès."
      });
    }
  });

  return {
    addCategoryMutation,
    updateCategoryMutation,
    addExpenseMutation,
    updateExpenseMutation,
    deleteExpenseMutation
  };
};