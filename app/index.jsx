import { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  FlatList,
  View,
  TouchableOpacity,
} from 'react-native';

import TaskItem from '../src/components/TaskItem';
import { dummyTasks } from '../src/data/dummyTasks';

export default function HomeScreen() {
  const [tasks, setTasks] = useState(dummyTasks);
  const [filter, setFilter] = useState('All'); // All | Todo | Done

  const handleToggle = (task) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id
          ? { ...t, status: t.status === 'done' ? 'pending' : 'done' }
          : t
      )
    );
  };

  const filteredTasks =
    filter === 'All'
      ? tasks
      : tasks.filter((t) =>
          filter === 'Done' ? t.status === 'done' : t.status !== 'done'
        );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>TaskMate – Daftar Tugas</Text>

      {/* Filter Buttons */}
      <View style={styles.filterRow}>
        {['All', 'Todo', 'Done'].map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterBtn,
              filter === f && styles.filterBtnActive,
            ]}
            onPress={() => setFilter(f)}
          >
            <Text
              style={[
                styles.filterText,
                filter === f && styles.filterTextActive,
              ]}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Task List */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <TaskItem task={item} onToggle={handleToggle} />
        )}
      />
    </SafeAreaView>
  );
}

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
});
