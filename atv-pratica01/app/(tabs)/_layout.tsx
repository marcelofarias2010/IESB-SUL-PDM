import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';

import IconButton from '@/components/despesa/IconButton';
import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#b84b62',
        tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
        headerStyle: {
          backgroundColor: '#b84b62',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '700',
        },
        tabBarButton: HapticTab,
        tabBarStyle: {
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Despesas Recentes',
          tabBarLabel: 'Recentes',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="time" color={color} />,
          headerRight: () => (
            <IconButton
              icon="add-circle"
              size={24}
              color="#fff"
              onPress={() => router.push('/gerenciar-despesa')}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Todas as Despesas',
          tabBarLabel: 'Todas',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="card" color={color} />,
          headerRight: () => (
            <IconButton
              icon="add-circle"
              size={24}
              color="#fff"
              onPress={() => router.push('/gerenciar-despesa')}
            />
          ),
        }}
      />
    </Tabs>
  );
}
