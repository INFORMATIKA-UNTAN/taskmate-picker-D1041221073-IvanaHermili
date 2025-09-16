import AsyncStorage from '@react-native-async-storage/async-storage';

// ✅ Key konsisten dengan modul
const TASKS_KEY = 'TASKMATE_TASKS';

// [LOAD] Ambil semua tugas dari storage
export const loadTasks = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(TASKS_KEY);
    const tasks = jsonValue != null ? JSON.parse(jsonValue) : [];
    console.log('[TaskStorage] Loaded tasks:', tasks.length);
    return tasks;
  } catch (e) {
    console.error('[TaskStorage] Error loading tasks', e);
    return [];
  }
};

// [SAVE] Simpan daftar tugas ke storage
export const saveTasks = async (tasks) => {
  try {
    const jsonValue = JSON.stringify(tasks);
    await AsyncStorage.setItem(TASKS_KEY, jsonValue);
    console.log('[TaskStorage] Saved tasks:', tasks.length);
  } catch (e) {
    console.error('[TaskStorage] Error saving tasks', e);
  }
};

// [CLEAR] Hapus semua tugas
export const clearTasks = async () => {
  try {
    await AsyncStorage.removeItem(TASKS_KEY);
    console.log('[TaskStorage] Cleared all tasks!');
  } catch (e) {
    console.error('[TaskStorage] Error clearing tasks', e);
  }
};
