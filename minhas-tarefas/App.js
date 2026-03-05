import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View, Image, TextInput } from 'react-native';
import {titulo} from './utils'
import qualquercoisa from './utils'
import { btn_cadastro_meta, rotulo_input_meta, rotulo_lista_meta } from './mensagens';

export default function App() {
  return (
    <View style={styles.mainContainer}>
      <TextInput placeholder={rotulo_input_meta}></TextInput>
      <Text>{rotulo_lista_meta}</Text>
      <Button title={btn_cadastro_meta}></Button>
      <Image source={require('./assets/OIP.webp')}></Image>
      <StatusBar style="auto" />
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
  mainContainer: {
    padding: 30,
  },
  button: {
    width:200
  }
});
