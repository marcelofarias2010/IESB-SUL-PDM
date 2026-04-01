import { Text } from 'react-native';
import { View } from 'react-native';
import DespesaSumario from './Despesasumario';
import DespesaLista from './Despesalista';

function DespesaSaida({despesas, periodo}){

  return (
    <View>
      <DespesaSumario despesas={despesas} periodo={periodo}/>
      <DespesaLista despesas={despesas}/>
    </View>
  )

}

export default DespesaSaida;