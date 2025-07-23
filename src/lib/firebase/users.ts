
'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
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
      } as User;
    });
    
    return userList;
  } catch (error) {
    console.error("Error fetching users: ", error);
    return [];
  }
}
