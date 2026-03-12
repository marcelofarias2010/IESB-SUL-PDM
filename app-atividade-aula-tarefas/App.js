import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { rotulo_input_meta , rotulo_btn_cadastro_meta , rotulo_lista_metas} from "./mensagens";
import { TextInput } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      //Coluna 1 
      <View>
        <View>
          <TextInput style = {styles.inputText} placeholder={rotulo_input_meta} />
        </View>
        <View>
          <Button title = {rotulo_btn_cadastro_meta}/>
        </View>
      </View>
      //coluna 2 
      <View>
        <Text>{rotulo_lista_metas}</Text> 
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContainer:{
    padding:30,
  },
  inputText: {
    borderColor: '#cccccc',
    borderWidth: 1
  }
  //test
});
