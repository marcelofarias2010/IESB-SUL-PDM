import { View, Text, StyleSheet } from 'react-native';
import DespesaSumario from './DespesaSumario';

export default function DespesaSaida({ despesas, periodo }) {
  return (
    <View style={styles.container}>
      {/* Aqui chamamos o Sumário e passamos os dados para ele */}
      <DespesaSumario despesas={despesas} periodo={periodo} />
      
      {/* Mais tarde vamos colocar o componente DespesaLista aqui! */}
      <Text style={styles.textoTemporario}>A lista de despesas vai aparecer aqui em breve...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 24, 
    backgroundColor: '#f5f5f5' 
  },
  textoTemporario: {
    textAlign: 'center',
    marginTop: 24,
    color: 'gray'
  }
});