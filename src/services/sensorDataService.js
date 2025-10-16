import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { firebaseApp, isFirebaseEnabled } from "./firebaseClient";

let db = null;

if (isFirebaseEnabled()) {
  db = getFirestore(firebaseApp);
}

const collectionMap = {
  HeartRate: "sensorHeartRate",
  Steps: "sensorSteps",
};

function getCollectionName(entity) {
  return collectionMap[entity] ?? entity;
}

export function isFirebaseReady() {
  return Boolean(db);
}

export async function fetchSensorData(entity, sort) {
  if (!db) {
    return [];
  }
  const col = collection(db, getCollectionName(entity));
  let q = col;
  if (sort) {
    const direction = sort.startsWith("-") ? "desc" : "asc";
    const field = sort.replace(/^[-+]/, "");
    q = query(col, orderBy(field, direction));
  }
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
}

export async function saveSensorReading(entity, payload) {
  if (!db) {
    return null;
  }
  const col = collection(db, getCollectionName(entity));
  const data = {
    ...payload,
    timestamp: payload.timestamp ?? new Date().toISOString(),
    createdAt: serverTimestamp(),
  };
  const docRef = await addDoc(col, data);
  return { id: docRef.id, ...payload, timestamp: data.timestamp };
}

export async function updateSensorReading(entity, id, updates) {
  if (!db) {
    return null;
  }
  const docRef = doc(db, getCollectionName(entity), id);
  const updatePayload = {
    ...updates,
    updatedAt: serverTimestamp(),
  };
  if (!updatePayload.timestamp) {
    updatePayload.timestamp = new Date().toISOString();
  }
  await updateDoc(docRef, updatePayload);
  return { id, ...updates, timestamp: updatePayload.timestamp };
}
