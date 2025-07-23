
'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import type { Order } from '@/lib/types';

export async function getOrders(): Promise<Order[]> {
  try {
    const ordersCol = collection(db, 'orders');
    // Order by creation date, descending
    const q = query(ordersCol, orderBy('createdAt', 'desc'));
    const orderSnapshot = await getDocs(q);

    if (orderSnapshot.empty) {
      return [];
    }

    const orderList = orderSnapshot.docs.map(doc => {
      const data = doc.data();
      // Convert Firestore Timestamp to a serializable format (ISO string)
      const createdAt = data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString();
      
      return {
        id: doc.id,
        ...data,
        createdAt,
      } as Order;
    });
    
    return orderList;
  } catch (error) {
    console.error("Error fetching orders: ", error);
    return [];
  }
}
