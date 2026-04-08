import { FlatList, StyleSheet, Text } from 'react-native';

import type { Expense } from '../../constants/despesas';

import DespesaItem from './DespesaItem';

type DespesaListaProps = {
  despesas: Expense[];
};

export default function DespesaLista({ despesas }: DespesaListaProps) {
  return (
    <FlatList
      data={despesas}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <DespesaItem despesa={item} />}
      contentContainerStyle={styles.listContent}
      ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma despesa encontrada.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 24,
  },
  emptyText: {
    textAlign: 'center',
    color: '#8c6674',
    marginTop: 32,
    fontSize: 15,
  },
});
