import { Button } from "@/components/ui/button";
import { MonthPicker } from "@/components/MonthPicker";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { generateMockData } from "@/utils/mockData";

interface BudgetHeaderProps {
  currentMonth: string;
  onMonthChange: (month: string) => void;
}

export const BudgetHeader = ({ currentMonth, onMonthChange }: BudgetHeaderProps) => {
  const { toast } = useToast();

  const generateFakeData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const mockData = generateMockData(currentMonth);
    
    // Insert fake categories
    const { error: categoriesError } = await supabase
      .from('categories')
      .insert(
        mockData.categories.map(cat => ({
          ...cat,
          user_id: user.id,
          is_fake: true
        }))
      );

    if (categoriesError) {
      toast({
        title: "Erreur",
        description: "Impossible de générer les catégories factices.",
        variant: "destructive"
      });
      return;
    }

    // Get the newly created categories to map expenses
    const { data: newCategories } = await supabase
      .from('categories')
      .select('id')
      .eq('user_id', user.id)
      .eq('is_fake', true);

    if (!newCategories) return;

    // Insert fake expenses
    const { error: expensesError } = await supabase
      .from('expenses')
      .insert(
        mockData.expenses.map((exp, index) => ({
          ...exp,
          category_id: newCategories[index % newCategories.length].id,
          user_id: user.id,
          is_fake: true
        }))
      );

    if (expensesError) {
      toast({
        title: "Erreur",
        description: "Impossible de générer les dépenses factices.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Les données factices ont été générées avec succès."
    });

    // Refresh the page to show new data
    window.location.reload();
  };

  const removeFakeData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Delete fake categories (this will cascade delete fake expenses)
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('user_id', user.id)
      .eq('is_fake', true);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer les données factices.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Les données factices ont été supprimées avec succès."
    });

    // Refresh the page to show updated data
    window.location.reload();
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <h1 className="text-3xl font-bold">Budget</h1>
      <div className="flex flex-wrap items-center gap-2">
        <MonthPicker
          value={currentMonth}
          onChange={onMonthChange}
        />
        <Button
          variant="outline"
          onClick={generateFakeData}
        >
          Générer des données factices
        </Button>
        <Button
          variant="outline"
          onClick={removeFakeData}
        >
          Supprimer les données factices
        </Button>
      </div>
    </div>
  );
};