import { z } from 'zod';

export const wishSchema = z.object({
  name: z.string().trim().min(1, 'Please add your name.').max(60),
  message: z.string().trim().min(1, 'Write a little birthday wish.').max(600),
});

export type BirthdayWish = { id: string; name: string; message: string };

export const firebaseConfigured = Boolean(
  import.meta.env['VITE_FIREBASE_API_KEY'] &&
  import.meta.env['VITE_FIREBASE_PROJECT_ID'] &&
  import.meta.env['VITE_FIREBASE_APP_ID'],
);

async function getWishesCollection() {
  const { getApps, initializeApp } = await import('firebase/app');
  const { getFirestore, collection } = await import('firebase/firestore');
  const app = getApps()[0] ?? initializeApp({
    apiKey: import.meta.env['VITE_FIREBASE_API_KEY'],
    authDomain: import.meta.env['VITE_FIREBASE_AUTH_DOMAIN'],
    projectId: import.meta.env['VITE_FIREBASE_PROJECT_ID'],
    appId: import.meta.env['VITE_FIREBASE_APP_ID'],
  });
  return collection(getFirestore(app), 'birthdayWishes');
}

export async function watchWishes(onWishes: (wishes: BirthdayWish[]) => void, onError: () => void) {
  const { onSnapshot, query, orderBy } = await import('firebase/firestore');
  return onSnapshot(query(await getWishesCollection(), orderBy('createdAt', 'desc')), (snapshot) => {
    onWishes(snapshot.docs.flatMap((doc) => {
      const parsed = wishSchema.safeParse(doc.data());
      return parsed.success ? [{ id: doc.id, ...parsed.data }] : [];
    }));
  }, onError);
}

export async function saveWish(input: { name: string; message: string }) {
  const data = wishSchema.parse(input);
  const { addDoc, serverTimestamp } = await import('firebase/firestore');
  await addDoc(await getWishesCollection(), { ...data, createdAt: serverTimestamp() });
}