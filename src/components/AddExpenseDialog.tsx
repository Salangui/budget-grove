import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Category, Expense } from '@/types';
import { format, addMonths, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';

interface AddExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (expense: Omit<Expense, 'id'>) => void;
  categories: Category[];
  initialExpense?: Expense;
  currentMonth: string;
}

export const AddExpenseDialog = ({ 
  open, 
  onOpenChange, 
  onSave,
  categories,
  initialExpense,
  currentMonth
}: AddExpenseDialogProps) => {
  const [category_id, setCategoryId] = useState(initialExpense?.category_id || '');
  const [amount, setAmount] = useState(initialExpense?.amount.toString() || '');
  const [description, setDescription] = useState(initialExpense?.description || '');
  const [date, setDate] = useState(initialExpense?.date || new Date().toISOString().split('T')[0]);

  // Calculer les mois disponibles
  const currentDate = new Date(`${currentMonth}-01`);
  const previousMonth = format(subMonths(currentDate, 1), 'yyyy-MM');
  const nextMonth = format(addMonths(currentDate, 1), 'yyyy-MM');

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const formatMonthOption = (monthStr: string) => {
    const date = new Date(`${monthStr}-01`);
    return format(date, 'MMMM yyyy', { locale: fr });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ajuster la date en fonction du mois sélectionné
    const [year, month] = selectedMonth.split('-');
    const [_, day] = date.split('-');
    const adjustedDate = `${year}-${month}-${day}`;

    onSave({
      category_id,
      amount: Number(amount),
      description,
      date: adjustedDate,
      user_id: initialExpense?.user_id || ''
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialExpense ? 'Modifier la dépense' : 'Nouvelle dépense'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="month">Mois</Label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le mois" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={previousMonth}>
                  {formatMonthOption(previousMonth)}
                </SelectItem>
                <SelectItem value={currentMonth}>
                  {formatMonthOption(currentMonth)}
                </SelectItem>
                <SelectItem value={nextMonth}>
                  {formatMonthOption(nextMonth)}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Catégorie</Label>
            <Select value={category_id} onValueChange={setCategoryId} required>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Montant (€)</Label>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">
              {initialExpense ? 'Modifier' : 'Créer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};