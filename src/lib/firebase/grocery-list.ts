import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  writeBatch,
  Timestamp,
} from 'firebase/firestore';
import { db as _db } from '@/config/firebase';

const db = _db!;
import { GroceryEntry, Category } from '@/types';

function listRef(householdId: string) {
  return collection(db, 'households', householdId, 'groceryList');
}

export function subscribeToGroceryList(
  householdId: string,
  callback: (entries: GroceryEntry[]) => void
) {
  const q = query(listRef(householdId), orderBy('addedAt', 'desc'));
  return onSnapshot(q, (snap) => {
    const entries = snap.docs.map(
      (d) => ({ id: d.id, ...d.data() }) as GroceryEntry
    );
    callback(entries);
  });
}

export async function addGroceryEntry(
  householdId: string,
  entry: {
    itemId: string;
    itemName: string;
    category: Category;
    store: string | null;
    storeLocked: boolean;
    quantityNeeded: number;
    quantityOnHand: number;
    unit: string | null;
    notes: string | null;
    addedBy: string;
  }
): Promise<string> {
  const ref = doc(listRef(householdId));
  const netNeeded = Math.max(0, entry.quantityNeeded - entry.quantityOnHand);
  await setDoc(ref, {
    ...entry,
    householdId,
    netNeeded,
    checkedOff: false,
    checkedOffAt: null,
    addedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateGroceryEntry(
  householdId: string,
  entryId: string,
  data: Partial<
    Pick<
      GroceryEntry,
      | 'quantityNeeded'
      | 'quantityOnHand'
      | 'notes'
      | 'store'
      | 'storeLocked'
      | 'checkedOff'
      | 'checkedOffAt'
    >
  >
) {
  const ref = doc(db, 'households', householdId, 'groceryList', entryId);
  const update: Record<string, unknown> = { ...data };

  if (
    data.quantityNeeded !== undefined ||
    data.quantityOnHand !== undefined
  ) {
    const needed = data.quantityNeeded ?? 0;
    const onHand = data.quantityOnHand ?? 0;
    update.netNeeded = Math.max(0, needed - onHand);
  }

  await updateDoc(ref, update);
}

export async function checkOffEntry(
  householdId: string,
  entryId: string,
  checkedOff: boolean
) {
  await updateGroceryEntry(householdId, entryId, {
    checkedOff,
    checkedOffAt: checkedOff ? Timestamp.now() : null,
  });
}

export async function removeGroceryEntry(
  householdId: string,
  entryId: string
) {
  await deleteDoc(
    doc(db, 'households', householdId, 'groceryList', entryId)
  );
}

export async function clearCheckedEntries(householdId: string) {
  const q = query(listRef(householdId));
  const snap = await new Promise<
    import('firebase/firestore').QuerySnapshot
  >((resolve) => {
    const unsub = onSnapshot(q, (s) => {
      unsub();
      resolve(s);
    });
  });

  const batch = writeBatch(db);
  snap.docs
    .filter((d) => d.data().checkedOff)
    .forEach((d) => batch.delete(d.ref));

  await batch.commit();
}
