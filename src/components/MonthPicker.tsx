import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MonthPickerProps {
  currentMonth: string;
  onMonthChange: (month: string) => void;
}

export const MonthPicker = ({ currentMonth, onMonthChange }: MonthPickerProps) => {
  const date = new Date(currentMonth + '-01');
  
  const changeMonth = (offset: number) => {
    const newDate = new Date(date);
    newDate.setMonth(date.getMonth() + offset);
    onMonthChange(`${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}`);
  };

  return (
    <div className="flex items-center gap-4">
      <Button variant="outline" size="icon" onClick={() => changeMonth(-1)}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-lg font-medium">
        {date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
      </span>
      <Button variant="outline" size="icon" onClick={() => changeMonth(1)}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};