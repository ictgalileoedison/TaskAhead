// ============================================
// models.js — Data Models & Defaults
// ============================================

function createDefaultProfile(userId) {
  return {
    userId: userId,
    displayName: 'ICT_Student_User',
    avatarSeed: 'taskahead',
    track: 'General ICT',
    bio: ''
  };
}

function createDefaultGamification(userId) {
  return {
    userId: userId,
    xp: 0,
    plantTier: 'Seedling',
    lastUpdated: new Date().toISOString()
  };
}

function calculateTier(xp) {
  if (xp >= 500) return 'Full Bloom';
  if (xp >= 300) return 'Blooming';
  if (xp >= 150) return 'Sapling';
  if (xp >= 50) return 'Sprout';
  return 'Seedling';
}

function createTask({ name, subject, dueDate, userId }) {
  return {
    name: name,
    subject: subject || 'General',
    dueDate: dueDate,
    status: 'pending',
    userId: userId,
    createdAt: new Date().toISOString()
  };
}
