
import { auth } from '@/lib/firebase';
import { getUser } from './users';
import { headers } from 'next/headers';

/**
 * A server-side utility to verify the user's role.
 * Throws an error if the user is not authenticated or does not have the required role.
 * @param requiredRole The role required to perform the action.
 */
export async function verifyUserRole(requiredRole: 'user' | 'superuser') {
  // In a real app, you would use a library like `firebase-admin` 
  // to properly verify the ID token passed from the client.
  // For this simplified example, we'll rely on the auth state as seen by the server.
  // This is NOT a secure pattern for production apps.
  const currentUser = auth.currentUser;
  
  if (!currentUser) {
    throw new Error('Authentication required. Please sign in.');
  }

  const user = await getUser(currentUser.uid);

  if (!user) {
    throw new Error('User not found in database.');
  }

  if (requiredRole === 'superuser' && user.role !== 'superuser') {
    throw new Error('You do not have permission to perform this action.');
  }
}
