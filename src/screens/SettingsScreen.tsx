import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../store';
import { theme } from '../theme';
import {
  BOTTOM_BAR_SPACE,
  Button,
  Card,
  Field,
  SCREEN_PADDING,
  ScreenHeader,
  SectionTitle,
} from '../components/ui';
import { GYM_LEVELS } from '../types';
import { currentLevel, totalSessions } from '../stats';

export function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { data, updateSettings, resetAll } = useStore();
  const { settings } = data;

  const [name, setName] = useState(settings.name);
  const [goal, setGoal] = useState(`${settings.weeklyGoal}`);
  const [bodyWeight, setBodyWeight] = useState(`${settings.bodyWeight}`);

  const total = totalSessions(data.sessions);
  const level = currentLevel(total);

  const save = () => {
    updateSettings({
      name: name.trim() || 'Athlete',
      weeklyGoal: Math.max(1, parseInt(goal, 10) || 1),
      bodyWeight: parseFloat(bodyWeight) || 0,
    });
    Alert.alert('Saved', 'Your setup has been updated.');
  };

  const confirmReset = () => {
    Alert.alert(
      'Reset everything?',
      'This deletes all sessions, PBs and settings. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetAll();
            setName('Athlete');
            setGoal('4');
            setBodyWeight('80');
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.screen}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        paddingTop: insets.top + theme.spacing(4),
        paddingBottom: BOTTOM_BAR_SPACE,
        paddingHorizontal: SCREEN_PADDING,
      }}
      showsVerticalScrollIndicator={false}
    >
      <ScreenHeader title="Settings" subtitle="Tune your goals and see how your level is tracking." />

      <Card>
        <SectionTitle>Your Setup</SectionTitle>
        <Field label="Your Name" value={name} onChangeText={setName} placeholder="Athlete" />
        <Field
          label="Weekly Gym Goal (days)"
          value={goal}
          onChangeText={(t) => setGoal(t.replace(/[^0-9]/g, ''))}
          keyboardType="number-pad"
          placeholder="4"
        />
        <Field
          label="Current Body Weight (kg)"
          value={bodyWeight}
          onChangeText={(t) => setBodyWeight(t.replace(/[^0-9.]/g, ''))}
          keyboardType="decimal-pad"
          placeholder="80"
        />
        <Button title="Save Setup" onPress={save} />
      </Card>

      <Card style={styles.stackCard}>
        <SectionTitle>Gym Levels</SectionTitle>
        {GYM_LEVELS.map((l) => {
          const active = l.name === level.name;
          const range =
            l.max === null ? `${l.min}+ sessions` : `${l.min}–${l.max} sessions`;
          return (
            <View
              key={l.name}
              style={[styles.levelRow, active && styles.levelRowActive]}
            >
              <View style={styles.levelLeft}>
                {active ? <View style={styles.activeDot} /> : <View style={styles.spacerDot} />}
                <Text style={[styles.levelName, active && { color: theme.colors.primary }]}>
                  {l.name}
                </Text>
              </View>
              <Text style={styles.levelRange}>{range}</Text>
            </View>
          );
        })}
        <Text style={styles.levelFoot}>
          You are <Text style={{ color: theme.colors.primary, fontWeight: '800' }}>{level.name}</Text>{' '}
          with {total} total sessions.
        </Text>
      </Card>

      <Card style={styles.stackCard}>
        <SectionTitle>Data</SectionTitle>
        <Text style={styles.dangerText}>
          Reset clears all of your logged sessions, personal bests and settings.
        </Text>
        <Button title="Reset All Data" variant="danger" onPress={confirmReset} />
      </Card>

      <Text style={styles.footer}>
        Gym & Workout Tracker · based on your spreadsheet
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.bg },
  stackCard: { marginTop: theme.spacing(3) },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing(2.5),
    paddingHorizontal: theme.spacing(3),
    borderRadius: theme.radius.sm,
    marginBottom: theme.spacing(1),
  },
  levelRowActive: { backgroundColor: theme.colors.primary + '14' },
  levelLeft: { flexDirection: 'row', alignItems: 'center' },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
    marginRight: theme.spacing(2.5),
  },
  spacerDot: { width: 8, height: 8, marginRight: theme.spacing(2.5) },
  levelName: { color: theme.colors.text, fontSize: theme.font.body, fontWeight: '700' },
  levelRange: {
    color: theme.colors.textMuted,
    fontSize: theme.font.small,
    fontVariant: ['tabular-nums'],
  },
  levelFoot: {
    color: theme.colors.textMuted,
    fontSize: theme.font.small,
    marginTop: theme.spacing(3),
  },
  dangerText: {
    color: theme.colors.textMuted,
    fontSize: theme.font.small,
    marginBottom: theme.spacing(3),
  },
  footer: {
    color: theme.colors.textFaint,
    fontSize: theme.font.tiny,
    textAlign: 'center',
    marginTop: theme.spacing(6),
  },
});
