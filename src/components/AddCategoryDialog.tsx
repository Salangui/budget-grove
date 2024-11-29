import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Category } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

interface AddCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (category: Omit<Category, 'id'>, monthlyBudget: number) => void;
  initialCategory?: Category;
  currentMonthBudget?: number;
}

export const AddCategoryDialog = ({ 
  open, 
  onOpenChange, 
  onSave,
  initialCategory,
  currentMonthBudget
}: AddCategoryDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState(initialCategory?.name || '');
  const [budget, setBudget] = useState(currentMonthBudget?.toString() || '0');
  const [color, setColor] = useState(initialCategory?.color || '#0EA5E9');
  const [isHidden, setIsHidden] = useState(initialCategory?.is_hidden || false);

  useEffect(() => {
    if (initialCategory) {
      setName(initialCategory.name);
      setColor(initialCategory.color);
      setIsHidden(initialCategory.is_hidden || false);
    }
    if (currentMonthBudget !== undefined) {
      setBudget(currentMonthBudget.toString());
    }
  }, [initialCategory, currentMonthBudget]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour effectuer cette action",
        variant: "destructive"
      });
      return;
    }
    
    onSave({
      name,
      budget: 0, // This will be replaced by monthly budgets
      color,
      user_id: user.id,
      is_hidden: isHidden
    }, Number(budget));
    
    // Reset form
    if (!initialCategory) {
      setName('');
      setBudget('0');
      setColor('#0EA5E9');
      setIsHidden(false);
    }
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
          <div className="flex items-center space-x-2">
            <Switch
              id="hidden"
              checked={isHidden}
              onCheckedChange={setIsHidden}
            />
            <Label htmlFor="hidden">Masquer la catégorie</Label>
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