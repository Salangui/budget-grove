import { Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Category, Expense } from '@/types';

interface ExpenseListProps {
  expenses: Expense[];
  categories: Category[];
  onAddExpense: () => void;
  onEditExpense: (expense: Expense) => void;
  onExportCSV: () => void;
}

export const ExpenseList = ({ 
  expenses, 
  categories, 
  onAddExpense, 
  onEditExpense,
  onExportCSV 
}: ExpenseListProps) => {
  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || '';
  };

  const getCategoryColor = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.color || '#000';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Dépenses</h2>
        <div className="space-x-2">
          <Button variant="outline" onClick={onExportCSV}>
            Exporter CSV
          </Button>
          <Button onClick={onAddExpense}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle dépense
          </Button>
        </div>
      </div>
      <Card className="divide-y">
        {expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .map(expense => (
            <div 
              key={expense.id}
              className="p-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => onEditExpense(expense)}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: getCategoryColor(expense.categoryId) }}
                  />
                  <div>
                    <p className="font-medium">{expense.description}</p>
                    <p className="text-sm text-gray-500">
                      {getCategoryName(expense.categoryId)} • 
                      {new Date(expense.date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                <span className="font-medium">{expense.amount}€</span>
              </div>
            </div>
          ))}
      </Card>
    </div>
  );
};