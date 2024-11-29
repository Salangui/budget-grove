import { Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Category, Expense } from '@/types';

interface CategoryListProps {
  categories: Category[];
  expenses: Expense[];
  onAddCategory: () => void;
  onEditCategory: (category: Category) => void;
}

export const CategoryList = ({ categories, expenses, onAddCategory, onEditCategory }: CategoryListProps) => {
  const getCategoryExpenses = (categoryId: string) => {
    return expenses.filter(e => e.category_id === categoryId)
      .reduce((sum, exp) => sum + exp.amount, 0);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Catégories</h2>
        <Button onClick={onAddCategory}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle catégorie
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(category => {
          const spent = getCategoryExpenses(category.id);
          const progress = (spent / category.budget) * 100;
          
          return (
            <Card 
              key={category.id}
              className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => onEditCategory(category)}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">{category.name}</h3>
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: category.color }}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Budget:</span>
                  <span className="font-medium">{category.budget}€</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Dépensé:</span>
                  <span className="font-medium">{spent}€</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Restant:</span>
                  <span className="font-medium">{category.budget - spent}€</span>
                </div>
                <div className="relative h-2 bg-gray-200 rounded">
                  <div 
                    className="absolute h-full rounded"
                    style={{ 
                      width: `${Math.min(progress, 100)}%`,
                      backgroundColor: category.color
                    }}
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};