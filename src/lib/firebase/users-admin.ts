
'use server';

import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';

// A server-side function to add a new user to the 'users' collection
export async function addUser(userData: {
  uid: string;
  name: string;
  email: string;
  role: 'user' | 'superuser';
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

// A server-side function to update a user's role
export async function updateUserRole(uid: string, role: 'user' | 'superuser') {
    // Admin role is verified on the client before this is called.
    try {
        const userRef = doc(db, "users", uid);
        await updateDoc(userRef, { role });
        return { success: true };
    } catch (error) {
        console.error("Error updating user role: ", error);
        return { success: false, error: "Failed to update user role" };
    }
}
