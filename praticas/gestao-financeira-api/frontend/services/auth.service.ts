import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';
import { User, LoginInput } from '../types';

interface LoginResponse {
  token: string;
  user: User;
}

export const authService = {
  async login(data: LoginInput): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  async saveSession(token: string, user: User): Promise<void> {
    await AsyncStorage.setItem('@gestao:token', token);
    await AsyncStorage.setItem('@gestao:user', JSON.stringify(user));
  },

  async getSession(): Promise<{ token: string | null; user: User | null }> {
    const token = await AsyncStorage.getItem('@gestao:token');
    const userStr = await AsyncStorage.getItem('@gestao:user');
    const user = userStr ? JSON.parse(userStr) : null;
    return { token, user };
  },

  async clearSession(): Promise<void> {
    await AsyncStorage.multiRemove(['@gestao:token', '@gestao:user']);
  },
};
