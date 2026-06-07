import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';

export function ChipSelect<T extends string>({
  options,
  value,
  onChange,
  colorFor,
  label,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  colorFor?: (v: T) => string;
  label?: string;
}) {
  return (
    <View style={{ marginBottom: theme.spacing(3) }}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.wrap}>
        {options.map((opt) => {
          const active = opt === value;
          const color = colorFor ? colorFor(opt) : theme.colors.primary;
          return (
            <Pressable
              key={opt}
              onPress={() => onChange(opt)}
              style={[
                styles.chip,
                active && { backgroundColor: color + '22', borderColor: color },
              ]}
            >
              <Text style={[styles.chipText, active && { color }]}>{opt}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: theme.colors.textMuted,
    fontSize: theme.font.small,
    fontWeight: '600',
    marginBottom: theme.spacing(2),
  },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing(2) },
  chip: {
    paddingHorizontal: theme.spacing(3.5),
    paddingVertical: theme.spacing(2.5),
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surfaceAlt,
  },
  chipText: {
    color: theme.colors.textMuted,
    fontSize: theme.font.small,
    fontWeight: '600',
  },
});
