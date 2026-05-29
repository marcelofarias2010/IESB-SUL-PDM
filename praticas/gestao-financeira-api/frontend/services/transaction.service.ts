import api from './api';
import { Transaction, CreateTransactionInput } from '../types';

export const transactionService = {
  async getAll(filters?: { month?: number; year?: number }): Promise<Transaction[]> {
    const params: Record<string, string> = {};
    if (filters?.month) params.month = String(filters.month);
    if (filters?.year) params.year = String(filters.year);
    const response = await api.get<Transaction[]>('/transactions', { params });
    return response.data;
  },

  async create(data: CreateTransactionInput): Promise<Transaction> {
    const response = await api.post<Transaction>('/transactions', data);
    return response.data;
  },

  async update(id: string, data: Partial<CreateTransactionInput>): Promise<Transaction> {
    const response = await api.put<Transaction>(`/transactions/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/transactions/${id}`);
  },
};
