import { openDB } from 'idb';

const DB_NAME = 'story-app-db';
const STORE_NAME = 'bookmarked-stories';
const DB_VERSION = 1;

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id' });
    }
  },
});

const StoryDB = {
  async add(story) {
    return (await dbPromise).put(STORE_NAME, story);
  },
  async getAll() {
    return (await dbPromise).getAll(STORE_NAME);
  },
  async delete(id) {
    return (await dbPromise).delete(STORE_NAME, id);
  },
  async get(id) {
    return (await dbPromise).get(STORE_NAME, id);
  },
};

export default StoryDB;
