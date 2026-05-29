import { Tabs, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true, // 1. Reativa o cabeçalho para todas as telas
        headerTitleAlign: 'center', // 2. Centraliza o título como no seu design
        headerStyle: {
          backgroundColor: '#FFFFFF',
          borderBottomWidth: 1,
          borderBottomColor: '#E8E4F0',
          elevation: 0, // Remove sombra no Android
          shadowOpacity: 0, // Remove sombra no iOS
        },
        headerTitleStyle: {
          fontFamily: 'Poppins-Bold',
          fontSize: 18,
          color: '#3B1578', // Roxo padrão dos seus títulos
        },
        // 3. Cria o botão "Sair" nativo para todas as telas direcionando para o Login ('/')
        headerRight: () => (
          <TouchableOpacity 
            onPress={() => router.replace('/')} 
            style={styles.logoutButton}
          >
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        ),
        tabBarActiveTintColor: '#3B1578', 
        tabBarInactiveTintColor: '#A0A0A0', 
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E8E4F0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: 'Poppins-Regular',
          fontSize: 12,
        }
      }}
    >
      <Tabs.Screen
        name="inicio"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="add-transactions"
        options={{
          title: 'Adicionar',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="summary"
        options={{
          title: 'Resumo',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="pie-chart" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categorias',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="pricetags" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    marginRight: 20,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  logoutText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#D93025', // Vermelho para o Sair
  },
});