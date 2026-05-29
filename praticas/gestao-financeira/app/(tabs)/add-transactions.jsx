import React, { useContext, useState, useEffect, useMemo } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { MoneyContext } from "../../contexts/GlobalState";

export default function AddTransactions() {
  const router = useRouter();
  const { categories, loading, addTransaction } = useContext(MoneyContext);

  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const filteredCategories = useMemo(() => {
    if (!categories) return [];
    const unique = [];
    const seenNames = new Set();
    for (const cat of categories) {
      if (!cat.displayName) continue;
      const normalizedName = cat.displayName.trim().toLowerCase();
      if (!seenNames.has(normalizedName)) {
        seenNames.add(normalizedName);
        unique.push(cat);
      }
    }
    return unique;
  }, [categories]);

  useEffect(() => {
    if (filteredCategories && filteredCategories.length > 0 && !categoryId) {
      const income = filteredCategories.find((c) => c.isIncome);
      const defaultId = income ? income.id : filteredCategories[0].id;
      setCategoryId(defaultId.toString());
    }
  }, [filteredCategories]);

  const handleAdd = async () => {
    const numValue = parseFloat(value.replace(",", "."));
    if (!description.trim() || isNaN(numValue) || numValue <= 0 || !categoryId) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        description: description.trim(),
        value: numValue,
        date: new Date().toISOString(), 
        categoryId: String(categoryId)
      };
      await addTransaction(payload);
      setDescription("");
      setValue("");
      router.replace("/summary");
    } catch (e) {
      console.error(e);
      alert("Erro ao salvar.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2e7d32" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Descrição da Transação</Text>
          <TextInput style={styles.input} placeholder="Ex: Almoço, Gasolina" value={description} onChangeText={setDescription} />
        </View>

        {/* CAMPO COM CIFRÃO FIXO OBRIGATÓRIO NA CAIXA */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Valor</Text>
          <View style={styles.currencyInputContainer}>
            <Text style={styles.currencyPrefix}>R$</Text>
            <TextInput 
              style={styles.inputWithPrefix} 
              placeholder="0.00" 
              value={value} 
              onChangeText={setValue} 
              keyboardType="numeric" 
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Categoria</Text>
          <View style={styles.grid}>
            {filteredCategories.map((cat) => {
              let backgroundColor = cat.background || '#eee';
              const nameLower = cat.name?.toLowerCase() || '';
              const displayLower = cat.displayName?.toLowerCase() || '';
              
              if (nameLower === 'food' || displayLower === 'alimentação') backgroundColor = '#4CAF50';
              else if (nameLower === 'house' || displayLower === 'casa') backgroundColor = '#E6E088';
              else if (nameLower === 'education' || displayLower === 'educação') backgroundColor = '#9E9E9E';
              else if (nameLower === 'income' || displayLower === 'renda' || displayLower === 'reda') backgroundColor = '#FF9800';
              else if (nameLower === 'health' || displayLower === 'saúde' || displayLower === 'saude') backgroundColor = '#F44336';
              else if (nameLower === 'travel' || displayLower === 'viagens') backgroundColor = '#2196F3';

              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.card, { backgroundColor: backgroundColor }, categoryId === cat.id.toString() && styles.selectedCard]}
                  onPress={() => setCategoryId(cat.id.toString())}
                >
                  <Text style={styles.cardText}>{cat.displayName}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <TouchableOpacity style={styles.btn} onPress={handleAdd} disabled={submitting}>
          <Text style={styles.btnText}>{submitting ? "Processando..." : "Confirmar Lançamento"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff", padding: 20 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 6 },
  input: { height: 50, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, paddingHorizontal: 12, backgroundColor: "#fafafa" },
  
  // Estilos do contêiner de Cifrão fixo
  currencyInputContainer: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#ccc", borderRadius: 8, backgroundColor: "#fafafa", height: 50 },
  currencyPrefix: { paddingLeft: 12, paddingRight: 4, fontSize: 16, fontWeight: "600", color: "#333" },
  inputWithPrefix: { flex: 1, height: "100%", paddingRight: 12, fontSize: 16 },

  grid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  card: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, borderWidth: 2, borderColor: "transparent" },
  cardText: { fontWeight: "600" },
  selectedCard: { borderColor: "#000" },
  btn: { backgroundColor: "#2e7d32", padding: 16, borderRadius: 8, alignItems: "center", marginTop: 15 },
  btnText: { color: "#fff", fontWeight: "bold" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" }
});