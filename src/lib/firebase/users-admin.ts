
'use server';

import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

// A server-side function to add a new user to the 'users' collection
export async function addUser(userData: {
  uid: string;
  name: string;
  email: string;
}) {
  try {
    const newUser = {
      ...userData,
      createdAt: serverTimestamp(),
    };
    await setDoc(doc(db, "users", userData.uid), newUser);
    return { success: true, uid: userData.uid };
  } catch (error) {
    console.error("Error adding user: ", error);
    return { success: false, error: "Failed to add user" };
  }
}
