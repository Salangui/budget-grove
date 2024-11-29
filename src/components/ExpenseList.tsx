import { Plus, Trash2, Upload } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Category, Expense } from '@/types';
import { Input } from './ui/input';
import { useToast } from './ui/use-toast';
import { useRef } from 'react';

interface ExpenseListProps {
  expenses: Expense[];
  categories: Category[];
  onAddExpense: () => void;
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (expense: Expense) => void;
  onExportCSV: () => void;
  onImportCSV: (file: File) => void;
}

export const ExpenseList = ({ 
  expenses, 
  categories, 
  onAddExpense, 
  onEditExpense,
  onDeleteExpense,
  onExportCSV,
  onImportCSV
}: ExpenseListProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || '';
  };

  const getCategoryColor = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.color || '#000';
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/csv') {
      toast({
        title: "Erreur",
        description: "Le fichier doit être au format CSV",
        variant: "destructive"
      });
      return;
    }

    onImportCSV(file);
    event.target.value = '';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Dépenses</h2>
        <div className="space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv"
            className="hidden"
          />
          <Button variant="outline" onClick={handleImportClick}>
            <Upload className="h-4 w-4 mr-2" />
            Importer CSV
          </Button>
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
        {expenses.map(expense => (
          <div 
            key={expense.id}
            className="p-4 hover:bg-gray-50"
          >
            <div className="flex justify-between items-center">
              <div 
                className="flex-1 cursor-pointer"
                onClick={() => onEditExpense(expense)}
              >
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: getCategoryColor(expense.category_id) }}
                  />
                  <div>
                    <p className="font-medium">{expense.description}</p>
                    <p className="text-sm text-gray-500">
                      {getCategoryName(expense.category_id)} • 
                      {new Date(expense.date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="font-medium">{expense.amount}€</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteExpense(expense)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
};
