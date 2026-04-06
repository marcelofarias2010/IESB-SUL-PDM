import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import IconButton from './components/IconButton';

// Importando as nossas telas
import DespesasRecentes from './screens/DespesasRecentes';
import TodasDespesas from './screens/TodasDespesas';
import GerenciarDespesa from './screens/GerenciarDespesa';

const Stack = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();

// 1. Criamos a navegação das Abas Inferiores
function DespesasOverview() {
  return (
    <BottomTabs.Navigator>
      <BottomTabs.Screen 
        name="DespesasRecentes" 
        component={DespesasRecentes} 
        options={({ navigation }) => ({
          title: 'Despesas Recentes',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="hourglass" size={size} color={color} />
          ),
          headerRight: () => (
            <IconButton 
              icon="add" 
              size={24} 
              color="black" 
              onPress={() => navigation.navigate('GerenciarDespesa')} 
            />
          ),
        })}
      />
      <BottomTabs.Screen 
        name="TodasDespesas" 
        component={TodasDespesas} 
        options={{ 
          title: 'Todas as Despesas',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          )
        }}
      />
    </BottomTabs.Navigator>
  );
}

// 2. Criamos a navegação principal (Pilha) que engloba tudo
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* A tela inicial da Pilha é o nosso grupo de Abas */}
        <Stack.Screen 
          name="DespesasOverview" 
          component={DespesasOverview} 
          options={{ headerShown: false }} // Escondemos o cabeçalho duplo
        />
        {/* A tela de Gerenciar Despesa fica solta na pilha para ser aberta depois */}
        <Stack.Screen 
          name="GerenciarDespesa" 
          component={GerenciarDespesa} 
          options={{ title: 'Gerenciar Despesa' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}