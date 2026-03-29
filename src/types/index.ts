import { Timestamp } from 'firebase/firestore';

export type Category =
  | 'vegetables'
  | 'fruit'
  | 'bread'
  | 'protein'
  | 'dry-goods'
  | 'dairy-beverage'
  | 'spices'
  | 'tea-coffee'
  | 'cleaning'
  | 'paper-household'
  | 'snacks';

export interface Household {
  id: string;
  name: string;
  members: string[];
  inviteCode: string;
  createdBy: string;
  createdAt: Timestamp;
}

export interface KnownItem {
  id: string;
  householdId: string;
  name: string;
  nameLower: string;
  category: Category;
  preferredStore: string | null;
  storeLocked: boolean;
  defaultNotes: string | null;
  defaultQuantity: number;
  unit: string | null;
  usageCount: number;
  lastUsed: Timestamp | null;
}

export interface GroceryEntry {
  id: string;
  householdId: string;
  itemId: string;
  itemName: string;
  category: Category;
  store: string | null;
  storeLocked: boolean;
  quantityNeeded: number;
  quantityOnHand: number;
  netNeeded: number;
  unit: string | null;
  notes: string | null;
  checkedOff: boolean;
  checkedOffAt: Timestamp | null;
  addedBy: string;
  addedAt: Timestamp;
}

export interface Store {
  id: string;
  householdId: string;
  name: string;
  sortOrder: number;
  addedAt: Timestamp;
}

// Phase 2 types
export interface Meal {
  id: string;
  householdId: string;
  name: string;
  ingredients: MealIngredient[];
  isFavorite: boolean;
  usageCount: number;
}

export interface MealIngredient {
  itemId: string;
  itemName: string;
  quantity: number;
  unit: string | null;
}

export interface WeekPlan {
  id: string;
  householdId: string;
  meals: string[];
  generatedAt: Timestamp | null;
}

export interface PriceEntry {
  id: string;
  householdId: string;
  itemId: string;
  store: string;
  price: number;
  quantity: number;
  unit: string | null;
  receiptDate: Timestamp;
  scannedAt: Timestamp;
}

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface ParsedItem {
  name: string;
  quantity: number;
  unit: string | null;
}
