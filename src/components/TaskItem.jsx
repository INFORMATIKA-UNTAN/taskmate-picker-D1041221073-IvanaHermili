import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // ✅ biar tong sampah pakai ikon

import { colorOfName } from '../constants/categories';
import { colorOfPriority } from '../constants/priorities';

export default function TaskItem({ task, categories, onToggle, onDelete }) {
  const isDone = task.status === 'done';
  const catColor = colorOfName(task.category ?? 'Umum', categories);
  const prioColor = colorOfPriority(task.priority ?? 'Low');

  // Tentukan warna background card berdasar prioritas
  let prioBg = '#f1f5f9'; // default abu-abu muda
  if (task.priority === 'High') prioBg = '#fee2e2';   // merah muda
  if (task.priority === 'Medium') prioBg = '#fef9c3'; // kuning muda
  if (task.priority === 'Low') prioBg = '#e2e8f0';    // abu-abu muda

  // 🔥 Deadline reminder
  const today = new Date().toISOString().slice(0, 10);
  let deadlineText = null;
  let deadlineStyle = styles.deadline;

  if (task.deadline) {
    if (task.deadline < today) {
      deadlineText = 'Overdue';
      deadlineStyle = [styles.deadline, styles.overdue];
    } else {
      const diff = Math.ceil(
        (new Date(task.deadline) - new Date(today)) / (1000 * 60 * 60 * 24)
      );
      deadlineText = `Sisa ${diff} hari`;
    }
  }

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: prioBg },
        isDone && styles.cardDone,
      ]}
    >
      {/* Toggle Done/Pending */}
      <TouchableOpacity onPress={() => onToggle?.(task)} style={{ flex: 1 }}>
        <Text style={[styles.title, isDone && styles.strike]}>
          {task.title}
        </Text>

        {/* Deadline reminder */}
        {!!task.deadline && (
          <Text style={deadlineStyle}>Deadline: {deadlineText}</Text>
        )}

        {/* Deskripsi */}
        {!!task.description && (
          <Text style={styles.desc}>{task.description}</Text>
        )}

        {/* Badge kategori & prioritas */}
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
          <View
            style={[
              styles.badge,
              { borderColor: catColor, backgroundColor: `${catColor}20` },
            ]}
          >
            <Text style={[styles.badgeText, { color: catColor }]}>
              {task.category ?? 'Umum'}
            </Text>
          </View>
          <View
            style={[
              styles.badge,
              { borderColor: prioColor, backgroundColor: `${prioColor}20` },
            ]}
          >
            <Text style={[styles.badgeText, { color: prioColor }]}>
              {task.priority ?? 'Low'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Tombol hapus */}
      <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete?.(task)}> 
        <Text style={styles.deleteIcon}>🗑</Text> 
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cardDone: {
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
    color: '#0f172a',
  },
  strike: {
    textDecorationLine: 'line-through',
    color: '#64748b',
  },
  deadline: {
    fontSize: 12,
    color: '#334155',
    marginBottom: 4,
  },
  overdue: {
    color: '#dc2626', // merah
    fontWeight: '700',
  },
  desc: {
    color: '#475569',
  },
  badge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  deleteBtn: { 
    justifyContent: 'center', 
    alignItems: 'center', 
  }, 
  deleteIcon:{ 
    fontSize: 30, 
    color: 'red', 
    marginRight: 10, 
  },
});
