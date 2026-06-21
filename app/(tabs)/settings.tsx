import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { FOOD_CATEGORIES } from '../../src/domain/entities/PortionTarget';
import {
  selectDailyCalories,
  usePortionTargetStore,
} from '../../src/store/usePortionTargetStore';
import { CalorieDisplay } from '../../src/components/CalorieDisplay';
import { PortionTargetField } from '../../src/components/PortionTargetField';

/**
 * Settings / Portion Targets — the US-01 entry point (screen-flow.md §3).
 *
 * Six numeric inputs, a live-updating derived calorie total (US-02), and an
 * explicit save that persists locally (US-01 AC-2) and returns to Hoy (US-03).
 */
export default function SettingsScreen() {
  const targets = usePortionTargetStore((state) => state.targets);
  const setPortion = usePortionTargetStore((state) => state.setPortion);
  const save = usePortionTargetStore((state) => state.save);
  const status = usePortionTargetStore((state) => state.status);
  const calories = usePortionTargetStore(selectDailyCalories);

  const handleSave = async () => {
    await save();
    Alert.alert('Listo', 'Tus porciones se guardaron.');
    router.navigate('/');
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <CalorieDisplay calories={calories} />

      <Text style={styles.sectionTitle}>Porciones diarias por categoría</Text>
      <View style={styles.fields}>
        {FOOD_CATEGORIES.map((category) => (
          <PortionTargetField
            key={category}
            category={category}
            dailyPortions={targets[category] ?? 0}
            onChange={setPortion}
          />
        ))}
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSave}
        disabled={status === 'saving'}
        accessibilityRole="button"
      >
        <Text style={styles.saveButtonText}>
          {status === 'saving' ? 'Guardando…' : 'Guardar'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 4,
    fontSize: 15,
    fontWeight: '600',
    color: '#616e7c',
  },
  fields: {
    marginBottom: 24,
  },
  saveButton: {
    backgroundColor: '#3e7c59',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
  },
});
