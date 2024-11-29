import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface MonthPickerProps {
  currentMonth: string;
  onMonthChange: (month: string) => void;
}

export const MonthPicker = ({ currentMonth, onMonthChange }: MonthPickerProps) => {
  const date = new Date(`${currentMonth}-01`);

  const handlePreviousMonth = () => {
    date.setMonth(date.getMonth() - 1);
    onMonthChange(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`);
  };

  const handleNextMonth = () => {
    date.setMonth(date.getMonth() + 1);
    onMonthChange(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`);
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="min-w-[120px] text-center">
        {date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
      </span>
      <Button variant="outline" size="icon" onClick={handleNextMonth}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};