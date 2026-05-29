// app/index.jsx
import { useState, useContext } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { router } from "expo-router";
import { globalStyles } from "../styles/globalStyles";
import Button from "../components/Button";
import { MoneyContext } from "../contexts/GlobalState";

export default function Login() {
  const { loginUser } = useContext(MoneyContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      return Alert.alert("Erro", "Preencha todos os campos.");
    }
    
    // Tenta fazer o login buscando na memória do GlobalState
    const success = loginUser(email.trim(), password);
    
    if (success) {
      router.replace("/inicio");
    } else {
      Alert.alert("Erro", "E-mail ou senha incorretos, ou usuário não cadastrado.");
    }
  };

  return (
    <View style={[globalStyles.screenContainer, styles.container]}>
      <Text style={styles.title}>Login</Text>
      
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      
      <Button onPress={handleLogin}>Entrar</Button>
      
      <TouchableOpacity onPress={() => router.push("/register")}>
        <Text style={styles.link}>Não tem uma conta? Solicitar cadastro</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { justifyContent: "center", padding: 24, flex: 1, backgroundColor: '#FAFAFC' },
  title: { fontSize: 28, fontFamily: "Poppins-Bold", color: '#3B1578', marginBottom: 24, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#E8E4F0", borderRadius: 8, padding: 14, marginBottom: 16, fontSize: 16, backgroundColor: "#FFFFFF", fontFamily: "Poppins-Regular" },
  link: { marginTop: 20, color: '#3B1578', textAlign: "center", fontSize: 14, fontFamily: "Poppins-SemiBold" },
});