import { View, Text, StyleSheet } from 'react-native';

export default function DespesaSumario({ despesas, periodo }) {
  // O método reduce vai percorrer a lista de despesas e somar os valores
  const somaDespesas = despesas.reduce((soma, despesa) => {
    return soma + despesa.valor;
  }, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.periodo}>{periodo}</Text>
      <Text style={styles.soma}>R$ {somaDespesas.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: 12, 
    backgroundColor: '#e2eafc', 
    borderRadius: 6 
  },
  periodo: { fontSize: 14, color: '#3b021f' },
  soma: { fontSize: 16, fontWeight: 'bold', color: '#3b021f' }
});