import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { useMemo, useState } from 'react';
import {
  Alert,
  Button,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

function formatDate(data) {
  return `${data.getDate()}/${data.getMonth() + 1}/${data.getFullYear()}`;
}

function GerenciarDespesa() {
  const navigation = useNavigation();
  const [data, setData] = useState(new Date());
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [showPicker, setShowPicker] = useState(false);

  const dataFormatada = useMemo(() => formatDate(data), [data]);

  function onChange(event, selectedDate) {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (selectedDate) {
      setData(selectedDate);
    }
  }

  function salvarDespesa() {
    Alert.alert(
      'Despesa salva',
      `Descricao: ${descricao || 'Sem descricao'}\nValor: R$ ${valor || '0,00'}\nData: ${dataFormatada}`
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Gerenciar Despesa</Text>
      <Text style={styles.subtitle}>Cadastre, edite ou remova uma despesa.</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Valor da despesa</Text>
        <TextInput
          style={styles.input}
          keyboardType="decimal-pad"
          placeholder="Ex.: 39.90"
          value={valor}
          onChangeText={setValor}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Data da despesa</Text>
        <Pressable style={styles.dateButton} onPress={() => setShowPicker(true)}>
          <Text style={styles.dateText}>{dataFormatada}</Text>
        </Pressable>
        {showPicker && (
          <DateTimePicker value={data} mode="date" display="default" onChange={onChange} />
        )}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Descricao</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Digite uma descricao"
          multiline
          maxLength={80}
          value={descricao}
          onChangeText={setDescricao}
        />
      </View>

      <View style={styles.actions}>
        <View style={styles.actionButton}>
          <Button title="Cancelar" color="#8c6674" onPress={() => navigation.goBack()} />
        </View>
        <View style={styles.actionButton}>
          <Button title="Salvar" color="#b84b62" onPress={salvarDespesa} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff7fa',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#3d2431',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#8c6674',
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7f5361',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#f0cad6',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#3d2431',
  },
  textArea: {
    minHeight: 110,
    textAlignVertical: 'top',
  },
  dateButton: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#f0cad6',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  dateText: {
    color: '#3d2431',
    fontSize: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
  },
});

export default GerenciarDespesa;
