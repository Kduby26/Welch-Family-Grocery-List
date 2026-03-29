import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  arrayUnion,
  writeBatch,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db as _db } from '@/config/firebase';

const db = _db!;
import { Household } from '@/types';
import { SEED_ITEMS } from '@/data/seed-items';

function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function createHousehold(
  userId: string,
  name: string
): Promise<string> {
  const householdRef = doc(collection(db, 'households'));
  const householdId = householdRef.id;

  await setDoc(householdRef, {
    name,
    members: [userId],
    inviteCode: generateInviteCode(),
    createdBy: userId,
    createdAt: serverTimestamp(),
  });

  // Seed known items in batches of 500
  const itemsRef = collection(db, 'households', householdId, 'items');
  let batch = writeBatch(db);
  let count = 0;

  for (const seed of SEED_ITEMS) {
    const itemDoc = doc(itemsRef);
    batch.set(itemDoc, {
      householdId,
      name: seed.name,
      nameLower: seed.name.toLowerCase(),
      category: seed.category,
      preferredStore: null,
      storeLocked: false,
      defaultNotes: null,
      defaultQuantity: 1,
      unit: null,
      usageCount: 0,
      lastUsed: null,
    });
    count++;

    if (count >= 450) {
      await batch.commit();
      batch = writeBatch(db);
      count = 0;
    }
  }

  if (count > 0) {
    await batch.commit();
  }

  return householdId;
}

export async function joinHousehold(
  userId: string,
  inviteCode: string
): Promise<string | null> {
  const q = query(
    collection(db, 'households'),
    where('inviteCode', '==', inviteCode.toUpperCase())
  );
  const snap = await getDocs(q);

  if (snap.empty) return null;

  const householdDoc = snap.docs[0];
  await updateDoc(householdDoc.ref, {
    members: arrayUnion(userId),
  });

  return householdDoc.id;
}

export async function getHousehold(
  householdId: string
): Promise<Household | null> {
  const snap = await getDoc(doc(db, 'households', householdId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Household;
}

export async function getUserHouseholds(
  userId: string
): Promise<Household[]> {
  const q = query(
    collection(db, 'households'),
    where('members', 'array-contains', userId)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Household);
}
