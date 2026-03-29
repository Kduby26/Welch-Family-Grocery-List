import { Category } from '@/types';

export interface CategoryInfo {
  id: Category;
  label: string;
  emoji: string;
  color: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { id: 'vegetables', label: 'Vegetables', emoji: '🥬', color: '#22c55e' },
  { id: 'fruit', label: 'Fruit', emoji: '🍎', color: '#ef4444' },
  { id: 'bread', label: 'Bread', emoji: '🍞', color: '#f59e0b' },
  { id: 'protein', label: 'Protein', emoji: '🥩', color: '#dc2626' },
  { id: 'dry-goods', label: 'Dry Goods', emoji: '🫘', color: '#a16207' },
  { id: 'dairy-beverage', label: 'Dairy & Beverage', emoji: '🥛', color: '#3b82f6' },
  { id: 'spices', label: 'Spices', emoji: '🧂', color: '#d97706' },
  { id: 'tea-coffee', label: 'Tea & Coffee', emoji: '☕', color: '#78350f' },
  { id: 'cleaning', label: 'Cleaning', emoji: '🧹', color: '#06b6d4' },
  { id: 'paper-household', label: 'Paper & Household', emoji: '🧻', color: '#8b5cf6' },
  { id: 'snacks', label: 'Snacks', emoji: '🍿', color: '#f97316' },
];

export const CATEGORY_MAP = new Map(CATEGORIES.map((c) => [c.id, c]));

export function getCategoryInfo(category: Category): CategoryInfo {
  return CATEGORY_MAP.get(category) ?? CATEGORIES[0];
}
