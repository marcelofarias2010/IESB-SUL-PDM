import { StyleSheet, Text, View } from 'react-native';

import type { Expense } from '../../constants/despesas';

type DespesaSumarioProps = {
  despesas: Expense[];
  periodo: string;
};

export default function DespesaSumario({ despesas, periodo }: DespesaSumarioProps) {
  const somaDespesas = despesas.reduce((acumulador, despesa) => acumulador + despesa.amount, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.periodo}>{periodo}</Text>
      <Text style={styles.total}>R$ {somaDespesas.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffe9ef',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  periodo: {
    color: '#7f5361',
    fontSize: 14,
    fontWeight: '600',
  },
  total: {
    color: '#b84b62',
    fontSize: 20,
    fontWeight: '800',
  },
});
