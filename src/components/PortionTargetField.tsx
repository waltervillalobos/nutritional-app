import { StyleSheet, Text, TextInput, View } from 'react-native';
import { FoodCategory } from '../domain/entities/FoodCategory';
import { foodCategoryLabels } from '../constants/foodCategoryLabels';

interface PortionTargetFieldProps {
  category: FoodCategory;
  dailyPortions: number;
  onChange: (category: FoodCategory, dailyPortions: number) => void;
}

/**
 * One labeled numeric input for a category's daily portions. The single source
 * of portion-input UI, reused for every category row (and reusable by a future
 * onboarding step), so the input behaviour is never duplicated (DRY).
 */
export function PortionTargetField({
  category,
  dailyPortions,
  onChange,
}: PortionTargetFieldProps) {
  const handleChangeText = (text: string) => {
    const normalized = text.replace(',', '.');
    const parsed = Number.parseFloat(normalized);
    onChange(category, Number.isNaN(parsed) ? 0 : parsed);
  };

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{foodCategoryLabels[category]}</Text>
      <TextInput
        style={styles.input}
        keyboardType="decimal-pad"
        value={dailyPortions === 0 ? '' : String(dailyPortions)}
        placeholder="0"
        onChangeText={handleChangeText}
        accessibilityLabel={`Porciones de ${foodCategoryLabels[category]}`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#cbd2d9',
  },
  label: {
    fontSize: 17,
    color: '#1f2933',
  },
  input: {
    minWidth: 72,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 17,
    textAlign: 'right',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#9aa5b1',
    borderRadius: 8,
    color: '#1f2933',
  },
});
