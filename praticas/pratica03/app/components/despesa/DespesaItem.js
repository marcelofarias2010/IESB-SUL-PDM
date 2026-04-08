import { Pressable, View, Text, StyleSheet } from 'react-native';

export default function DespesaItem({ descricao, valor, data }) {
  return (
    <Pressable style={({ pressed }) => pressed && styles.pressed}>
      <View style={styles.despesaItem}>
        <View>
          <Text style={[styles.textoBase, styles.descricao]}>
            {descricao}
          </Text>
          <Text style={styles.textoBase}>{data.toLocaleDateString('pt-BR')}</Text>
        </View>
        <View style={styles.valorContainer}>
          <Text style={styles.valor}>R$ {valor.toFixed(2)}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.75,
  },
  despesaItem: {
    padding: 12,
    marginVertical: 8,
    backgroundColor: '#3b021f',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 6,
    elevation: 3,
    shadowColor: '#000',
    shadowRadius: 4,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
  },
  textoBase: {
    color: '#e2eafc',
  },
  descricao: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  valorContainer: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    minWidth: 80,
  },
  valor: {
    color: '#3b021f',
    fontWeight: 'bold',
  },
});