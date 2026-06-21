import { StyleSheet, Text, View } from 'react-native';

interface CalorieDisplayProps {
  /** Derived total daily calories (never stored — see Domain Rule 2). */
  calories: number;
}

/**
 * Shows the approximate derived daily calorie target, e.g. "~1,535 kcal" (US-02).
 * Purely presentational — the value is computed upstream from portion targets.
 */
export function CalorieDisplay({ calories }: CalorieDisplayProps) {
  const formatted = Math.round(calories).toLocaleString('en-US');

  return (
    <View style={styles.container}>
      <Text style={styles.value}>{`~${formatted} kcal`}</Text>
      <Text style={styles.caption}>Calorías diarias aproximadas</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  value: {
    fontSize: 34,
    fontWeight: '700',
    color: '#1f2933',
  },
  caption: {
    marginTop: 4,
    fontSize: 14,
    color: '#616e7c',
  },
});
