import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { theme } from '../theme';

export const SCREEN_PADDING = theme.spacing(4);
export const BOTTOM_BAR_SPACE = theme.spacing(28);

export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

export function Label({ children }: { children: React.ReactNode }) {
  return <Text style={styles.label}>{children}</Text>;
}

export function ScreenHeader({
  title,
  subtitle,
  aside,
}: {
  title: string;
  subtitle?: string;
  aside?: React.ReactNode;
}) {
  return (
    <View style={styles.screenHeader}>
      <View style={{ flex: 1 }}>
        <Text style={styles.screenTitle}>{title}</Text>
        {subtitle ? <Text style={styles.screenSubtitle}>{subtitle}</Text> : null}
      </View>
      {aside ? <View>{aside}</View> : null}
    </View>
  );
}

export function Field({
  label,
  style,
  ...rest
}: TextInputProps & { label?: string }) {
  return (
    <View style={{ marginBottom: theme.spacing(3) }}>
      {label ? <Label>{label}</Label> : null}
      <TextInput
        placeholderTextColor={theme.colors.textFaint}
        style={[styles.input, style]}
        {...rest}
      />
    </View>
  );
}

export function FloatingActionButton({
  label,
  onPress,
  bottom,
}: {
  label: string;
  onPress: () => void;
  bottom: number;
}) {
  return (
    <View style={[styles.fabWrap, { bottom }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={onPress}
        hitSlop={10}
        style={({ pressed }) => [styles.fab, pressed && { transform: [{ scale: 0.96 }] }]}
      >
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </View>
  );
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled,
  style,
}: {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'ghost' | 'danger';
  disabled?: boolean;
  style?: ViewStyle;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.btn,
        variant === 'primary' && styles.btnPrimary,
        variant === 'ghost' && styles.btnGhost,
        variant === 'danger' && styles.btnDanger,
        pressed && { opacity: 0.75 },
        disabled && { opacity: 0.4 },
        style,
      ]}
    >
      <Text
        style={[
          styles.btnText,
          variant === 'primary' && { color: '#0B1F12' },
          variant === 'ghost' && { color: theme.colors.text },
          variant === 'danger' && { color: '#2A0B0B' },
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

export function Tag({ label, color }: { label: string; color: string }) {
  return (
    <View style={[styles.tag, { backgroundColor: color + '22', borderColor: color + '55' }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.tagText, { color }]}>{label}</Text>
    </View>
  );
}

export function ProgressBar({
  value,
  color = theme.colors.primary,
  height = 10,
}: {
  value: number; // 0..1
  color?: string;
  height?: number;
}) {
  const pct = Math.max(0, Math.min(1, value));
  return (
    <View style={[styles.progressTrack, { height, borderRadius: height }]}>
      <View
        style={{
          width: `${pct * 100}%`,
          height,
          borderRadius: height,
          backgroundColor: color,
        }}
      />
    </View>
  );
}

export function Loader() {
  return (
    <View style={styles.loader}>
      <ActivityIndicator color={theme.colors.primary} size="large" />
    </View>
  );
}

export function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyTitle}>{title}</Text>
      {subtitle ? <Text style={styles.emptySubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing(4),
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderCurve: 'continuous',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.22)',
  },
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing(3),
    marginBottom: theme.spacing(4),
  },
  screenTitle: {
    color: theme.colors.text,
    fontSize: theme.font.h1,
    fontWeight: '900',
    lineHeight: 34,
  },
  screenSubtitle: {
    color: theme.colors.textMuted,
    fontSize: theme.font.small,
    lineHeight: 19,
    marginTop: theme.spacing(1),
  },
  sectionTitle: {
    color: theme.colors.textMuted,
    fontSize: theme.font.tiny,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: theme.spacing(3),
  },
  label: {
    color: theme.colors.textMuted,
    fontSize: theme.font.small,
    fontWeight: '600',
    marginBottom: theme.spacing(2),
  },
  input: {
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing(3.5),
    paddingVertical: theme.spacing(3),
    color: theme.colors.text,
    fontSize: theme.font.body,
    minHeight: 48,
  },
  btn: {
    borderRadius: theme.radius.sm,
    paddingVertical: theme.spacing(3.5),
    paddingHorizontal: theme.spacing(4),
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    borderCurve: 'continuous',
  },
  btnPrimary: { backgroundColor: theme.colors.primary },
  btnGhost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  btnDanger: { backgroundColor: theme.colors.danger },
  btnText: { fontSize: theme.font.body, fontWeight: '700' },
  fabWrap: { position: 'absolute', right: SCREEN_PADDING },
  fab: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 14px 26px rgba(184, 242, 75, 0.28)',
  },
  fabText: {
    color: '#17220A',
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 38,
    marginTop: -2,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing(2.5),
    paddingVertical: theme.spacing(1.5),
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  dot: { width: 7, height: 7, borderRadius: 4, marginRight: 6 },
  tagText: { fontSize: theme.font.tiny, fontWeight: '700' },
  progressTrack: {
    backgroundColor: theme.colors.track,
    overflow: 'hidden',
    width: '100%',
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.bg,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: theme.spacing(10),
    paddingHorizontal: theme.spacing(6),
  },
  emptyTitle: {
    color: theme.colors.text,
    fontSize: theme.font.h3,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptySubtitle: {
    color: theme.colors.textMuted,
    fontSize: theme.font.small,
    textAlign: 'center',
    marginTop: theme.spacing(2),
  },
});
