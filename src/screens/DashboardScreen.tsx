import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../store';
import { theme } from '../theme';
import {
  BOTTOM_BAR_SPACE,
  Card,
  ProgressBar,
  SCREEN_PADDING,
  ScreenHeader,
  SectionTitle,
} from '../components/ui';
import {
  currentLevel,
  pbImprovement,
  sessionsByMuscleGroup,
  sessionsThisMonth,
  sessionsThisWeek,
  sessionsToNextLevel,
  dayStreak,
  topPersonalBests,
  totalSessions,
  weeklyAverage,
  weeklyTrend,
} from '../stats';
import { MUSCLE_GROUPS } from '../types';

function StatTile({
  value,
  label,
  accent,
}: {
  value: string;
  label: string;
  accent?: string;
}) {
  return (
    <View style={styles.tile}>
      <Text style={[styles.tileValue, accent ? { color: accent } : null]}>{value}</Text>
      <Text style={styles.tileLabel}>{label}</Text>
    </View>
  );
}

export function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const { data } = useStore();
  const { sessions, settings, personalBests } = data;

  const stats = useMemo(() => {
    const total = totalSessions(sessions);
    return {
      total,
      month: sessionsThisMonth(sessions),
      week: sessionsThisWeek(sessions),
      streak: dayStreak(sessions),
      avg: weeklyAverage(sessions),
      level: currentLevel(total),
      toNext: sessionsToNextLevel(total),
      byGroup: sessionsByMuscleGroup(sessions),
      trend: weeklyTrend(sessions, 8),
      topPBs: topPersonalBests(personalBests, 4),
    };
  }, [sessions, personalBests]);

  const goalPct = settings.weeklyGoal > 0 ? stats.week / settings.weeklyGoal : 0;
  const maxTrend = Math.max(1, ...stats.trend.map((t) => t.count));
  const maxGroup = Math.max(1, ...Object.values(stats.byGroup), 1);

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
      <ScreenHeader
        title={`Hey ${settings.name || 'Athlete'}`}
        subtitle="Track the work, keep the streak, chase the next level."
      />

      <Card style={styles.heroCard}>
        <View style={styles.heroTop}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelBadgeText}>{stats.level.name.toUpperCase()}</Text>
          </View>
          <Text style={styles.heroCaption}>Current level</Text>
        </View>
        <Text style={styles.heroValue}>{stats.total}</Text>
        <Text style={styles.heroLabel}>completed sessions</Text>
        <Text style={styles.levelSub}>
          {stats.toNext === null
            ? 'Top tier reached'
            : `${stats.toNext} sessions to next level`}
        </Text>
      </Card>

      <View style={styles.tileGrid}>
        <StatTile value={`${stats.month}`} label="THIS MONTH" accent={theme.colors.accent} />
        <StatTile value={`${stats.week}`} label="THIS WEEK" accent={theme.colors.primary} />
        <StatTile value={`${stats.streak}`} label="DAY STREAK" accent={theme.colors.warn} />
        <StatTile value={stats.avg.toFixed(1)} label="WEEKLY AVG" accent={theme.colors.groupColors.Arms} />
      </View>

      <Card style={styles.stackCard}>
        <SectionTitle>Weekly Goal</SectionTitle>
        <View style={styles.goalRow}>
          <Text style={styles.goalBig}>
            {stats.week}
            <Text style={styles.goalSmall}> / {settings.weeklyGoal} days</Text>
          </Text>
          <Text style={styles.goalPct}>{Math.round(goalPct * 100)}%</Text>
        </View>
        <ProgressBar
          value={goalPct}
          color={goalPct >= 1 ? theme.colors.primary : theme.colors.accent}
          height={12}
        />
        <Text style={styles.goalHint}>
          {goalPct >= 1
            ? 'Goal smashed for this week.'
            : `${Math.max(0, settings.weeklyGoal - stats.week)} more to hit your weekly goal.`}
        </Text>
      </Card>

      <Card style={styles.stackCard}>
        <SectionTitle>Sessions / Week</SectionTitle>
        <View style={styles.chart}>
          {stats.trend.map((t, i) => (
            <View key={i} style={styles.barCol}>
              <Text style={styles.barCount}>{t.count > 0 ? t.count : ''}</Text>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    {
                      height: `${(t.count / maxTrend) * 100}%`,
                      backgroundColor:
                        i === stats.trend.length - 1
                          ? theme.colors.primary
                          : theme.colors.surfaceAlt,
                      borderColor:
                        i === stats.trend.length - 1
                          ? theme.colors.primary
                          : theme.colors.border,
                    },
                  ]}
                />
              </View>
              <Text style={styles.barLabel}>{t.label}</Text>
            </View>
          ))}
        </View>
      </Card>

      <Card style={styles.stackCard}>
        <SectionTitle>Sessions by Muscle Group</SectionTitle>
        {MUSCLE_GROUPS.map((g) => {
          const count = stats.byGroup[g] ?? 0;
          const color = theme.colors.groupColors[g];
          return (
            <View key={g} style={styles.groupRow}>
              <Text style={styles.groupName}>{g}</Text>
              <View style={styles.groupBarWrap}>
                <View
                  style={[
                    styles.groupBar,
                    { width: `${(count / maxGroup) * 100}%`, backgroundColor: color },
                  ]}
                />
              </View>
              <Text style={styles.groupCount}>{count}</Text>
            </View>
          );
        })}
      </Card>

      <Card style={styles.stackCard}>
        <SectionTitle>Top Personal Bests</SectionTitle>
        {stats.topPBs.length === 0 ? (
          <Text style={styles.goalHint}>Log some PBs in the PB tab to see them here.</Text>
        ) : (
          stats.topPBs.map((pb) => {
            const imp = pbImprovement(pb);
            return (
              <View key={pb.id} style={styles.pbRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.pbName}>{pb.exercise}</Text>
                  <Text style={styles.pbSub}>
                    {pb.currentPB} {pb.unit} • target {pb.target} {pb.unit}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.pbImp,
                    { color: imp >= 0 ? theme.colors.primary : theme.colors.danger },
                  ]}
                >
                  {imp >= 0 ? '+' : ''}
                  {imp} {pb.unit}
                </Text>
              </View>
            );
          })
        )}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.bg },
  heroCard: {
    backgroundColor: theme.colors.elevated,
    marginBottom: theme.spacing(3),
    padding: theme.spacing(5),
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(3),
  },
  levelBadge: {
    backgroundColor: theme.colors.primary + '22',
    borderColor: theme.colors.primary,
    borderWidth: 1,
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing(3),
    paddingVertical: theme.spacing(1.5),
  },
  levelBadgeText: {
    color: theme.colors.primary,
    fontSize: theme.font.tiny,
    fontWeight: '800',
    letterSpacing: 1,
  },
  heroCaption: {
    color: theme.colors.textFaint,
    fontSize: theme.font.tiny,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  heroValue: {
    color: theme.colors.text,
    fontSize: 52,
    fontWeight: '900',
    lineHeight: 58,
    marginTop: theme.spacing(4),
    fontVariant: ['tabular-nums'],
  },
  heroLabel: {
    color: theme.colors.textMuted,
    fontSize: theme.font.body,
    fontWeight: '700',
  },
  levelSub: {
    color: theme.colors.textMuted,
    fontSize: theme.font.small,
    lineHeight: 19,
    marginTop: theme.spacing(3),
  },
  tileGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing(3) },
  tile: {
    flexGrow: 1,
    flexBasis: '46%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing(4),
  },
  tileValue: {
    color: theme.colors.text,
    fontSize: 30,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  tileLabel: {
    color: theme.colors.textMuted,
    fontSize: theme.font.tiny,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: theme.spacing(1),
  },
  stackCard: { marginTop: theme.spacing(3) },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(3),
  },
  goalBig: { color: theme.colors.text, fontSize: 28, fontWeight: '800' },
  goalSmall: { color: theme.colors.textMuted, fontSize: theme.font.body, fontWeight: '600' },
  goalPct: {
    color: theme.colors.primary,
    fontSize: theme.font.h3,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  goalHint: {
    color: theme.colors.textMuted,
    fontSize: theme.font.small,
    lineHeight: 19,
    marginTop: theme.spacing(3),
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 150,
  },
  barCol: { flex: 1, alignItems: 'center', height: '100%', justifyContent: 'flex-end' },
  barCount: {
    color: theme.colors.textMuted,
    fontSize: theme.font.tiny,
    marginBottom: 2,
    fontVariant: ['tabular-nums'],
  },
  barTrack: { height: 110, width: 14, justifyContent: 'flex-end' },
  barFill: { width: 14, borderRadius: 7, borderWidth: 1, minHeight: 4 },
  barLabel: { color: theme.colors.textFaint, fontSize: 9, marginTop: theme.spacing(1.5) },
  groupRow: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing(2.5) },
  groupName: { color: theme.colors.text, fontSize: theme.font.small, width: 78 },
  groupBarWrap: {
    flex: 1,
    height: 10,
    backgroundColor: theme.colors.track,
    borderRadius: 6,
    overflow: 'hidden',
    marginHorizontal: theme.spacing(2),
  },
  groupBar: { height: 10, borderRadius: 6, minWidth: 2 },
  groupCount: {
    color: theme.colors.textMuted,
    fontSize: theme.font.small,
    width: 24,
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
  pbRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing(2.5),
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  pbName: { color: theme.colors.text, fontSize: theme.font.body, fontWeight: '600' },
  pbSub: { color: theme.colors.textFaint, fontSize: theme.font.tiny, marginTop: 2 },
  pbImp: {
    fontSize: theme.font.body,
    fontWeight: '900',
    marginLeft: theme.spacing(3),
    fontVariant: ['tabular-nums'],
  },
});
