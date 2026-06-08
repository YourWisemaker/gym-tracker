import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../store';
import { theme } from '../theme';
import {
  BOTTOM_BAR_SPACE,
  EmptyState,
  FloatingActionButton,
  ProgressBar,
  SCREEN_PADDING,
  ScreenHeader,
} from '../components/ui';
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
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          paddingTop: insets.top + theme.spacing(4),
          paddingBottom: BOTTOM_BAR_SPACE,
          paddingHorizontal: SCREEN_PADDING,
        }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <ScreenHeader
            title="PB Tracker"
            subtitle="See each lift's start, current best, and target at a glance."
          />
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
                {reached ? <Text style={styles.trophy}>MAX</Text> : null}
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

      <FloatingActionButton
        label="Add personal best"
        onPress={openNew}
        bottom={insets.bottom + theme.spacing(20)}
      />

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
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing(4),
    marginBottom: theme.spacing(3),
    borderCurve: 'continuous',
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(3),
  },
  name: { color: theme.colors.text, fontSize: theme.font.h3, fontWeight: '800', flex: 1 },
  trophy: {
    color: theme.colors.primary,
    fontSize: theme.font.tiny,
    fontWeight: '900',
    letterSpacing: 1,
    paddingHorizontal: theme.spacing(2),
    paddingVertical: theme.spacing(1),
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.primary + '18',
    overflow: 'hidden',
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  stat: { flex: 1, minWidth: 86, alignItems: 'flex-start' },
  statLabel: {
    color: theme.colors.textFaint,
    fontSize: theme.font.tiny,
    fontWeight: '700',
    letterSpacing: 1,
  },
  statValue: {
    color: theme.colors.text,
    fontSize: theme.font.h3,
    fontWeight: '900',
    marginTop: 2,
    fontVariant: ['tabular-nums'],
  },
  unit: { color: theme.colors.textMuted, fontSize: theme.font.small, fontWeight: '600' },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing(3),
    marginTop: theme.spacing(3),
  },
  improveText: { color: theme.colors.textMuted, fontSize: theme.font.small, fontWeight: '600', flex: 1 },
  dateText: { color: theme.colors.textFaint, fontSize: theme.font.small },
});
