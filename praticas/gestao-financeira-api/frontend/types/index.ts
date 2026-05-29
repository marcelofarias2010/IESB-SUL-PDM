export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Category {
  id: string;
  name: string;
  displayName: string;
  icon: string;
  background: string;
  isIncome: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  description: string;
  value: number;
  date: string;
  categoryId: string;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface CreateTransactionInput {
  description: string;
  value: number;
  date: string;
  categoryId: string;
}

export interface CreateCategoryInput {
  name: string;
  displayName: string;
  icon: string;
  background: string;
  isIncome: boolean;
}

export interface Summary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}
