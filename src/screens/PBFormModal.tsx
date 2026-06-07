import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { Button, Field } from '../components/ui';
import { ChipSelect } from '../components/ChipSelect';
import { PBUnit, PersonalBest } from '../types';
import { toDateKey } from '../stats';

const UNITS: PBUnit[] = ['kg', 'reps', 'mins'];

export interface PBDraft {
  id?: string;
  exercise: string;
  startingWeight: string;
  currentPB: string;
  target: string;
  dateSet: string;
  unit: PBUnit;
}

function emptyDraft(): PBDraft {
  return {
    exercise: '',
    startingWeight: '',
    currentPB: '',
    target: '',
    dateSet: toDateKey(new Date()),
    unit: 'kg',
  };
}

export function pbToDraft(pb: PersonalBest): PBDraft {
  return {
    id: pb.id,
    exercise: pb.exercise,
    startingWeight: `${pb.startingWeight}`,
    currentPB: `${pb.currentPB}`,
    target: `${pb.target}`,
    dateSet: pb.dateSet || toDateKey(new Date()),
    unit: pb.unit,
  };
}

export function PBFormModal({
  visible,
  initial,
  onClose,
  onSave,
  onDelete,
}: {
  visible: boolean;
  initial?: PBDraft;
  onClose: () => void;
  onSave: (draft: PBDraft) => void;
  onDelete?: () => void;
}) {
  const insets = useSafeAreaInsets();
  const [draft, setDraft] = useState<PBDraft>(emptyDraft());

  useEffect(() => {
    if (visible) setDraft(initial ?? emptyDraft());
  }, [visible, initial]);

  const set = <K extends keyof PBDraft>(k: K, v: PBDraft[K]) =>
    setDraft((d) => ({ ...d, [k]: v }));

  const num = (t: string) => t.replace(/[^0-9.]/g, '');
  const canSave = draft.exercise.trim().length > 0;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ width: '100%' }}
        >
          <View style={[styles.sheet, { paddingBottom: insets.bottom + theme.spacing(4) }]}>
            <View style={styles.handle} />
            <View style={styles.header}>
              <Text style={styles.title}>{draft.id ? 'Edit PB' : 'New PB'}</Text>
              <Pressable onPress={onClose} hitSlop={12}>
                <Text style={styles.close}>✕</Text>
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <Field
                label="Lift / Exercise"
                value={draft.exercise}
                onChangeText={(t) => set('exercise', t)}
                placeholder="e.g. Bench Press"
              />
              <ChipSelect
                label="Unit"
                options={UNITS}
                value={draft.unit}
                onChange={(v) => set('unit', v)}
              />
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Field
                    label="Starting"
                    value={draft.startingWeight}
                    onChangeText={(t) => set('startingWeight', num(t))}
                    keyboardType="decimal-pad"
                    placeholder="0"
                  />
                </View>
                <View style={{ width: theme.spacing(3) }} />
                <View style={{ flex: 1 }}>
                  <Field
                    label="Current PB"
                    value={draft.currentPB}
                    onChangeText={(t) => set('currentPB', num(t))}
                    keyboardType="decimal-pad"
                    placeholder="0"
                  />
                </View>
              </View>
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Field
                    label="Target"
                    value={draft.target}
                    onChangeText={(t) => set('target', num(t))}
                    keyboardType="decimal-pad"
                    placeholder="0"
                  />
                </View>
                <View style={{ width: theme.spacing(3) }} />
                <View style={{ flex: 1 }}>
                  <Field
                    label="Date Set"
                    value={draft.dateSet}
                    onChangeText={(t) => set('dateSet', t)}
                    placeholder="YYYY-MM-DD"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <Button
                title={draft.id ? 'Save Changes' : 'Add PB'}
                onPress={() => onSave(draft)}
                disabled={!canSave}
                style={{ marginTop: theme.spacing(2) }}
              />
              {onDelete ? (
                <Button
                  title="Delete PB"
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
});
