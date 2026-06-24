import { StyleSheet, Text, View } from 'react-native';

interface ComingSoonProps {
  /** Spanish name of the feature that will live on this screen. */
  feature: string;
}

/** Placeholder for tab screens whose stories are not yet implemented. */
export function ComingSoon({ feature }: ComingSoonProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{feature}</Text>
      <Text style={styles.subtitle}>Próximamente</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2933',
  },
  subtitle: {
    fontSize: 15,
    color: '#9aa5b1',
  },
});
