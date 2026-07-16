// ============================================
// database.js — IndexedDB Engine
// ============================================

const DB_NAME = 'TaskAheadDB';
const DB_VERSION = 2;

const db = {
  instance: null,

  init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.instance = request.result;
        resolve(this.instance);
      };

      request.onupgradeneeded = (event) => {
        const database = event.target.result;

        if (!database.objectStoreNames.contains('users')) {
          const userStore = database.createObjectStore('users', { keyPath: 'username' });
          userStore.createIndex('email', 'email', { unique: true });
        }

        if (!database.objectStoreNames.contains('tasks')) {
          const taskStore = database.createObjectStore('tasks', { keyPath: 'id', autoIncrement: true });
          taskStore.createIndex('userId', 'userId', { unique: false });
          taskStore.createIndex('status', 'status', { unique: false });
        }

        if (!database.objectStoreNames.contains('gamification')) {
          database.createObjectStore('gamification', { keyPath: 'userId' });
        }

        if (!database.objectStoreNames.contains('profiles')) {
          database.createObjectStore('profiles', { keyPath: 'userId' });
        }
      };
    });
  },

  add(storeName, data) {
    return new Promise((resolve, reject) => {
      const tx = this.instance.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.add(data);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  get(storeName, key) {
    return new Promise((resolve, reject) => {
      const tx = this.instance.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  getAll(storeName) {
    return new Promise((resolve, reject) => {
      const tx = this.instance.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  put(storeName, data) {
    return new Promise((resolve, reject) => {
      const tx = this.instance.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.put(data);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  delete(storeName, key) {
    return new Promise((resolve, reject) => {
      const tx = this.instance.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.delete(key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
};
