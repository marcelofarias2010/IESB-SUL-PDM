import { useState, useRef, useContext } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { router } from "expo-router";

// Importando seus estilos globais e o Contexto
import { globalStyles } from "../styles/globalStyles"; 
import { MoneyContext } from "../contexts/GlobalState";

export default function Register() {
  // Trazendo a função de cadastrar usuário do GlobalState
  const { registerUser } = useContext(MoneyContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toastMessage, setToastMessage] = useState(null);
  
  const opacity = useRef(new Animated.Value(0)).current;

  // Função para mostrar os alertas na tela
  const showToast = (message) => {
    setToastMessage(message);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setToastMessage(null));
    }, 3000);
  };

  // Validações que você solicitou e Salvamento
  const handleRegister = () => {
    if (!name.trim()) {
      return showToast("O Nome Completo é obrigatório.");
    }
    
    if (!email.trim() || !email.includes('@')) {
      return showToast("Você não preencheu o e-mail corretamente (deve conter @).");
    }
    
    if (!password || password.length < 6) {
      return showToast("A senha é obrigatória e deve ter no mínimo 6 caracteres.");
    }
    
    // AQUI ELE SALVA O USUÁRIO NO GLOBAL STATE
    registerUser({ 
      name: name.trim(), 
      email: email.trim(), 
      password 
    });
    
    showToast("Cadastro realizado com sucesso!");
    
    // Após 1.5 segundos, volta para a tela de Login
    setTimeout(() => {
      router.back();
    }, 1500);
  };

  return (
    <View style={[globalStyles.screenContainer, styles.container]}>
      {/* Mensagem de Erro/Sucesso (Toast) */}
      {toastMessage && (
        <Animated.View style={[styles.toast, { opacity }]}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </Animated.View>
      )}

      <Text style={styles.title}>Criar Conta</Text>
      
      <Text style={styles.label}>Nome completo *</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu nome"
        value={name}
        onChangeText={setName}
      />
      
      <Text style={styles.label}>E-mail *</Text>
      <TextInput
        style={styles.input}
        placeholder="exemplo@gmail.com"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      
      <Text style={styles.label}>Senha *</Text>
      <TextInput
        style={styles.input}
        placeholder="Mínimo 6 caracteres"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      
      {/* Botão de Cadastrar */}
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Concluir Cadastro</Text>
      </TouchableOpacity>
      
      {/* Voltar para o Login */}
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.link}>Já possui conta? Faça o login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    padding: 24,
    flex: 1,
    backgroundColor: '#FAFAFC',
  },
  title: {
    fontSize: 28,
    fontFamily: "Poppins-Bold",
    color: '#3B1578',
    marginBottom: 24,
    textAlign: "center",
  },
  label: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: "#444",
    marginBottom: 6,
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E8E4F0",
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    fontSize: 15,
    backgroundColor: "#FFFFFF",
    fontFamily: "Poppins-Regular",
  },
  registerButton: {
    backgroundColor: "#5A319B",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  registerButtonText: {
    color: "#FFFFFF",
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
  },
  link: {
    marginTop: 20,
    color: '#3B1578',
    textAlign: "center",
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
  },
  toast: {
    position: "absolute",
    top: 50,
    left: 24,
    right: 24,
    backgroundColor: "#D93025",
    padding: 16,
    borderRadius: 8,
    zIndex: 1000,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  toastText: {
    color: "#FFFFFF",
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    textAlign: "center",
  },
});