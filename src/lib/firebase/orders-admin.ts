
'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import type { Order } from '@/lib/types';

// A server-side function to add a new order
export async function createOrder(orderData: Omit<Order, 'id' | 'createdAt'>) {
  try {
    const newOrder = {
      ...orderData,
      createdAt: serverTimestamp(), // Add server-side timestamp
    };
    const docRef = await addDoc(collection(db, "orders"), newOrder);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error creating order: ", error);
    return { success: false, error: "Failed to create order" };
  }
}

// A server-side function to update an order's status
export async function updateOrderStatus(orderId: string, status: Order['status']) {
  try {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, { status });
    return { success: true };
  } catch (error) {
    console.error("Error updating order status: ", error);
    return { success: false, error: "Failed to update order status" };
  }
}
