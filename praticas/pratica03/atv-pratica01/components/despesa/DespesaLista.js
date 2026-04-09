import { FlatList } from 'react-native';
import DespesaItem from './DespesaItem';

function renderDespesaItem(itemData) {
  return <DespesaItem item={itemData.item} />;
}

function DespesaLista({ despesas }) {
  return (
    <FlatList
      data={despesas}
      renderItem={renderDespesaItem}
      keyExtractor={(item) => item.id}
    />
  );
}

export default DespesaLista;