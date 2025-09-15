import { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  FlatList,
  View,
  TouchableOpacity,
} from 'react-native';

import TaskItem from '../src/components/TaskItem';
import { loadTasks, saveTasks } from '../src/storage/taskStorage';

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('All'); // All | Todo | Pending | Done

  // Load data dari AsyncStorage saat pertama kali render
  useEffect(() => {
    (async () => {
      const data = await loadTasks();
      setTasks(Array.isArray(data) ? data : []);
    })();
  }, []);

  // Fungsi untuk toggle status tugas
  const handleToggle = async (task) => {
    const updated = tasks.map((t) =>
      t.id === task.id
        ? { ...t, status: t.status === 'done' ? 'pending' : 'done' }
        : t
    );
    setTasks(updated);
    await saveTasks(updated);
  };

  // Fungsi untuk menghapus tugas
  const handleDelete = async (task) => {
    const updated = tasks.filter((t) => t.id !== task.id);
    setTasks(updated);
    await saveTasks(updated);
  };

  // Filter tugas sesuai pilihan
  const filteredTasks =
    filter === 'All'
      ? tasks
      : tasks.filter((t) => {
          if (filter === 'Todo') return t.status !== 'done';
          if (filter === 'Pending') return t.status === 'pending';
          if (filter === 'Done') return t.status === 'done';
          return true;
        });

  return (
    <SafeAreaView style={styles.container}>
      {/* Judul Halaman */}
      <Text style={styles.header}>TaskMate – Daftar Tugas</Text>

      {/* Tombol Filter */}
      <View style={styles.filterRow}>
        {['All', 'Todo', 'Pending', 'Done'].map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
            onPress={() => setFilter(f)}
          >
            <Text
              style={[styles.filterText, filter === f && styles.filterTextActive]}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Daftar Tugas */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center' }}>Tidak ada tugas</Text>
        }
      />
    </SafeAreaView>
  );
}

// Style
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { fontSize: 20, fontWeight: '700', padding: 16 },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#e2e8f0',
  },
  filterBtnActive: {
    backgroundColor: '#3b82f6',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  filterTextActive: {
    color: '#ffffff',
  },
});
