import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
});

export const api = {
  listCategories: async () => (await axiosInstance.get('/categories')).data,
  listTransactions: async () => (await axiosInstance.get('/transactions')).data,
  createTransaction: async (data: any) => (await axiosInstance.post('/transactions', data)).data,
  updateTransaction: async (id: string, data: any) => (await axiosInstance.put(`/transactions/${id}`, data)).data,
  deleteTransaction: async (id: string) => await axiosInstance.delete(`/transactions/${id}`),
  createCategory: async (data: any) => (await axiosInstance.post('/categories', data)).data,
  deleteCategory: async (id: string) => await axiosInstance.delete(`/categories/${id}`)
};