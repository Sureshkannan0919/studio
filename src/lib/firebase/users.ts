
'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import type { User } from '@/lib/types';

export async function getUsers(): Promise<User[]> {
  try {
    const usersCol = collection(db, 'users');
    const q = query(usersCol, orderBy('createdAt', 'desc'));
    const userSnapshot = await getDocs(q);

    if (userSnapshot.empty) {
      return [];
    }

    const userList = userSnapshot.docs.map(doc => {
      const data = doc.data();
      // Convert Firestore Timestamp to a serializable format (ISO string)
      const createdAt = data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString();
      
      return {
        uid: doc.id,
        ...data,
        createdAt,
        role: data.role || 'user', // Provide default role if missing
      } as User;
    });
    
    return userList;
  } catch (error) {
    console.error("Error fetching users: ", error);
    return [];
  }
}

export async function getUser(uid: string): Promise<User | null> {
    if (!uid) return null;
    try {
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const data = userSnap.data();
            const createdAt = data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString();
            return {
                uid: userSnap.id,
                ...data,
                createdAt,
                role: data.role || 'user',
            } as User;
        } else {
            return null;
        }
    } catch (error) {
        console.error(`Error fetching user with id ${uid}: `, error);
        return null;
    }
}
