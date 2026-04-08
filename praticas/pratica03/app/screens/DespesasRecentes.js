import { View, StyleSheet } from 'react-native';
import DespesaSaida from '../components/despesa/DespesaSaida';

const DESPESAS_TESTE = [
  { id: 'd1', descricao: 'Sapatos', valor: 59.99, data: new Date('2023-10-12') },
  { id: 'd2', descricao: 'Livro de React Native', valor: 25.50, data: new Date('2023-10-15') },
  { id: 'd3', descricao: 'Café', valor: 4.00, data: new Date() }, // Data de hoje para teste
];

export default function DespesasRecentes() {
  const despesasRecentes = DESPESAS_TESTE.filter((despesa) => {
    const hoje = new Date();
    const data7DiasAtras = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 7);
    
    return despesa.data >= data7DiasAtras && despesa.data <= hoje;
  });

  return (
    <View style={styles.container}>
      <DespesaSaida despesas={despesasRecentes} periodo="Últimos 7 dias" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});