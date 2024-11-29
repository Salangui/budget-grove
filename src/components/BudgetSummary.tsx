import { Card } from '@/components/ui/card';
import { Category, Expense } from '@/types';

interface BudgetSummaryProps {
  categories: Category[];
  expenses: Expense[];
}

export const BudgetSummary = ({ categories, expenses }: BudgetSummaryProps) => {
  const totalBudget = categories.reduce((sum, cat) => sum + cat.budget, 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remaining = totalBudget - totalExpenses;
  const progress = (totalExpenses / totalBudget) * 100;

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Récapitulatif Global</h2>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Budget Total</p>
          <p className="text-xl font-bold text-blue-500">{totalBudget}€</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Dépenses</p>
          <p className="text-xl font-bold text-red-500">{totalExpenses}€</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Restant</p>
          <p className="text-xl font-bold text-green-500">{remaining}€</p>
        </div>
      </div>
      <div className="relative h-2 bg-gray-200 rounded">
        <div 
          className="absolute h-full bg-blue-500 rounded"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
    </Card>
  );
};