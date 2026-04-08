import { StyleSheet, View } from 'react-native';

import type { Expense } from '../../constants/despesas';

import DespesaLista from './DespesaLista';
import DespesaSumario from './DespesaSumario';

type DespesaSaidaProps = {
  despesas: Expense[];
  periodo: string;
};

export default function DespesaSaida({ despesas, periodo }: DespesaSaidaProps) {
  return (
    <View style={styles.container}>
      <DespesaSumario despesas={despesas} periodo={periodo} />
      <DespesaLista despesas={despesas} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff7fa',
  },
});
