import React, { useState } from 'react';
import {Text} from 'react-native'
import { View, Text, TextInput, Pressable, StyleSheet,  } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';


function GerenciarDespesa() {   

const [data, setData] = useState(new Date());
const [valor, setValor] = useState('');
const [descricao, setDescricao] = useState('');

const [showPicker, setShowPicker] = useState(false);

const onChange = (event, selectedDate) => {
  const currentDate = selectedDate || data;
  setShowPicker(false);
  setData(currentDate);
};

  return (
    <View style={styles.container}>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Descrição</Text>
        <TextInput style={styles.input} maxLength={20} />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Valor da Despesa</Text>
        <TextInput 
          style={styles.input} 
          keyboardType={'decimal-pad'} 
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Data da Despesa</Text>
        <Pressable onPress={() => setShowPicker(true)} style={styles.input}>
          <text>{data.toLocaleDataString('pt-BR')}</text>
        </Pressable>
        {showPicker &&(
         <DataTimePicker value={data} mode="data"
          display="default" onChange={onChange} />
        )}
        <TextInput style={styles.input} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
  },
  inputContainer: {
    marginHorizontal: 4,
    marginVertical: 16,
  },
  label: {
    fontSize: 12,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
  },
});