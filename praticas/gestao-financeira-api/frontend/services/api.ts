import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Use correct URL depending on platform
const getBaseUrl = () => {
  if (Platform.OS === 'web') {
    return 'http://localhost:3000';
  }
  // For Android emulator
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000';
  }
  // For iOS simulator and Expo Go
  return 'http://localhost:3000';
};

const BASE_URL = getBaseUrl();

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add JWT token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('@gestao:token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.multiRemove(['@gestao:token', '@gestao:user']);
    }
    return Promise.reject(error);
  }
);

export default api;
