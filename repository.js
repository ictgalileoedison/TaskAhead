// ============================================
// repository.js — Data Access Layer
// ============================================

const TaskRepository = {
  async getAll(userId) {
    const allTasks = await db.getAll('tasks');
    return allTasks.filter(t => t.userId === userId);
  },

  async create(taskData) {
    const task = createTask(taskData);
    const id = await db.add('tasks', task);
    return { ...task, id };
  },

  async toggleStatus(taskId) {
    const tx = db.instance.transaction('tasks', 'readwrite');
    const store = tx.objectStore('tasks');
    
    return new Promise((resolve, reject) => {
      const getReq = store.get(taskId);
      getReq.onsuccess = () => {
        const task = getReq.result;
        if (!task) return reject(new Error('Task not found'));
        
        task.status = task.status === 'done' ? 'pending' : 'done';
        
        const putReq = store.put(task);
        putReq.onsuccess = () => resolve(task);
        putReq.onerror = () => reject(putReq.error);
      };
      getReq.onerror = () => reject(getReq.error);
    });
  },

  async delete(taskId) {
    await db.delete('tasks', taskId);
  }
};

const GamificationRepository = {
  async get(userId) {
    let data = await db.get('gamification', userId);
    if (!data) {
      data = createDefaultGamification(userId);
      await db.add('gamification', data);
    }
    return data;
  },

  async addXP(userId, amount) {
    const data = await this.get(userId);
    data.xp += amount;
    data.plantTier = calculateTier(data.xp);
    data.lastUpdated = new Date().toISOString();
    await db.put('gamification', data);
    return data;
  },

  async update(userId, updates) {
    const data = await this.get(userId);
    Object.assign(data, updates);
    await db.put('gamification', data);
    return data;
  }
};

const ProfileRepository = {
  async get(userId) {
    let profile = await db.get('profiles', userId);
    if (!profile) {
      profile = createDefaultProfile(userId);
      await db.add('profiles', profile);
    }
    return profile;
  },

  async update(userId, updates) {
    const profile = await this.get(userId);
    Object.assign(profile, updates);
    profile.userId = userId;
    await db.put('profiles', profile);
    return profile;
  }
};
