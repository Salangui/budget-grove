import { Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Category, Expense } from '@/types';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategoryListProps {
  categories: Category[];
  expenses: Expense[];
  onAddCategory: () => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory?: (category: Category) => void;
  monthlyBudgets: any[];
}

export const CategoryList = ({ 
  categories, 
  expenses, 
  onAddCategory, 
  onEditCategory,
  onDeleteCategory,
  monthlyBudgets
}: CategoryListProps) => {
  const getCategoryExpenses = (categoryId: string | undefined) => {
    if (!categoryId) return 0;
    return expenses.filter(e => e.category_id === categoryId)
      .reduce((sum, exp) => sum + exp.amount, 0);
  };

  const getCategoryBudget = (categoryId: string | undefined) => {
    if (!categoryId) return 0;
    return monthlyBudgets.find(mb => mb.category_id === categoryId)?.budget || 0;
  };

  const handleEditCategory = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      onEditCategory(category);
    }
  };

  const handleDeleteCategory = (category: Category | undefined) => {
    if (!category?.id || !onDeleteCategory) return;
    onDeleteCategory(category);
  };

  // Filter out invalid categories
  const validCategories = categories.filter(category => 
    category && 
    typeof category.id === 'string' && 
    category.id.length > 0
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Catégories</h2>
        <div className="flex gap-2">
          <div className="w-64">
            <Select onValueChange={handleEditCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Modifier une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {validCategories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={onAddCategory}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle catégorie
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {validCategories.map(category => {
          const spent = getCategoryExpenses(category.id);
          const budget = getCategoryBudget(category.id);
          const progress = (spent / budget) * 100;
          const isOverBudget = spent > budget;
          
          return (
            <Card 
              key={category.id}
              className={cn(
                "p-3 hover:shadow-lg transition-shadow",
                isOverBudget && "border-red-500",
                category.is_hidden && "opacity-50"
              )}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  />
                  <h3 className="font-semibold truncate">{category.name}</h3>
                  {category.is_hidden ? (
                    <EyeOff className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  )}
                </div>
                {onDeleteCategory && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteCategory(category)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Budget:</span>
                  <span className={cn(
                    "font-medium",
                    isOverBudget && "text-red-500"
                  )}>{budget}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Dépensé:</span>
                  <span className={cn(
                    "font-medium",
                    isOverBudget && "text-red-500"
                  )}>{spent}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Restant:</span>
                  <span className={cn(
                    "font-medium",
                    isOverBudget && "text-red-500"
                  )}>{budget - spent}€</span>
                </div>
                <div className="relative h-1.5 bg-gray-200 rounded">
                  <div 
                    className={cn(
                      "absolute h-full rounded",
                      isOverBudget ? "bg-red-500" : ""
                    )}
                    style={{ 
                      width: `${Math.min(progress, 100)}%`,
                      backgroundColor: isOverBudget ? undefined : category.color
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