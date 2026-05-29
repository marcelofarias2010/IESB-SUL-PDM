import { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import Button from '../../components/Button'; 
import { MoneyContext } from '../../contexts/GlobalState'; 

export default function Login() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const router = useRouter();
  const { setUsuarioLogado } = useContext(MoneyContext);

  // Função auxiliar para evitar travamento de Alert na Web
  const mostrarAlerta = (titulo, mensagem) => {
    if (Platform.OS === 'web') {
      alert(`${titulo}: ${mensagem}`);
    } else {
      Alert.alert(titulo, mensaje);
    }
  };

  const handleLogin = () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      mostrarAlerta('Atenção', 'Por favor, preencha todos os campos.');
      return;
    }

    if (!email.includes('@')) {
      mostrarAlerta('Erro de Acesso', 'Por favor, insira um e-mail válido.');
      return;
    }

    // Salva o nome do usuário no contexto global
    setUsuarioLogado(name.trim());

    // Encaminha para o dashboard do aplicativo
    router.replace('/(tabs)'); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestão Financeira</Text>
      
      <Text style={styles.label}>Seu Nome</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Digite seu nome completo" 
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>E-mail</Text>
      <TextInput 
        style={styles.input} 
        placeholder="exemplo@email.com" 
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Senha</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Digite sua senha" 
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />

      <Button onPress={handleLogin}>
        Entrar
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 30, textAlign: 'center', color: '#333' },
  label: { fontSize: 14, fontWeight: '600', color: '#555', marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 20, fontSize: 16 }
});