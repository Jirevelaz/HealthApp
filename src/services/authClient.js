import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { firebaseApp, isFirebaseEnabled } from "./firebaseClient";

let auth = null;

if (isFirebaseEnabled() && firebaseApp) {
  auth = getAuth(firebaseApp);
}

export function isAuthEnabled() {
  return Boolean(auth);
}

export async function loginWithEmail(email, password) {
  if (!auth) {
    throw new Error(
      "La autenticación no está configurada. Verifica las variables de entorno de Firebase."
    );
  }

  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
}

export async function logout() {
  if (!auth) return;
  await signOut(auth);
}

export function subscribeToAuthChanges(callback) {
  if (!auth) {
    callback(null);
    return () => {};
  }

  const unsubscribe = onAuthStateChanged(auth, (user) => {
    callback(user);
  });

  return unsubscribe;
}

