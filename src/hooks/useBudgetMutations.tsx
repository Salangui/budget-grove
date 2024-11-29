import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Category, Expense } from "@/types";
import { useToast } from "@/components/ui/use-toast";

export const useBudgetMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addCategoryMutation = useMutation({
    mutationFn: async (category: Omit<Category, 'id' | 'user_id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('categories')
        .insert([category])
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
        .insert([expense])
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

  return {
    addCategoryMutation,
    updateCategoryMutation,
    addExpenseMutation,
    updateExpenseMutation
  };
};