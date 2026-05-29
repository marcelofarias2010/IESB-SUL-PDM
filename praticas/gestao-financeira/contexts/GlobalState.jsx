// contexts/GlobalState.js
import React, { createContext, useState } from 'react';
import { View } from 'react-native';

export const MoneyContext = createContext();

export default function GlobalState({ children, onLayout }) {
  const [transactions, setTransactions] = useState([]);
  
  const [categories, setCategories] = useState([
    { id: '1', name: 'Alimentação', type: 'despesa' },
    { id: '2', name: 'Transporte', type: 'despesa' },
    { id: '3', name: 'Moradia', type: 'despesa' },
    { id: '4', name: 'Salário', type: 'receita' },
    { id: '5', name: 'Saldo', type: 'saldo' }
  ]);

  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // CORREÇÃO 1: Adicionando um ID para a transação poder ser excluída
  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: String(Date.now() + Math.random()) // Gera um ID único
    };
    setTransactions([...transactions, newTransaction]);
  };

  // CORREÇÃO 2: Criando a função de excluir transação
  const removeTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const addCategory = (category) => {
    setCategories([...categories, category]);
  };

  const removeCategory = (id) => {
    setCategories(categories.filter(category => category.id !== id));
  };

  const registerUser = (userData) => {
    setUsers((prev) => [...prev, userData]);
  };

  const loginUser = (email, password) => {
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      setCurrentUser(foundUser);
      return true;
    }
    return false;
  };

  const logoutUser = () => {
    setCurrentUser(null);
  };

  return (
    <View style={{ flex: 1 }} onLayout={onLayout}>
      <MoneyContext.Provider value={{ 
        transactions, 
        addTransaction, 
        removeTransaction, // Não esqueça de exportar aqui
        setTransactions,
        categories,
        setCategories,
        addCategory,
        removeCategory,
        users,
        currentUser,
        registerUser,
        loginUser,
        logoutUser
      }}>
        {children}
      </MoneyContext.Provider>
    </View>
  );
}