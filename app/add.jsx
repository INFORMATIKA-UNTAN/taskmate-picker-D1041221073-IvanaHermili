import { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Platform, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { loadTasks, saveTasks } from '../src/storage/taskStorage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'expo-router';
import { loadCategories, saveCategories } from '../src/storage/categoryStorage';
import { pickColor } from '../src/constants/categories';
import { PRIORITIES } from '../src/constants/priorities';
import AddCategoryModal from '../src/components/AddCategoryModal';

export default function AddTaskScreen() {
  const router = useRouter();

  // States
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [deadline, setDeadline] = useState('2025-09-30');

  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('Umum');
  const [showCatModal, setShowCatModal] = useState(false);

  const [priority, setPriority] = useState('Low');

  // Load categories dari storage
  useEffect(() => {
    (async () => setCategories(await loadCategories()))();
  }, []);

  // Submit task baru
  const handleAddTask = async () => {
    if (!title.trim()) {
      Alert.alert('Gagal', 'Judul tugas tidak boleh kosong!');
      return;
    }

    try {
      const existingTasks = await loadTasks();
      const newTask = {
        id: uuidv4(),
        title: title.trim(),
        description: desc.trim(),
        deadline,
        category,
        priority,
        status: 'pending',
      };
      await saveTasks([...existingTasks, newTask]);

      // Reset form
      setTitle('');
      setDesc('');
      setDeadline('2025-09-30');
      setCategory('Umum');
      setPriority('Low');

      router.replace('/');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Gagal menyimpan tugas.');
    }
  };

  // Submit kategori baru dari modal
  const onSubmitCategory = async ({ key, color }) => {
    if (categories.some(c => c.key.toLowerCase() === key.toLowerCase())) {
      Alert.alert('Info', 'Kategori sudah ada.');
      setShowCatModal(false);
      return;
    }
    const next = [...categories, { key, color: color || pickColor(categories.length) }];
    setCategories(next);
    await saveCategories(next);
    setCategory(key); // otomatis pilih kategori baru
    setShowCatModal(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Tambah Tugas Baru</Text>

        <Text style={styles.label}>Judul Tugas</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Contoh: Belajar React Native"
          placeholderTextColor="#94a3b8"
        />

        <Text style={styles.label}>Deskripsi (Opsional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={desc}
          onChangeText={setDesc}
          placeholder="Detail singkat mengenai tugas..."
          placeholderTextColor="#94a3b8"
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Deadline (YYYY-MM-DD)</Text>
        <TextInput
          style={styles.input}
          value={deadline}
          onChangeText={setDeadline}
          placeholder="2025-09-30"
        />

        <Text style={styles.label}>Kategori</Text>
        <View style={styles.pickerWrap}>
          <Picker
            style={{ height: 40 }} // atur tinggi Picker
            selectedValue={category}
            onValueChange={(val) => {
              if (val === '__ADD__') { setShowCatModal(true); return; }
              setCategory(val);
            }}
          >
            {categories.map(k => <Picker.Item key={k.key} label={k.key} value={k.key} />)}
            <Picker.Item label="＋ Tambah kategori…" value="__ADD__" />
          </Picker>
        </View>

        <Text style={styles.label}>Prioritas</Text>
        <View style={styles.pickerWrap}>
          <Picker
            style={{ height: 40 }}
            selectedValue={priority} 
            onValueChange={setPriority}>
            {PRIORITIES.map(p => <Picker.Item key={p} label={p} value={p} />)}
          </Picker>
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Simpan Tugas" onPress={handleAddTask} />
        </View>

        <AddCategoryModal
          visible={showCatModal}
          onClose={() => setShowCatModal(false)}
          onSubmit={onSubmitCategory}
          suggestedColor={pickColor(categories.length)}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    color: '#1e293b',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerWrap: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    marginTop: 6,
    backgroundColor: '#fff',
    justifyContent: 'center', // teks berada di tengah
  },
  buttonContainer: {
    marginTop: 24,
  }
});
