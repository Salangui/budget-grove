import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Category, Expense } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface QuickExpenseFormProps {
  categories: Category[];
  onSave: (expense: Omit<Expense, 'id'>) => void;
  currentMonth: string;
}

export const QuickExpenseForm = ({ categories, onSave, currentMonth }: QuickExpenseFormProps) => {
  const [category_id, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const visibleCategories = categories.filter(c => !c.is_hidden);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      category_id,
      amount: Number(amount),
      description,
      date,
      user_id: ''
    });
    // Reset form
    setCategoryId('');
    setAmount('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-lg shadow-sm mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quick-category">Catégorie</Label>
          <Select value={category_id} onValueChange={setCategoryId} required>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une catégorie" />
            </SelectTrigger>
            <SelectContent>
              {visibleCategories.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="quick-amount">Montant (€)</Label>
          <Input
            id="quick-amount"
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            required
            className="w-full"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="quick-description">Description</Label>
          <Input
            id="quick-description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            className="w-full"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="quick-date">Date</Label>
          <Input
            id="quick-date"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
            className="w-full"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" className="w-full md:w-auto">
          Ajouter la dépense
        </Button>
      </div>
    </form>
  );
};