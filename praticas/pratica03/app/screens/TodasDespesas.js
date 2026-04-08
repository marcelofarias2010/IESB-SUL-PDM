import { View, StyleSheet } from 'react-native';
import DespesaSaida from '../components/despesa/DespesaSaida';

export default function TodasDespesas() {
  return (
    <View style={styles.container}>
      <DespesaSaida despesas={DESPESAS_TESTE} periodo="Total" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

const DESPESAS_TESTE = [
  { id: 'd1', descricao: 'Sapatos', valor: 59.99, data: new Date('2023-10-12') },
  { id: 'd2', descricao: 'Livro de React Native', valor: 25.50, data: new Date('2023-10-15') },
  { id: 'd3', descricao: 'Café', valor: 4.00, data: new Date() },
];

