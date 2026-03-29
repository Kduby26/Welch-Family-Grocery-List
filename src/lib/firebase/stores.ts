import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db as _db } from '@/config/firebase';

const db = _db!;
import { Store } from '@/types';

function storesRef(householdId: string) {
  return collection(db, 'households', householdId, 'stores');
}

export function subscribeToStores(
  householdId: string,
  callback: (stores: Store[]) => void
) {
  const q = query(storesRef(householdId), orderBy('sortOrder'));
  return onSnapshot(q, (snap) => {
    const stores = snap.docs.map(
      (d) => ({ id: d.id, ...d.data() }) as Store
    );
    callback(stores);
  });
}

export async function addStore(
  householdId: string,
  name: string,
  sortOrder: number
): Promise<string> {
  const ref = doc(storesRef(householdId));
  await setDoc(ref, {
    householdId,
    name,
    sortOrder,
    addedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function removeStore(householdId: string, storeId: string) {
  await deleteDoc(doc(db, 'households', householdId, 'stores', storeId));
}
