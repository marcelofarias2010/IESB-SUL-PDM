import { Tabs, router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabsLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, isLoading]);

  if (!isAuthenticated) return null;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1a1f2e',
          borderTopColor: '#2D3748',
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 4,
          height: 64,
        },
        tabBarActiveTintColor: '#52B788',
        tabBarInactiveTintColor: '#6B7A8D',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Transações',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="swap-horizontal" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="summary"
        options={{
          title: 'Resumo',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chart-pie" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categorias',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="tag-multiple" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
