import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { Category, Expense } from "@/types";

export const useBudgetData = (currentMonth: string) => {
  const { user } = useAuth();

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Category[];
    },
    enabled: !!user
  });

  const expensesQuery = useQuery({
    queryKey: ['expenses', currentMonth],
    queryFn: async () => {
      const startDate = `${currentMonth}-01`;
      const lastDay = new Date(parseInt(currentMonth.split('-')[0]), parseInt(currentMonth.split('-')[1]), 0).getDate();
      const endDate = `${currentMonth}-${lastDay}`;
      
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data as Expense[];
    },
    enabled: !!user
  });

  return {
    categories: categoriesQuery.data || [],
    expenses: expensesQuery.data || [],
    isLoading: categoriesQuery.isLoading || expensesQuery.isLoading,
    error: categoriesQuery.error || expensesQuery.error,
  };
};