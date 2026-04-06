import { View, StyleSheet } from 'react-native';
import DespesaSaida from '../components/despesa/DespesaSaida';

// Dados fictícios para testarmos a nossa lógica de soma
const DESPESAS_TESTE = [
  { id: 'd1', descricao: 'Sapatos', valor: 59.99, data: new Date('2023-10-12') },
  { id: 'd2', descricao: 'Livro de React Native', valor: 25.50, data: new Date('2023-10-15') },
  { id: 'd3', descricao: 'Café', valor: 4.00, data: new Date('2023-10-18') },
];

export default function DespesasRecentes() {
  return (
    <View style={styles.container}>
      {/* Passamos as nossas despesas e o título do período */}
      <DespesaSaida despesas={DESPESAS_TESTE} periodo="Últimos 7 dias" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }
});