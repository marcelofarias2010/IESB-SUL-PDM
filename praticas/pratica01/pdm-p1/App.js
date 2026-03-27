import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button,TextInput } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Olá, Ian! Meu primeiro App.</Text>
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

  titulo_text: {
    margin: 20,
    color: '#ff0000',
    fontSize: 30
  }
});


