import { MonthPicker } from '@/components/MonthPicker';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface BudgetHeaderProps {
  currentMonth: string;
  onMonthChange: (month: string) => void;
}

export const BudgetHeader = ({ currentMonth, onMonthChange }: BudgetHeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">Budget Familial</h1>
      <div className="flex items-center gap-4">
        <MonthPicker 
          currentMonth={currentMonth}
          onMonthChange={onMonthChange}
        />
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Déconnexion
        </Button>
      </div>
    </div>
  );
};