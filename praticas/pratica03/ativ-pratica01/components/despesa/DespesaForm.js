import { useState } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import Input from './Input';
import Button from '../Button'; 

export default function DespesaForm({ onCancel, onSubmit, submitButtonLabel }) {
  const [inputs, setInputs] = useState({
    valor: '',
    data: '',
    descricao: '',
  });

  function inputChangedHandler(inputIdentifier, enteredValue) {
    setInputs((curInputs) => {
      return { ...curInputs, [inputIdentifier]: enteredValue };
    });
  }

  function submitHandler() {
    const despesaData = {
      valor: +inputs.valor, 
      data: new Date(inputs.data),
      descricao: inputs.descricao,
    };

    const valorValido = !isNaN(despesaData.valor) && despesaData.valor > 0;
    const dataValida = despesaData.data.toString() !== 'Invalid Date';
    const descricaoValida = despesaData.descricao.trim().length > 0;

    if (!valorValido || !dataValida || !descricaoValida) {
      Alert.alert('Dados Inválidos', 'Por favor, confira os campos preenchidos (Data deve ser AAAA-MM-DD).');
      return;
    }

    onSubmit(despesaData);
  }

  return (
    <View style={styles.form}>
      <Text style={styles.title}>Sua Despesa</Text>
      <View style={styles.inputsRow}>
        <Input
          label="Valor"
          textInputConfig={{
            keyboardType: 'decimal-pad',
            onChangeText: inputChangedHandler.bind(this, 'valor'),
            value: inputs.valor,
          }}
        />
        <Input
          label="Data"
          textInputConfig={{
            placeholder: 'YYYY-MM-DD',
            maxLength: 10,
            onChangeText: inputChangedHandler.bind(this, 'data'),
            value: inputs.data,
          }}
        />
      </View>
      <Input
        label="Descrição"
        textInputConfig={{
          multiline: true,
          onChangeText: inputChangedHandler.bind(this, 'descricao'),
          value: inputs.descricao,
        }}
      />
      <View style={styles.buttons}>
        <Button style={styles.button} mode="flat" onPress={onCancel}>
          Cancelar
        </Button>
        <Button style={styles.button} onPress={submitHandler}>
          {submitButtonLabel}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: { marginTop: 40 },
  title: { fontSize: 24, fontWeight: 'bold', color: 'black', marginVertical: 24, textAlign: 'center' },
  inputsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  buttons: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 16 },
  button: { minWidth: 120, marginHorizontal: 8 },
});