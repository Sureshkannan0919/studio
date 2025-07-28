
import { auth } from '@/lib/firebase';
import { getUser } from './users';
import { headers } from 'next/headers';

/**
 * A server-side utility to verify the user's role.
 * Throws an error if the user is not authenticated or does not have the required role.
 * @param requiredRole The role required to perform the action.
 */
export async function verifyUserRole(requiredRole: 'user' | 'superuser') {
  const authorization = headers().get('Authorization');
  if (!authorization) {
    throw new Error('Not authenticated');
  }

  // Note: In a real app, you would use a library like `firebase-admin`
  // to properly verify the ID token. For this example, we trust the client's UID.
  // This is NOT secure for a production application.
  //
  // Example with firebase-admin:
  // const decodedToken = await admin.auth().verifyIdToken(idToken);
  // const uid = decodedToken.uid;
  
  const uid = auth.currentUser?.uid;

  if (!uid) {
    throw new Error('Authentication token is invalid or expired.');
  }

  const user = await getUser(uid);

  if (!user) {
    throw new Error('User not found.');
  }

  if (requiredRole === 'superuser' && user.role !== 'superuser') {
    throw new Error('You do not have permission to perform this action.');
  }
}
