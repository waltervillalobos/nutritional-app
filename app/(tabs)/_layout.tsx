import { Tabs } from 'expo-router';

/**
 * Bottom tab bar (screen-flow.md §1). Tab labels are Spanish per the bilingual rule.
 * Only Settings (Ajustes) is functional in this US-01 slice; the other tabs are
 * placeholders for their own stories.
 */
export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen name="index" options={{ title: 'Hoy' }} />
      <Tabs.Screen name="recipes" options={{ title: 'Recetas' }} />
      <Tabs.Screen name="foods" options={{ title: 'Alimentos' }} />
      <Tabs.Screen name="settings" options={{ title: 'Ajustes' }} />
    </Tabs>
  );
}
