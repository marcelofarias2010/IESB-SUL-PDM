import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import HeaderAddButton from './components/despesa/HeaderAddButton';
import DespesasRecentes from './screens/DespesasRecentes';
import GerenciarDespesa from './screens/GerenciarDespesa';
import TodasDespesas from './screens/TodasDespesas';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabScreen() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#b84b62',
        },
        headerTintColor: '#fff',
        tabBarActiveTintColor: '#b84b62',
        tabBarInactiveTintColor: '#8c6674',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
        },
        tabBarStyle: {
          height: 64,
          paddingTop: 8,
          paddingBottom: 8,
        },
      }}>
      <Tab.Screen
        name="DespesaRecentes"
        component={DespesasRecentes}
        options={{
          title: 'Despesas Recentes',
          tabBarLabel: 'Recentes',
          tabBarIcon: ({ color, size }) => <Ionicons name="time" color={color} size={size} />,
          headerRight: () => <HeaderAddButton />,
        }}
      />
      <Tab.Screen
        name="TodasDespesas"
        component={TodasDespesas}
        options={{
          title: 'Todas as Despesas',
          tabBarLabel: 'Todas',
          tabBarIcon: ({ color, size }) => <Ionicons name="card" color={color} size={size} />,
          headerRight: () => <HeaderAddButton />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Despesas"
            component={BottomTabScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="GerenciarDespesa"
            component={GerenciarDespesa}
            options={{
              title: 'Gerenciar Despesa',
              headerStyle: {
                backgroundColor: '#b84b62',
              },
              headerTintColor: '#fff',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
