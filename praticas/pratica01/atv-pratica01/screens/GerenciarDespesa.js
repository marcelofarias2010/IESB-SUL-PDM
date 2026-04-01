import { View, Text, TextInput, StyleSheet, Pressable, Platform } from 'react-native';
import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';

function GerenciarDespesa({ navigation }) {
  const [data, setData] = useState(new Date());
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [showPicker, setShowPicker] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || data;
    // No Android, o calendário fecha sozinho após a escolha. 
    // No iOS, precisamos lidar de forma um pouco diferente.
    setShowPicker(Platform.OS === 'ios');
    setData(currentDate);
  };

  const handleChangeValor = (text) => {
    const cleanText = text.replace(',', '.');
    const match = cleanText.match(/^\d*\.?\d{0,2}$/);
    if (match) {
      setValor(cleanText);
    }
  };

  function cancelarHandler() {
    navigation.goBack();
  }

  function confirmarHandler() {
    console.log("Salvar:", { descricao, valor, data });
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Descrição</Text>
        <TextInput 
          style={styles.input} 
          maxLength={20}
          value={descricao} 
          onChangeText={setDescricao} 
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Valor da Despesa</Text>
        <TextInput 
          style={styles.input}
          keyboardType={'decimal-pad'} 
          maxLength={10}
          value={valor} 
          onChangeText={handleChangeValor} 
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Data da Despesa</Text>
        <Pressable onPress={() => setShowPicker(true)} style={styles.input}>
          <Text>{data.toLocaleDateString('pt-BR')}</Text>
        </Pressable>
        
        {showPicker && (
          <DateTimePicker 
            value={data} 
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'} 
            onChange={onChange}
          />
        )}
        
        {/* Botão extra para fechar o calendário no iOS se ele ficar travado na tela */}
        {showPicker && Platform.OS === 'ios' && (
          <Pressable onPress={() => setShowPicker(false)}>
            <Text style={styles.fecharCalendario}>Confirmar Data</Text>
          </Pressable>
        )}
      </View>

      {/* Botões de Ação */}
      <View style={styles.botoesContainer}>
        <Pressable style={[styles.botao, styles.botaoCancelar]} onPress={cancelarHandler}>
          <Text style={styles.botaoTextoCancelar}>Cancelar</Text>
        </Pressable>
        
        <Pressable style={[styles.botao, styles.botaoAdicionar]} onPress={confirmarHandler}>
          <Text style={styles.botaoTexto}>Adicionar</Text>
        </Pressable>
      </View>
      
    </View>
  );
}

export default GerenciarDespesa;

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
  fecharCalendario: {
    color: '#3b82f6',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  botoesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  botao: {
    minWidth: 120,
    marginHorizontal: 8,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  botaoCancelar: {
    backgroundColor: 'transparent',
  },
  botaoAdicionar: {
    backgroundColor: '#3b82f6', // Azulzinho padrão
  },
  botaoTexto: {
    color: 'white',
    fontWeight: 'bold',
  },
  botaoTextoCancelar: {
    color: '#f43f5e', // Vermelhinho
    fontWeight: 'bold',
  }
});