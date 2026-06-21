import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Stack } from 'expo-router';
import { bootstrapDatabase } from '../src/data/db/migrate';
import { usePortionTargetStore } from '../src/store/usePortionTargetStore';

/**
 * Root layout. Runs the first-launch DB bootstrap and rehydrates the portion-target
 * store before rendering any screen.
 *
 * Boot-sequence seam (project-structure.md §4): once onboarding (US-14) exists, this
 * is where an empty `portion_target` table should redirect to /onboarding/welcome.
 * For now US-01 routes straight to the tabs, where Settings is the entry point.
 */
export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const loadTargets = usePortionTargetStore((state) => state.load);

  useEffect(() => {
    let active = true;
    (async () => {
      await bootstrapDatabase();
      await loadTargets();
      if (active) {
        setIsReady(true);
      }
    })();
    return () => {
      active = false;
    };
  }, [loadTargets]);

  if (!isReady) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Preparando tu plan…</Text>
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 15,
    color: '#616e7c',
  },
});
