import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function GerenciarDespesa() {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [data, setData] = useState(new Date());
  const [mostrarCalendario, setMostrarCalendario] = useState(false);

  function aoMudarData(evento, dataSelecionada) {
    setMostrarCalendario(false); 
    
    if (dataSelecionada) {
      setData(dataSelecionada); 
    }
  }

  function confirmarDespesa() {
    console.log("Despesa a salvar: ", { 
      descricao, 
      valor, 
      data: data.toLocaleDateString('pt-BR') 
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Adicionar Nova Despesa</Text>

      <Text style={styles.label}>Descrição</Text>
      <TextInput 
        style={styles.input}
        value={descricao}
        onChangeText={setDescricao}
        placeholder="Ex: Almoço no restaurante"
      />

      <Text style={styles.label}>Valor (R$)</Text>
      <TextInput 
        style={styles.input}
        value={valor}
        onChangeText={setValor}
        keyboardType="decimal-pad"
        placeholder="Ex: 25.50"
      />

      <Text style={styles.label}>Data da Despesa</Text>
      <Pressable onPress={() => setMostrarCalendario(true)}>
        <View style={styles.input}>
          <Text>{data.toLocaleDateString('pt-BR')}</Text>
        </View>
      </Pressable>

      {mostrarCalendario && (
        <DateTimePicker
          value={data}
          mode="date"
          display="default"
          onChange={aoMudarData}
        />
      )}

      <View style={styles.botoesContainer}>
        <Button title="Salvar" onPress={confirmarDespesa} color="#3b021f" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 24, 
    backgroundColor: '#f5f5f5' 
  },
  titulo: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#3b021f', 
    marginBottom: 24, 
    textAlign: 'center' 
  },
  label: { 
    fontSize: 14, 
    marginBottom: 4, 
    color: '#3b021f', 
    fontWeight: 'bold' 
  },
  input: { 
    backgroundColor: 'white', 
    padding: 12, 
    borderRadius: 6, 
    marginBottom: 16, 
    fontSize: 16, 
    minHeight: 48, 
    justifyContent: 'center' 
  },
  botoesContainer: { 
    marginTop: 16 
  }
});