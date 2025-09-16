import { useEffect, useState, useMemo } from 'react';
import {
  SafeAreaView,
  Text,
  SectionList,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import TaskItem from '../src/components/TaskItem';
import FilterToolbarFancy from '../src/components/FilterToolbarFancy';
import AddCategoryModal from '../src/components/AddCategoryModal';
import {
  loadTasks,
  saveTasks,
  clearTasks as storageClearTasks,
} from '../src/storage/taskStorage';
import { loadCategories, saveCategories } from '../src/storage/categoryStorage';
import { pickColor } from '../src/constants/categories';
import { weightOfPriority } from '../src/constants/priorities';

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);

  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const [showCatModal, setShowCatModal] = useState(false);

  useEffect(() => {
    (async () => {
      const loadedTasks = await loadTasks();
      const loadedCats = await loadCategories();
      setTasks(loadedTasks);
      setCategories(loadedCats);
    })();
  }, []);

  // Toggle status
  const handleToggle = async (task) => {
    const updated = tasks.map((t) =>
      t.id === task.id
        ? { ...t, status: t.status === 'done' ? 'pending' : 'done' }
        : t
    );
    setTasks(updated);
    await saveTasks(updated);
  };

  // Delete single task
  const handleDelete = async (task) => {
    const updated = tasks.filter((t) => t.id !== task.id);
    setTasks(updated);
    await saveTasks(updated);
  };

  // Counts
  const doneCount = useMemo(
    () => tasks.filter((t) => t.status === 'done').length,
    [tasks]
  );
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const overdueCount = useMemo(
    () =>
      tasks.filter(
        (t) => t.deadline && t.deadline < today && t.status !== 'done'
      ).length,
    [tasks, today]
  );

  // Clear done tasks (langsung, tanpa alert)
  const handleClearDone = async () => {
    const kept = tasks.filter((t) => t.status !== 'done');
    setTasks(kept);
    await saveTasks(kept);
  };

  // Clear all tasks (langsung, tanpa alert)
  const handleClearAll = async () => {
    setTasks([]);
    await storageClearTasks();
  };

  // Filter & sorting
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const byStatus =
        statusFilter === 'all' ||
        (statusFilter === 'todo'
          ? t.status !== 'done'
          : t.status === 'done');
      const byCategory =
        categoryFilter === 'all' || (t.category ?? 'Umum') === categoryFilter;
      const byPriority =
        priorityFilter === 'all' ||
        (t.priority ?? 'Low') === priorityFilter;
      return byStatus && byCategory && byPriority;
    });
  }, [tasks, statusFilter, categoryFilter, priorityFilter]);

  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      const wa = weightOfPriority(a.priority ?? 'Low');
      const wb = weightOfPriority(b.priority ?? 'Low');
      if (wa !== wb) return wb - wa;
      if (!a.deadline && !b.deadline) return 0;
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline) - new Date(b.deadline);
    });
  }, [filteredTasks]);

  const groupedTasks = useMemo(() => {
    const map = {};
    sortedTasks.forEach((t) => {
      const cat = t.category ?? 'Umum';
      if (!map[cat]) map[cat] = [];
      map[cat].push(t);
    });
    return Object.keys(map).map((k) => ({ title: k, data: map[k] }));
  }, [sortedTasks]);

  // Category submit
  const handleSubmitCategory = async (cat) => {
    if (
      categories.some(
        (c) => c.key.toLowerCase() === cat.key.toLowerCase()
      )
    ) {
      setShowCatModal(false);
      return;
    }
    const color = cat.color || pickColor(categories.length);
    const next = [...categories, { key: cat.key, color }];
    setCategories(next);
    await saveCategories(next);
    setCategoryFilter(cat.key);
    setShowCatModal(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>TaskMate – Daftar Tugas</Text>

      <View style={{ paddingHorizontal: 16, gap: 12 }}>
        <FilterToolbarFancy
          categories={categories}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
        />

        <View style={styles.toolbar}>
          <Text style={styles.toolbarText}>
            Done: {doneCount} / {tasks.length}
          </Text>
          <Text
            style={[
              styles.toolbarText,
              { color: overdueCount ? '#dc2626' : '#334155' },
            ]}
          >
            Overdue: {overdueCount}
          </Text>
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.btnClearDone}
              onPress={handleClearDone}
              disabled={!doneCount}
            >
              <Text style={styles.btnText}>CLEAR DONE</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnClearAll}
              onPress={handleClearAll}
            >
              <Text style={styles.btnText}>CLEAR ALL</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <SectionList
        sections={groupedTasks}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            categories={categories}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        )}
        contentContainerStyle={{ paddingHorizontal: 6, paddingBottom: 16, marginLeft: 11 }}
        ListEmptyComponent={<Text style={{ textAlign: 'center' }}>Tidak ada tugas</Text>}
      />
      
      <AddCategoryModal
        visible={showCatModal}
        onClose={() => setShowCatModal(false)}
        onSubmit={handleSubmitCategory}
        suggestedColor={pickColor(categories.length)}
      />      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8fafc' 
  },
  header: { 
    fontSize: 22, 
    fontWeight: '700', 
    padding: 16,
    marginBottom: 20,
    color: '#1e293b', 
  },
  toolbar: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 6,
  },
  toolbarText: { 
    fontWeight: '600', 
    color: '#334155' 
  },
  actions: { 
    flexDirection: 'row', 
    gap: 10, 
    marginTop: 6 
  },
  btnClearDone: {
    backgroundColor: '#3b82f6',
    padding: 8,
    borderRadius: 6,
  },
  btnClearAll: {
    backgroundColor: '#ef4444',
    padding: 8,
    borderRadius: 6,
  },
  btnText: { 
    color: '#fff', 
    fontWeight: '600' 
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    backgroundColor: '#f1f5f9',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginTop: 10,
    marginBottom: 10,
  },
});
