
'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';

// A server-side function to add a new product to the 'products' collection
export async function addProduct(productData: {
  name: string;
  category: string;
  price: number;
  stock: number;
}) {
  try {
    // Add default fields for a new product
    const newProduct = {
      ...productData,
      description: "A great new product.",
      imageUrl: "https://placehold.co/600x600.png",
      images: ["https://placehold.co/600x600.png"],
      data_ai_hint: "new product"
    }
    const docRef = await addDoc(collection(db, "products"), newProduct);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding product: ", error);
    return { success: false, error: "Failed to add product" };
  }
}

// A server-side function to delete a product from the 'products' collection
export async function deleteProduct(productId: string) {
  try {
    await deleteDoc(doc(db, "products", productId));
    return { success: true };
  } catch (error) {
    console.error("Error deleting product: ", error);
    return { success: false, error: "Failed to delete product" };
  }
}
