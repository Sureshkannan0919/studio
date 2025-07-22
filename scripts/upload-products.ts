
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, writeBatch, getDocs, doc } from "firebase/firestore";
import { products as allProducts } from '../src/lib/data';

// Load environment variables from .env
import { config } from 'dotenv';
config({ path: '.env' });

const firebaseConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

async function uploadProducts() {
  const productsCollection = collection(db, 'products');
  
  // Optional: Check if products already exist to avoid duplicates
  const existingProductsSnapshot = await getDocs(productsCollection);
  if (!existingProductsSnapshot.empty) {
    console.log('Products collection is not empty. Aborting upload to prevent duplicates.');
    // You might want to clear the collection here if you want to re-upload
    return;
  }

  const batch = writeBatch(db);

  allProducts.forEach((product) => {
    // We use the product's existing string ID as the document ID in Firestore
    const docRef = doc(db, 'products', product.id);
    
    // We need to remove the 'id' from the object we're uploading
    // because the id is the document's name, not a field in the document.
    const productData = { ...product };
    delete (productData as any).id; 

    batch.set(docRef, productData);
  });

  try {
    await batch.commit();
    console.log(`Successfully uploaded ${allProducts.length} products to Firestore.`);
  } catch (error) {
    console.error('Error uploading products:', error);
  }
}

uploadProducts().then(() => {
    process.exit(0);
}).catch((error) => {
    console.error(error);
    process.exit(1);
});
