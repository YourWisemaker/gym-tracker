import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../store';
import { theme } from '../theme';
import { EmptyState, ProgressBar } from '../components/ui';
import { PersonalBest } from '../types';
import { pbImprovement } from '../stats';
import { PBDraft, PBFormModal, pbToDraft } from './PBFormModal';

function draftToPB(draft: PBDraft): Omit<PersonalBest, 'id'> {
  return {
    exercise: draft.exercise.trim(),
    startingWeight: parseFloat(draft.startingWeight) || 0,
    currentPB: parseFloat(draft.currentPB) || 0,
    target: parseFloat(draft.target) || 0,
    dateSet: draft.dateSet.trim(),
    unit: draft.unit,
  };
}

// For time-based goals (e.g. 5K run) lower is better, so progress is inverted.
function progressToTarget(pb: PersonalBest): number {
  if (pb.unit === 'mins') {
    if (pb.startingWeight <= pb.target) return pb.currentPB <= pb.target ? 1 : 0;
    const span = pb.startingWeight - pb.target;
    const done = pb.startingWeight - pb.currentPB;
    return Math.max(0, Math.min(1, done / span));
  }
  if (pb.target <= pb.startingWeight) return pb.currentPB >= pb.target ? 1 : 0;
  const span = pb.target - pb.startingWeight;
  const done = pb.currentPB - pb.startingWeight;
  return Math.max(0, Math.min(1, done / span));
}

export function PBScreen() {
  const insets = useSafeAreaInsets();
  const { data, addPB, updatePB, deletePB } = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<PBDraft | undefined>(undefined);

  const openNew = () => {
    setEditing(undefined);
    setModalOpen(true);
  };
  const openEdit = (pb: PersonalBest) => {
    setEditing(pbToDraft(pb));
    setModalOpen(true);
  };
  const handleSave = (draft: PBDraft) => {
    if (draft.id) updatePB(draft.id, draftToPB(draft));
    else addPB(draftToPB(draft));
    setModalOpen(false);
  };
  const handleDelete = () => {
    if (editing?.id) deletePB(editing.id);
    setModalOpen(false);
  };

  return (
    <View style={styles.screen}>
      <FlatList
        data={data.personalBests}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingTop: insets.top + theme.spacing(4),
          paddingBottom: theme.spacing(28),
          paddingHorizontal: theme.spacing(4),
        }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <Text style={styles.h1}>PB Tracker</Text>
            <Text style={styles.sub}>
              Update your PBs as you hit new records. These are your trophies.
            </Text>
          </View>
        }
        ListEmptyComponent={
          <EmptyState title="No PBs tracked" subtitle="Add a lift to start chasing records." />
        }
        renderItem={({ item }) => {
          const imp = pbImprovement(item);
          const pct = progressToTarget(item);
          const reached = pct >= 1;
          return (
            <Pressable style={styles.card} onPress={() => openEdit(item)}>
              <View style={styles.cardTop}>
                <Text style={styles.name}>{item.exercise}</Text>
                {reached ? <Text style={styles.trophy}>🏆</Text> : null}
              </View>
              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>START</Text>
                  <Text style={styles.statValue}>
                    {item.startingWeight}
                    <Text style={styles.unit}> {item.unit}</Text>
                  </Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>CURRENT</Text>
                  <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                    {item.currentPB}
                    <Text style={styles.unit}> {item.unit}</Text>
                  </Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>TARGET</Text>
                  <Text style={styles.statValue}>
                    {item.target}
                    <Text style={styles.unit}> {item.unit}</Text>
                  </Text>
                </View>
              </View>
              <ProgressBar
                value={pct}
                color={reached ? theme.colors.primary : theme.colors.accent}
              />
              <View style={styles.cardBottom}>
                <Text style={styles.improveText}>
                  {item.unit === 'mins' ? (imp <= 0 ? '' : '+') : imp >= 0 ? '+' : ''}
                  {imp} {item.unit} from start
                </Text>
                <Text style={styles.dateText}>{item.dateSet || '—'}</Text>
              </View>
            </Pressable>
          );
        }}
      />

      <View style={[styles.fabWrap, { bottom: insets.bottom + theme.spacing(20) }]}>
        <Pressable style={styles.fab} onPress={openNew}>
          <Text style={styles.fabText}>＋</Text>
        </Pressable>
      </View>

      <PBFormModal
        visible={modalOpen}
        initial={editing}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        onDelete={editing?.id ? handleDelete : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.bg },
  headerBlock: { marginBottom: theme.spacing(4) },
  h1: { color: theme.colors.text, fontSize: theme.font.h1, fontWeight: '800' },
  sub: { color: theme.colors.textMuted, fontSize: theme.font.small, marginTop: theme.spacing(1) },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing(4),
    marginBottom: theme.spacing(3),
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(3),
  },
  name: { color: theme.colors.text, fontSize: theme.font.h3, fontWeight: '700' },
  trophy: { fontSize: 18 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing(3) },
  stat: { alignItems: 'flex-start' },
  statLabel: {
    color: theme.colors.textFaint,
    fontSize: theme.font.tiny,
    fontWeight: '700',
    letterSpacing: 1,
  },
  statValue: { color: theme.colors.text, fontSize: theme.font.h3, fontWeight: '800', marginTop: 2 },
  unit: { color: theme.colors.textMuted, fontSize: theme.font.small, fontWeight: '600' },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing(3),
  },
  improveText: { color: theme.colors.textMuted, fontSize: theme.font.small, fontWeight: '600' },
  dateText: { color: theme.colors.textFaint, fontSize: theme.font.small },
  fabWrap: { position: 'absolute', right: theme.spacing(5) },
  fab: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  fabText: { color: '#0B1F12', fontSize: 30, fontWeight: '700', marginTop: -2 },
});
