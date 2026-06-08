import React, { useMemo, useState } from 'react';
import {
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../store';
import { theme } from '../theme';
import {
  BOTTOM_BAR_SPACE,
  EmptyState,
  FloatingActionButton,
  SCREEN_PADDING,
  ScreenHeader,
  Tag,
} from '../components/ui';
import { Session } from '../types';
import { parseDateKey } from '../stats';
import {
  SessionDraft,
  SessionFormModal,
  sessionToDraft,
} from './SessionFormModal';

function formatHeaderDate(key: string): string {
  const d = parseDateKey(key);
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function draftToSession(draft: SessionDraft): Omit<Session, 'id'> {
  return {
    date: draft.date,
    muscleGroup: draft.muscleGroup,
    workoutName: draft.workoutName.trim(),
    completed: draft.completed,
    sets: parseInt(draft.sets, 10) || 0,
    repsOrTime: draft.repsOrTime.trim(),
    weight: parseFloat(draft.weight) || 0,
    notes: draft.notes.trim(),
  };
}

export function SessionLogScreen() {
  const insets = useSafeAreaInsets();
  const { data, addSession, updateSession, deleteSession } = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SessionDraft | undefined>(undefined);

  const sections = useMemo(() => {
    const sorted = [...data.sessions].sort((a, b) => (a.date < b.date ? 1 : -1));
    const groups = new Map<string, Session[]>();
    for (const s of sorted) {
      if (!groups.has(s.date)) groups.set(s.date, []);
      groups.get(s.date)!.push(s);
    }
    return Array.from(groups.entries()).map(([date, items]) => ({
      title: date,
      data: items,
    }));
  }, [data.sessions]);

  const openNew = () => {
    setEditing(undefined);
    setModalOpen(true);
  };

  const openEdit = (s: Session) => {
    setEditing(sessionToDraft(s));
    setModalOpen(true);
  };

  const handleSave = (draft: SessionDraft) => {
    if (draft.id) updateSession(draft.id, draftToSession(draft));
    else addSession(draftToSession(draft));
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (editing?.id) deleteSession(editing.id);
    setModalOpen(false);
  };

  return (
    <View style={styles.screen}>
      <SectionList
        sections={sections}
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
            title="Session Log"
            subtitle="Fast entries for every lift, run, stretch, and skipped day."
          />
        }
        ListEmptyComponent={
          <EmptyState
            title="No sessions yet"
            subtitle="Tap the + button to log your first workout."
          />
        }
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{formatHeaderDate(section.title)}</Text>
        )}
        renderItem={({ item }) => (
          <Pressable style={styles.row} onPress={() => openEdit(item)}>
            <View
              style={[
                styles.stripe,
                { backgroundColor: theme.colors.groupColors[item.muscleGroup] },
              ]}
            />
            <View style={{ flex: 1 }}>
              <View style={styles.rowTop}>
                <Text style={styles.workout} numberOfLines={1}>
                  {item.workoutName}
                </Text>
                {!item.completed ? (
                  <Text style={styles.skipped}>skipped</Text>
                ) : null}
              </View>
              <Text style={styles.meta}>
                {item.sets} sets · {item.repsOrTime}
                {item.weight ? ` · ${item.weight} kg` : ''}
              </Text>
              {item.notes ? (
                <Text style={styles.notes} numberOfLines={1}>
                  {item.notes}
                </Text>
              ) : null}
              <View style={{ marginTop: theme.spacing(2) }}>
                <Tag
                  label={item.muscleGroup}
                  color={theme.colors.groupColors[item.muscleGroup]}
                />
              </View>
            </View>
          </Pressable>
        )}
      />

      <FloatingActionButton
        label="Add session"
        onPress={openNew}
        bottom={insets.bottom + theme.spacing(20)}
      />

      <SessionFormModal
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
  sectionHeader: {
    color: theme.colors.textMuted,
    fontSize: theme.font.tiny,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
  row: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing(3.5),
    marginBottom: theme.spacing(2.5),
    overflow: 'hidden',
    borderCurve: 'continuous',
  },
  stripe: {
    width: 4,
    borderRadius: 2,
    marginRight: theme.spacing(3),
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(2),
  },
  workout: { color: theme.colors.text, fontSize: theme.font.body, fontWeight: '700', flex: 1 },
  skipped: {
    color: theme.colors.danger,
    fontSize: theme.font.tiny,
    fontWeight: '700',
    marginLeft: theme.spacing(2),
  },
  meta: { color: theme.colors.textMuted, fontSize: theme.font.small, marginTop: 2, lineHeight: 19 },
  notes: { color: theme.colors.textFaint, fontSize: theme.font.small, marginTop: 2, fontStyle: 'italic' },
});
