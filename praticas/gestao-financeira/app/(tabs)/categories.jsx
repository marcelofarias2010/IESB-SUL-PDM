import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  ActivityIndicator
} from "react-native";
import { useRouter } from "expo-router";
import { MoneyContext } from "../../contexts/GlobalState";

export default function AddCategories() {
  const router = useRouter();
  const { addCategory } = useContext(MoneyContext);

  const [displayName, setDisplayName] = useState("");
  const [isIncome, setIsIncome] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 🎨 Paleta de cores para o Background
  const colors = [
    "#FF9800", // Laranja (Renda)
    "#4CAF50", // Verde (Alimentação)
    "#E6E088", // Amarelo (Casa)
    "#9E9E9E", // Cinza (Educação)
    "#2196F3", // Azul (Viagens)
    "#F44336", // Vermelho (Saúde)
    "#AB8FBE", // Roxo
    "#795548"  // Marrom
  ];
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  // 🏷️ DICIONÁRIO DE ÍCONES (Chave em inglês para o banco, Valor em português para a tela)
  const iconMap = {
    "work": "Trabalho / Salário",
    "fastfood": "Alimentação",
    "home": "Moradia / Casa",
    "book": "Educação",
    "airplanemode-active": "Viagens",
    "local-hospital": "Saúde",
    "attach-money": "Investimentos",
    "folder": "Outros / Geral"
  };

  // Pegamos as chaves em inglês para controlar o estado interno
  const iconKeys = Object.keys(iconMap);
  const [selectedIcon, setSelectedIcon] = useState(iconKeys[0]); // Inicia com 'work'

  const handleSave = async () => {
    if (!displayName.trim()) {
      if (Platform.OS === 'web') {
        alert("Por favor, insira o nome da categoria.");
      } else {
        const { Alert } = require('react-native');
        Alert.alert("Atenção", "Por favor, insira o nome da categoria.");
      }
      return;
    }

    setSubmitting(true);

    try {
      // 🚀 PAYLOAD PERFEITO PARA O PRISMA
      const payload = {
        name: displayName.trim().toLowerCase().replace(/\s+/g, "-"), 
        displayName: displayName.trim(),
        icon: selectedIcon, // Envia a chave em inglês (ex: 'fastfood')
        background: selectedColor,
        isIncome: isIncome,
        isDefault: false 
      };

      console.log("🚀 Enviando Nova Categoria para o Prisma:", payload);

      await addCategory(payload);

      if (Platform.OS === 'web') {
        alert("Categoria criada com sucesso!");
      } else {
        const { Alert } = require('react-native');
        Alert.alert("Sucesso", "Categoria criada com sucesso!");
      }

      router.replace("/summary");

    } catch (e) {
      console.error("❌ Erro ao salvar categoria:", e);
      const errorData = e.response?.data;
      const backendMessage = errorData?.error || errorData?.message || e.message;
      
      let msgExibicao = "Verifique os dados enviados.";
      if (typeof backendMessage === 'string' && backendMessage.includes("unique")) {
        msgExibicao = "Já existe uma categoria cadastrada com este nome.";
      } else if (backendMessage) {
        msgExibicao = typeof backendMessage === 'object' ? JSON.stringify(backendMessage) : String(backendMessage);
      }

      if (Platform.OS === 'web') {
        alert(`Erro 400: ${msgExibicao}`);
      } else {
        const { Alert } = require('react-native');
        Alert.alert("Erro ao salvar (400)", msgExibicao);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        
        {/* NOME DA CATEGORIA */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome da Categoria</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Lazer, Presentes, Academia"
            placeholderTextColor="#999"
            value={displayName}
            onChangeText={setDisplayName}
          />
        </View>

        {/* TIPO DE CATEGORIA */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tipo de Categoria</Text>
          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.typeButton, !isIncome && styles.activeExpense]}
              onPress={() => setIsIncome(false)}
            >
              <Text style={[styles.typeText, !isIncome && styles.whiteText]}>Despesa</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.typeButton, isIncome && styles.activeIncome]}
              onPress={() => setIsIncome(true)}
            >
              <Text style={[styles.typeText, isIncome && styles.whiteText]}>Receita</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SELEÇÃO DE COR */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Selecione uma Cor</Text>
          <View style={styles.grid}>
            {colors.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorCircle,
                  { backgroundColor: color },
                  selectedColor === color && styles.selectedCircle
                ]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </View>
        </View>

        {/* SELEÇÃO DE ÍCONE (EXIBIDO EM PORTUGUÊS) */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Selecione um Ícone descritivo</Text>
          <View style={styles.grid}>
            {iconKeys.map((key) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.iconCard,
                  selectedIcon === key && styles.selectedIconCard
                ]}
                onPress={() => setSelectedIcon(key)}
              >
                {/* Mostra o valor em português mapeado na tela */}
                <Text style={styles.iconText}>{iconMap[key]}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* BOTÃO SALVAR */}
        <TouchableOpacity
          style={[styles.btn, submitting && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Criar Categoria</Text>
          )}
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff", padding: 20 },
  inputGroup: { marginBottom: 20, width: "100%" },
  label: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 8 },
  input: { width: "100%", height: 50, borderWidth: 1, borderColor: "#cccccc", borderRadius: 8, paddingHorizontal: 12, fontSize: 16, backgroundColor: "#fafafa", color: "#000000" },
  row: { flexDirection: "row", gap: 10 },
  typeButton: { flex: 1, padding: 14, borderRadius: 8, borderWidth: 1, borderColor: "#ccc", alignItems: "center", backgroundColor: "#fdfdfd" },
  typeText: { fontWeight: "600", color: "#555" },
  activeExpense: { backgroundColor: "#d32f2f", borderColor: "#d32f2f" },
  activeIncome: { backgroundColor: "#388e3c", borderColor: "#388e3c" },
  whiteText: { color: "#fff" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  colorCircle: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: "transparent" },
  selectedCircle: { borderColor: "#000", transform: [{ scale: 1.1 }] },
  iconCard: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1, borderColor: "#ccc", backgroundColor: "#f9f9f9" },
  selectedIconCard: { borderColor: "#000", backgroundColor: "#e0e0e0" },
  iconText: { fontSize: 13, color: "#333", fontWeight: "500" },
  btn: { backgroundColor: "#2e7d32", padding: 16, borderRadius: 8, alignItems: "center", marginTop: 20, marginBottom: 40 },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "bold" }
});