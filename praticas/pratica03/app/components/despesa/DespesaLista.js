import { FlatList } from 'react-native';
import DespesaItem from './DespesaItem';

function renderizarItemDespesa(itemData) {
  return <DespesaItem {...itemData.item} />;
}

export default function DespesaLista({ despesas }) {
  return (
    <FlatList
      data={despesas}
      renderItem={renderizarItemDespesa}
      keyExtractor={(item) => item.id}
    />
  );
}