import { Category, Expense } from '@/types';

export const mockCategories: Category[] = [
  { id: '1', name: 'Alimentation', budget: 400, color: '#EF4444', user_id: '1', is_fake: true },
  { id: '2', name: 'Transport', budget: 100, color: '#3B82F6', user_id: '1', is_fake: true },
  { id: '3', name: 'Loisirs', budget: 200, color: '#10B981', user_id: '1', is_fake: true },
  { id: '4', name: 'Shopping', budget: 150, color: '#F59E0B', user_id: '1', is_fake: true },
  { id: '5', name: 'Santé', budget: 50, color: '#6366F1', user_id: '1', is_fake: true }
];

export const mockExpenses: Expense[] = [
  { id: '1', category_id: '1', amount: 25.5, description: 'Courses', date: '2024-03-15', user_id: '1', is_fake: true },
  { id: '2', category_id: '2', amount: 15, description: 'Métro', date: '2024-03-14', user_id: '1', is_fake: true },
  { id: '3', category_id: '3', amount: 45, description: 'Cinéma', date: '2024-03-13', user_id: '1', is_fake: true },
  { id: '4', category_id: '4', amount: 89.99, description: 'Vêtements', date: '2024-03-12', user_id: '1', is_fake: true },
  { id: '5', category_id: '5', amount: 23, description: 'Pharmacie', date: '2024-03-11', user_id: '1', is_fake: true }
];