//importações
import { StatusBar } from 'expo-status-bar';
import {StyleSheet, Text, View } from 'react-native';
import {rotulo_input_meta, rotulo_btn_cadastro_meta, rotulo_lista_metas} from './mensagens.js';

export default function App(){
    return (
    <view style={styles.container}>

      //Coluna 1
      <View>
        <View>
        <TextInput style = {styles.inputText} placeholder = {rotulo_input_meta} />
        </View>   
        <View>
          <Button Title = {rotulo_btn_cadastro_meta}/>
        </View>
      </View>

      //Coluna 2

      <View>
        <Text> {rotulo_lista_metas} </Text>
      </View>
      
   </view>
   );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
