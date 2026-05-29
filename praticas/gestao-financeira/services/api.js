import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

const debuggerHost = Constants.expoConfig?.hostUri || Constants.manifest?.hostUri;
const ipMaquina = debuggerHost ? debuggerHost.split(':')[0] : 'localhost';

const BASE_URL = Platform.OS === 'web' 
  ? 'http://localhost:3000' 
  : `http://${ipMaquina}:3000`;

console.log(`📡 API conectada em: ${BASE_URL}`);

const client = axios.create({
  baseURL: BASE_URL,
  // Força o formato padrão mais aceito por servidores Express/Node
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

export const api = {
  listTransactions: async () => {
    const response = await client.get('/transactions');
    return response.data;
  },
  listCategories: async () => {
    const response = await client.get('/categories');
    return response.data;
  },
  createTransaction: async (data) => {
    // Envia o dado convertido em string JSON para evitar que o Axios mude o formato
    const response = await client.post('/transactions', JSON.stringify(data));
    return response.data;
  },
  deleteTransaction: async (id) => {
    const response = await client.delete(`/transactions/${id}`);
    return response.data;
  },
  createCategory: async (data) => {
    const response = await client.post('/categories', JSON.stringify(data));
    return response.data;
  },
  deleteCategory: async (id) => {
    const response = await client.delete(`/categories/${id}`);
    return response.data;
  }
};