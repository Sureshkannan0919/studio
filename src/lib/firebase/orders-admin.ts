
'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc, runTransaction, DocumentReference } from 'firebase/firestore';
import type { Order, Product } from '@/lib/types';

// A server-side function to add a new order and update product stock
export async function createOrder(orderData: Omit<Order, 'id' | 'createdAt'>) {
  try {
    await runTransaction(db, async (transaction) => {
      const productUpdates: { ref: DocumentReference, newStock: number }[] = [];

      // Phase 1: READ all product documents first
      for (const item of orderData.items) {
        const productRef = doc(db, "products", item.id);
        const productDoc = await transaction.get(productRef);

        if (!productDoc.exists()) {
          throw new Error(`Product with ID ${item.id} not found.`);
        }

        const currentStock = productDoc.data().stock as number;
        const newStock = currentStock - item.quantity;

        if (newStock < 0) {
          throw new Error(`Not enough stock for ${item.name}. Only ${currentStock} available.`);
        }
        productUpdates.push({ ref: productRef, newStock });
      }

      // Phase 2: WRITE all documents
      // 1. Create the new order document
      const newOrder = {
        ...orderData,
        createdAt: serverTimestamp(),
        status: 'Processing',
      };
      const orderRef = doc(collection(db, "orders"));
      transaction.set(orderRef, newOrder);

      // 2. Update stock for each product
      for (const update of productUpdates) {
        transaction.update(update.ref, { stock: update.newStock });
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Error creating order: ", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to create order";
    return { success: false, error: errorMessage };
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
