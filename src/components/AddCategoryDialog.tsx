import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Category } from '@/types';
import { useAuth } from '@/hooks/useAuth';

interface AddCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (category: Omit<Category, 'id'>) => void;
  initialCategory?: Category;
}

export const AddCategoryDialog = ({ 
  open, 
  onOpenChange, 
  onSave,
  initialCategory 
}: AddCategoryDialogProps) => {
  const { user } = useAuth();
  const [name, setName] = useState(initialCategory?.name || '');
  const [budget, setBudget] = useState(initialCategory?.budget.toString() || '');
  const [color, setColor] = useState(initialCategory?.color || '#0EA5E9');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    onSave({
      name,
      budget: Number(budget),
      color,
      user_id: user.id
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom</Label>
            <Input
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="budget">Budget mensuel (€)</Label>
            <Input
              id="budget"
              type="number"
              min="0"
              value={budget}
              onChange={e => setBudget(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="color">Couleur</Label>
            <Input
              id="color"
              type="color"
              value={color}
              onChange={e => setColor(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">
              {initialCategory ? 'Modifier' : 'Créer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};