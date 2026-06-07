import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { Button, Field } from '../components/ui';
import { ChipSelect } from '../components/ChipSelect';
import { MUSCLE_GROUPS, MuscleGroup, Session } from '../types';
import { toDateKey } from '../stats';

export interface SessionDraft {
  id?: string;
  date: string;
  muscleGroup: MuscleGroup;
  workoutName: string;
  completed: boolean;
  sets: string;
  repsOrTime: string;
  weight: string;
  notes: string;
}

function emptyDraft(): SessionDraft {
  return {
    date: toDateKey(new Date()),
    muscleGroup: 'Chest',
    workoutName: '',
    completed: true,
    sets: '3',
    repsOrTime: '10',
    weight: '',
    notes: '',
  };
}

export function sessionToDraft(s: Session): SessionDraft {
  return {
    id: s.id,
    date: s.date,
    muscleGroup: s.muscleGroup,
    workoutName: s.workoutName,
    completed: s.completed,
    sets: `${s.sets}`,
    repsOrTime: s.repsOrTime,
    weight: s.weight ? `${s.weight}` : '',
    notes: s.notes,
  };
}

export function SessionFormModal({
  visible,
  initial,
  onClose,
  onSave,
  onDelete,
}: {
  visible: boolean;
  initial?: SessionDraft;
  onClose: () => void;
  onSave: (draft: SessionDraft) => void;
  onDelete?: () => void;
}) {
  const insets = useSafeAreaInsets();
  const [draft, setDraft] = useState<SessionDraft>(emptyDraft());

  useEffect(() => {
    if (visible) setDraft(initial ?? emptyDraft());
  }, [visible, initial]);

  const set = <K extends keyof SessionDraft>(k: K, v: SessionDraft[K]) =>
    setDraft((d) => ({ ...d, [k]: v }));

  const canSave = draft.workoutName.trim().length > 0;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.sheetWrap}
        >
          <View style={[styles.sheet, { paddingBottom: insets.bottom + theme.spacing(4) }]}>
            <View style={styles.handle} />
            <View style={styles.header}>
              <Text style={styles.title}>{draft.id ? 'Edit Session' : 'New Session'}</Text>
              <Pressable onPress={onClose} hitSlop={12}>
                <Text style={styles.close}>✕</Text>
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <Field
                label="Date"
                value={draft.date}
                onChangeText={(t) => set('date', t)}
                placeholder="YYYY-MM-DD"
                autoCapitalize="none"
              />
              <ChipSelect
                label="Muscle Group"
                options={MUSCLE_GROUPS}
                value={draft.muscleGroup}
                onChange={(v) => set('muscleGroup', v)}
                colorFor={(v) => theme.colors.groupColors[v]}
              />
              <Field
                label="Workout Name"
                value={draft.workoutName}
                onChangeText={(t) => set('workoutName', t)}
                placeholder="e.g. Incline Bench Press"
              />
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Field
                    label="Sets"
                    value={draft.sets}
                    onChangeText={(t) => set('sets', t.replace(/[^0-9]/g, ''))}
                    keyboardType="number-pad"
                    placeholder="3"
                  />
                </View>
                <View style={{ width: theme.spacing(3) }} />
                <View style={{ flex: 1 }}>
                  <Field
                    label="Reps / Time"
                    value={draft.repsOrTime}
                    onChangeText={(t) => set('repsOrTime', t)}
                    placeholder="10 or 30 min"
                  />
                </View>
              </View>
              <Field
                label="Weight (kg)"
                value={draft.weight}
                onChangeText={(t) => set('weight', t.replace(/[^0-9.]/g, ''))}
                keyboardType="decimal-pad"
                placeholder="optional"
              />
              <Field
                label="Notes"
                value={draft.notes}
                onChangeText={(t) => set('notes', t)}
                placeholder="How did it feel?"
                multiline
                style={{ minHeight: 70, textAlignVertical: 'top' }}
              />
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Completed</Text>
                <Switch
                  value={draft.completed}
                  onValueChange={(v) => set('completed', v)}
                  trackColor={{ true: theme.colors.primary, false: theme.colors.track }}
                  thumbColor="#fff"
                />
              </View>

              <Button
                title={draft.id ? 'Save Changes' : 'Add Session'}
                onPress={() => onSave(draft)}
                disabled={!canSave}
                style={{ marginTop: theme.spacing(2) }}
              />
              {onDelete ? (
                <Button
                  title="Delete Session"
                  variant="ghost"
                  onPress={onDelete}
                  style={{ marginTop: theme.spacing(2) }}
                />
              ) : null}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheetWrap: { width: '100%' },
  sheet: {
    backgroundColor: theme.colors.bg,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing(4),
    paddingTop: theme.spacing(2),
    maxHeight: '92%',
    borderTopWidth: 1,
    borderColor: theme.colors.border,
  },
  handle: {
    alignSelf: 'center',
    width: 42,
    height: 5,
    borderRadius: 3,
    backgroundColor: theme.colors.border,
    marginBottom: theme.spacing(3),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(4),
  },
  title: { color: theme.colors.text, fontSize: theme.font.h2, fontWeight: '800' },
  close: { color: theme.colors.textMuted, fontSize: 20, fontWeight: '700' },
  row: { flexDirection: 'row' },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  switchLabel: { color: theme.colors.text, fontSize: theme.font.body, fontWeight: '600' },
});
