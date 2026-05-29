// app/(tabs)/categories.jsx
import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { MoneyContext } from '../../contexts/GlobalState';
import { globalStyles } from '../../styles/globalStyles';

export default function Categories() {
  const { categories, addCategory, removeCategory } = useContext(MoneyContext);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleAddCategory = () => {
    if (newCategoryName.trim() === '') return;
    const newCat = {
      id: String(Date.now()),
      name: newCategoryName,
      type: 'despesa'
    };
    addCategory(newCat);
    setNewCategoryName('');
  };

  return (
    <View style={[globalStyles.screenContainer, styles.container]}>
      <Text style={styles.label}>Nova Categoria (Despesa)</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Assinaturas"
        value={newCategoryName}
        onChangeText={setNewCategoryName}
      />
      <TouchableOpacity style={styles.button} onPress={handleAddCategory}>
        <Text style={styles.buttonText}>Criar Categoria</Text>
      </TouchableOpacity>

      <FlatList
        data={categories}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.categoryItem}>
            <Text style={styles.categoryName}>{item.name}</Text>
            <TouchableOpacity onPress={() => removeCategory(item.id)}>
              <Text style={styles.deleteText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#FAFAFC', flex: 1 },
  label: { fontFamily: 'Poppins-Regular', fontSize: 14, marginBottom: 8 },
  input: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E8E4F0', borderRadius: 8, padding: 12, marginBottom: 16, fontFamily: 'Poppins-Regular' },
  button: { backgroundColor: '#5E35B1', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 24 },
  buttonText: { color: '#FFF', fontFamily: 'Poppins-SemiBold', fontSize: 16 },
  list: { paddingBottom: 20 },
  categoryItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#E8E4F0' },
  categoryName: { fontFamily: 'Poppins-Regular', fontSize: 16, color: '#333' },
  deleteText: { fontFamily: 'Poppins-Bold', color: '#D8627A', fontSize: 14 }
});