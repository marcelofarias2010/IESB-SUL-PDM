import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import GerenciarDespesa from './screens/GerenciarDespesa';
import DespesaRecentes from './screens/DespesaRecentes';
import TodasDespesas from './screens/TodasDespesas';
import IconButton from './components/IconButton';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Função que cria as Abas Inferiores (Bottom Tabs)
function BottonTabScreen() {
  return (
    <Tab.Navigator
      screenOptions={({ navigation }) => ({
        headerRight: () => (
          <IconButton
            icon="add"
            size={24}
            color="black"
            onPress={() => {
              navigation.navigate('GerenciarDespesa');
            }}
          />
        ),
      })}
    >
      <Tab.Screen
        name="DespesaRecentes"
        component={DespesaRecentes}
        options={{
          title: 'Despesas Recentes',
          tabBarLabel: 'Recentes',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="hourglass" size={size} color={color} />
          ),
          tabBarLabelStyle: { fontSize: 12 },
        }}
      />
      <Tab.Screen
        name="TodasDespesas"
        component={TodasDespesas}
        options={{
          title: 'Todas as Despesas',
          tabBarLabel: 'Todas',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wallet-outline" size={size} color={color} />
          ),
          tabBarLabelStyle: { fontSize: 12 },
        }}
      />
    </Tab.Navigator>
  );
}

// Função principal que junta a Stack com as Tabs
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Despesas"
          component={BottonTabScreen}
          options={{ headerShown: false }} // Esconde o cabeçalho duplo
        />
        <Stack.Screen
          name="GerenciarDespesa"
          component={GerenciarDespesa}
          options={{ title: 'Gerenciar Despesa' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}