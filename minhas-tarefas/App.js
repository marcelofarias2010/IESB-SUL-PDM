import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { rotulo_btn_cadastro_meta, rotulo_input_meta,rotulo_lista_meta } from './mensagens'; 


export default function App() {
  return (
    <View style={styles.mainContainer}>
      <TextInput placeholder={rotulo_input_meta}/>
      <Button title={rotulo_btn_cadastro_meta}/>
      <Text >{rotulo_lista_meta}</Text>
      <StatusBar style='auto'/>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d9e0de',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContainer:{
    padding: 30,
  },
});
