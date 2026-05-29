import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker'; 
import { router } from 'expo-router';
import { MoneyContext } from '../../contexts/GlobalState';
import { colors } from '../../constants/colors';
import { globalStyles } from '../../styles/globalStyles';

export default function AddTransactions() {
  const { categories, addTransaction } = useContext(MoneyContext);

  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const [type, setType] = useState('Saldo');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const filteredCategories = categories;

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios'); 
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleSave = async () => {
    if (!description || !value || !selectedCategory) {
      return Alert.alert('Erro', 'Preencha todos os campos.');
    }

    const numericValue = parseFloat(value.replace(/[^\d.,]/g, '').replace(',', '.'));
    const formattedDate = date.toISOString().split('T')[0];

    try {
      await addTransaction({
        id: String(Date.now()),
        description,
        value: numericValue,
        date: formattedDate,
        category: selectedCategory, 
        type: type.toLowerCase() 
      });
      
      Alert.alert('Sucesso', 'Transação adicionada!');
      setDescription('');
      setValue('');
      setDate(new Date());
      setSelectedCategory(null);
      
      router.push('/(tabs)/');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a transação.');
    }
  };

  return (
    <View style={[globalStyles.screenContainer, styles.container]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.form}>
        
        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="Ex: Aluguel"
        />

        <Text style={styles.label}>Valor</Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={setValue}
          placeholder="R$ 0,00"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Data</Text>
        <TouchableOpacity 
          style={styles.inputIconContainer} 
          activeOpacity={0.8} 
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.inputWithIcon}>
            {date.toLocaleDateString('pt-BR')}
          </Text>
          <Ionicons name="calendar-outline" size={20} color="#888" style={styles.icon} />
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}

        <Text style={styles.label}>Tipo</Text>
        <TouchableOpacity 
          style={styles.dropdownButton} 
          activeOpacity={0.8}
          onPress={() => setShowTypeDropdown(!showTypeDropdown)}
        >
          <Text style={styles.dropdownText}>{type}</Text>
          <Ionicons name={showTypeDropdown ? "chevron-up" : "chevron-down"} size={20} color="#3B1578" />
        </TouchableOpacity>
        
        {showTypeDropdown && (
          <View style={styles.dropdownList}>
            <TouchableOpacity 
              style={styles.dropdownItem} 
              onPress={() => { setType('Saldo'); setShowTypeDropdown(false); }}
            >
              <Text style={styles.dropdownItemText}>Saldo</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.dropdownItem} 
              onPress={() => { setType('Despesa'); setShowTypeDropdown(false); }}
            >
              <Text style={styles.dropdownItemText}>Despesa</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.label}>Categoria</Text>
        <TouchableOpacity 
          style={styles.dropdownButton} 
          activeOpacity={0.8}
          onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
        >
          <Text style={styles.dropdownText}>
            {selectedCategory ? (selectedCategory.displayName || selectedCategory.name) : 'Selecione uma categoria'}
          </Text>
          <Ionicons name={showCategoryDropdown ? "chevron-up" : "chevron-down"} size={20} color="#3B1578" />
        </TouchableOpacity>
        
        {showCategoryDropdown && (
          <View style={styles.dropdownList}>
            {filteredCategories.length > 0 ? (
              filteredCategories.map((cat) => (
                <TouchableOpacity 
                  key={cat.id} 
                  style={styles.dropdownItem} 
                  onPress={() => { setSelectedCategory(cat); setShowCategoryDropdown(false); }}
                >
                  <Text style={styles.dropdownItemText}>{cat.displayName || cat.name}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={[styles.dropdownItemText, { padding: 12, color: '#888' }]}>
                Nenhuma categoria encontrada.
              </Text>
            )}
          </View>
        )}

        <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
          <Text style={styles.submitButtonText}>Adicionar</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: 10, backgroundColor: '#FAFAFC' },
  form: { paddingHorizontal: 20, paddingBottom: 40 },
  label: { fontFamily: 'Poppins-Regular', fontSize: 13, color: '#444', marginBottom: 6 },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E8E4F0', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, fontFamily: 'Poppins-Regular', marginBottom: 16 },
  inputIconContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E8E4F0', borderRadius: 8, marginBottom: 16 },
  inputWithIcon: { flex: 1, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, fontFamily: 'Poppins-Regular', color: '#333' },
  icon: { paddingHorizontal: 14 },
  dropdownButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#3B1578', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 16 },
  dropdownText: { fontSize: 15, fontFamily: 'Poppins-Regular', color: '#333' },
  dropdownList: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E8E4F0', borderRadius: 8, marginTop: -10, marginBottom: 16, elevation: 2 },
  dropdownItem: { paddingVertical: 12, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  dropdownItemText: { fontSize: 15, fontFamily: 'Poppins-Regular', color: '#333' },
  submitButton: { backgroundColor: '#5A319B', borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginTop: 10 },
  submitButtonText: { color: '#FFFFFF', fontFamily: 'Poppins-SemiBold', fontSize: 16 }
});