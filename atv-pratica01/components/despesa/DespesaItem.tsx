import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Expense } from '../../constants/despesas';

type DespesaItemProps = {
  despesa: Expense;
};

function getDataFormatada(data: Date) {
  return `${data.getDate()}/${data.getMonth() + 1}/${data.getFullYear()}`;
}

export default function DespesaItem({ despesa }: DespesaItemProps) {
  return (
    <Pressable style={({ pressed }) => [styles.container, pressed && styles.pressed]}>
      <View>
        <Text style={styles.description}>{despesa.description}</Text>
        <Text style={styles.date}>{getDataFormatada(despesa.date)}</Text>
      </View>
      <View style={styles.amountContainer}>
        <Text style={styles.amount}>R$ {despesa.amount.toFixed(2)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  pressed: {
    opacity: 0.85,
  },
  description: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3d2431',
    marginBottom: 4,
  },
  date: {
    fontSize: 13,
    color: '#8c6674',
  },
  amountContainer: {
    minWidth: 92,
    backgroundColor: '#fde7ef',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  amount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#b84b62',
  },
});
