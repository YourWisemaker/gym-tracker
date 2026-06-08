import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme';

export type TabKey = 'dashboard' | 'log' | 'pb' | 'settings';

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: 'dashboard', label: 'Home', icon: '■' },
  { key: 'log', label: 'Log', icon: '+' },
  { key: 'pb', label: 'PBs', icon: '★' },
  { key: 'settings', label: 'Setup', icon: '○' },
];

export function TabBar({
  active,
  onChange,
}: {
  active: TabKey;
  onChange: (k: TabKey) => void;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.bar,
        { paddingBottom: Math.max(insets.bottom, theme.spacing(2)) },
      ]}
    >
      {TABS.map((t) => {
        const isActive = t.key === active;
        return (
          <Pressable
            key={t.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            style={({ pressed }) => [
              styles.tab,
              isActive && styles.tabActive,
              pressed && { opacity: 0.72 },
            ]}
            onPress={() => onChange(t.key)}
          >
            <Text style={[styles.icon, isActive && styles.iconActive]}>{t.icon}</Text>
            <Text style={[styles.label, isActive && styles.labelActive]}>{t.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: theme.colors.bg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing(2),
    paddingHorizontal: theme.spacing(3),
    gap: theme.spacing(1),
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tab: {
    flex: 1,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    borderCurve: 'continuous',
  },
  tabActive: { backgroundColor: theme.colors.primary + '16' },
  icon: {
    color: theme.colors.textFaint,
    fontSize: 17,
    fontWeight: '900',
    marginBottom: 2,
    lineHeight: 19,
  },
  iconActive: { color: theme.colors.primary },
  label: {
    color: theme.colors.textFaint,
    fontSize: theme.font.tiny,
    fontWeight: '800',
  },
  labelActive: { color: theme.colors.primary },
});
