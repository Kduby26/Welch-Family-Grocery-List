import {
  collection,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  increment,
} from 'firebase/firestore';
import { db as _db } from '@/config/firebase';

const db = _db!;
import { KnownItem, Category } from '@/types';

function itemsRef(householdId: string) {
  return collection(db, 'households', householdId, 'items');
}

export function subscribeToItems(
  householdId: string,
  callback: (items: KnownItem[]) => void
) {
  const q = query(itemsRef(householdId), orderBy('name'));
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map(
      (d) => ({ id: d.id, ...d.data() }) as KnownItem
    );
    callback(items);
  });
}

export async function addKnownItem(
  householdId: string,
  data: {
    name: string;
    category: Category;
    preferredStore?: string | null;
    defaultNotes?: string | null;
    defaultQuantity?: number;
    unit?: string | null;
  }
): Promise<string> {
  const ref = doc(itemsRef(householdId));
  await setDoc(ref, {
    householdId,
    name: data.name,
    nameLower: data.name.toLowerCase(),
    category: data.category,
    preferredStore: data.preferredStore ?? null,
    storeLocked: false,
    defaultNotes: data.defaultNotes ?? null,
    defaultQuantity: data.defaultQuantity ?? 1,
    unit: data.unit ?? null,
    usageCount: 0,
    lastUsed: null,
  });
  return ref.id;
}

export async function updateKnownItem(
  householdId: string,
  itemId: string,
  data: Partial<
    Pick<
      KnownItem,
      | 'name'
      | 'category'
      | 'preferredStore'
      | 'storeLocked'
      | 'defaultNotes'
      | 'defaultQuantity'
      | 'unit'
    >
  >
) {
  const ref = doc(db, 'households', householdId, 'items', itemId);
  await updateDoc(ref, data);
}

export async function incrementUsage(
  householdId: string,
  itemId: string
) {
  const ref = doc(db, 'households', householdId, 'items', itemId);
  await updateDoc(ref, {
    usageCount: increment(1),
    lastUsed: serverTimestamp(),
  });
}
