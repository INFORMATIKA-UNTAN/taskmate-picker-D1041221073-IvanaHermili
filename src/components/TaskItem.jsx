import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function TaskItem({ task, onToggle }) {
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
    <TouchableOpacity onPress={() => onToggle?.(task)} activeOpacity={0.7}>
      <View style={[styles.card, isDone && styles.cardDone]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, isDone && styles.strike]}>
            {task.title}
          </Text>
          <Text style={styles.desc}>{task.description}</Text>
          <Text style={styles.meta}>
            {task.category} • Due {task.deadline}
          </Text>
        </View>

        <View
          style={[
            styles.badge,
            isDone ? styles.badgeDone : styles.badgePending,
          ]}
        >
          <Text style={styles.badgeText}>{isDone ? 'Done' : 'Todo'}</Text>
        </View>

        <View style={[styles.catBadge, getCategoryStyle(task.category)]}>
          <Text style={styles.catText}>{task.category}</Text>
        </View>
      </View>
    </TouchableOpacity>
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
  },
  cardDone: {
    backgroundColor: '#f1f5f9',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
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

  //Badge kategori
  catBadge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginLeft: 8,
  },
  catText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffff',
  },
  catMobile: {
    backgroundColor: '#10b981',
  },
  catIoT: {
    backgroundColor: '#f59e0b',
  },
  catRPL: {
    backgroundColor: '#94a3b8',
  },
  catDefault: {
    backgroundColor: '#94a3b8',
  },
});
