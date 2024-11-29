import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useMonthlyBudgets = (currentMonth: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const monthlyBudgetsQuery = useQuery({
    queryKey: ['monthly-budgets', currentMonth],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('monthly_budgets')
        .select('*')
        .eq('month', currentMonth);
      
      if (error) throw error;
      return data;
    }
  });

  const addMonthlyBudgetMutation = useMutation({
    mutationFn: async ({ category_id, budget, user_id }: { category_id: string, budget: number, user_id: string }) => {
      const { data, error } = await supabase
        .from('monthly_budgets')
        .upsert({
          category_id,
          month: currentMonth,
          budget,
          user_id
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monthly-budgets'] });
    }
  });

  return {
    monthlyBudgets: monthlyBudgetsQuery.data || [],
    isLoading: monthlyBudgetsQuery.isLoading,
    addMonthlyBudget: addMonthlyBudgetMutation.mutateAsync
  };
};