import { Tabs } from 'expo-router';
import React, { useContext } from 'react';
import { StyleSheet, Platform, View, Text } from 'react-native';
// 🚀 IMPORTANTE: Importação como módulo para evitar que o contexto venha 'undefined' por loop de arquivos
import * as GlobalStateModule from '../../contexts/GlobalState';

export default function TabLayout() {
  const MoneyContext = GlobalStateModule.MoneyContext;
  const context = useContext(MoneyContext);

  // Resgata o nome do usuário salvo no login
  const usuarioLogado = context?.usuarioLogado || 'Usuário';

  return (
    <Tabs
      screenOptions={{
        // 🚀 Remove os ícones e as setas fantasmas em qualquer plataforma
        tabBarIcon: () => null,
        
        // 🚀 CONFIGURAÇÕES DO TEXTO DO MENU INFERIOR
        tabBarActiveTintColor: '#ffffff',     // Letra branca quando selecionado
        tabBarInactiveTintColor: '#b0bec5',   // Letra cinza clara quando desligado
        
        tabBarLabelStyle: {
          fontSize: 13,                       // Tamanho ideal para telas de celular
          fontWeight: 'bold',                 // Texto em negrito
          position: 'absolute',               
          // Alinhamento inteligente: centraliza no meio independente do sistema
          bottom: Platform.OS === 'web' ? 22 : 18, 
        },

        // 🚀 ESTILO DA BARRA INFERIOR (VERDE)
        tabBarStyle: {
          backgroundColor: '#2e7d32',         // Fundo verde escuro
          borderTopWidth: 0,                  // Remove linhas extras de divisão
          height: 60,                         // Altura padrão para o Android
          
          // Compatibilidade para Web fixa no rodapé, no Android deixa nativo
          ...(Platform.OS === 'web' ? {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
          } : {}),
        },

        // 🚀 ESTILO DO TOPO DO APP
        headerStyle: {
          backgroundColor: '#2e7d32',
          height: Platform.OS === 'web' ? 90 : 100, // Dá mais espaço para o título de duas linhas
          elevation: 0,                       // Remove a sombra no Android
          shadowOpacity: 0,                   // Remove a sombra no iOS
        },
        headerTintColor: '#ffffff',
        headerTitleAlign: 'center',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: 'Início',
          // 🚀 RENDERIZAÇÃO DO TÍTULO EM DUAS LINHAS (Nome + Subtítulo)
          headerTitle: () => (
            <View style={styles.headerContainer}>
              <Text style={styles.headerTitleText}>Olá, {usuarioLogado} </Text>
              <Text style={styles.headerSubtitleText}>Seja bem-vindo ao Gestão Financeira</Text>
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="add-transactions" 
        options={{
          title: 'Nova Transação',
          tabBarLabel: 'Adicionar',
        }}
      />

      <Tabs.Screen
        name="categories" 
        options={{
          title: 'Categorias',
          tabBarLabel: 'Categorias',
        }}
      />

      <Tabs.Screen
        name="summary" 
        options={{
          title: 'Resumo',
          tabBarLabel: 'Resumo',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
  },
  headerTitleText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitleText: {
    color: '#e0e0e0', // Um tom de branco levemente fosco para o subtítulo
    fontSize: 12,
    marginTop: 2,
    fontWeight: '400',
  },
});