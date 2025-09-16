import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';

export default function TaskItem({ task, onToggle, onDelete }) {
  const isDone = task.status === 'done';

  const getCategoryStyle = (category) => {
    switch (category) {
      case 'Mobile':
        return styles.catMobile;
      case 'RPL':
        return styles.catRPL;
      case 'IoT':
        return styles.catIoT;
      default:
        return styles.catDefault;
    }
  };

  return (
    <View style={[styles.card, isDone && styles.cardDone]}>
      {/* Bagian teks bisa diklik → toggle status */}
      <TouchableOpacity
        onPress={() => onToggle?.(task)}
        style={{ flex: 1 }}
        activeOpacity={0.7}
      >
        <Text style={[styles.title, isDone && styles.strike]}>
          {task.title}
        </Text>
        {!!task.description && (
          <Text style={styles.desc}>{task.description}</Text>
        )}
        <Text style={styles.meta}>
          {task.category} • Due {task.deadline}
        </Text>
      </TouchableOpacity>

      {/* Status badge */}
      <View style={[styles.badge, isDone ? styles.badgeDone : styles.badgePending]}>
        <Text style={styles.badgeText}>{isDone ? 'Done' : 'Todo'}</Text>
      </View>

      {/* Badge kategori */}
      <View style={[styles.catBadge, getCategoryStyle(task.category)]}>
        <Text style={styles.catText}>{task.category}</Text>
      </View>

      {/* Tombol hapus
      <Button title="🗑" onPress={() => onDelete?.(task)} /> */}
      <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete?.(task)}>
        <Text style={styles.deleteIcon}>🗑</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardDone: {
    backgroundColor: '#f1f5f9',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#0f172a',
  },
  strike: {
    textDecorationLine: 'line-through',
    color: '#64748b',
  },
  desc: {
    color: '#475569',
    marginBottom: 6,
  },
  meta: {
    fontSize: 12,
    color: '#64748b',
  },
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginLeft: 12,
  },
  badgePending: {
    backgroundColor: '#fee2e2',
  },
  badgeDone: {
    backgroundColor: '#dcfce7',
  },
  badgeText: {
    fontWeight: '700',
    fontSize: 12,
  },
  deleteBtn: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon:{
    fontSize: 30,
  },

  // Badge kategori
  catBadge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginLeft: 8,
    marginRight: 8,
  },
  catText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  catMobile: {
    backgroundColor: '#10b981',
  },
  catIoT: {
    backgroundColor: '#f59e0b',
  },
  catRPL: {
    backgroundColor: '#3b82f6',
  },
  catDefault: {
    backgroundColor: '#94a3b8',
  },
});