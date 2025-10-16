import { openDB } from "idb";

const DB_NAME = "offlineDB";
const STORE_NAME = "entries";

export const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
      }
    },
  });
};

export const addEntry = async (data: { title: string; description: string }) => {
  const db = await initDB();
  await db.add(STORE_NAME, { ...data, date: new Date().toISOString() });
};

export const getAllEntries = async () => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
};
