import React, { createContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api'; 

export const MoneyContext = createContext({});

export default function MoneyProvider({ children }) {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);
  const [usuarioLogado, setUsuarioLogado] = useState("");

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [cats, txs] = await Promise.all([
        api.listCategories().catch(() => []),
        api.listTransactions().catch(() => []),
      ]);
      
      setCategories(cats || []);
      setTransactions(txs || []);
    } catch (err) {
      console.error("Erro ao carregar dados via API:", err);
      setError(err.message ?? "Erro de conexão com o servidor");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (usuarioLogado) {
      refresh();
    }
  }, [usuarioLogado, refresh]);

  const addTransaction = async (transactionData) => {
    try {
      const newTransaction = await api.createTransaction(transactionData);
      if (newTransaction) {
        const categoriaLocal = categories.find(
          (c) => c.id.toString() === (transactionData.category_id || transactionData.categoryId)?.toString()
        );

        const transacaoFormatada = {
          ...newTransaction,
          category: categoriaLocal || { displayName: "Outros", background: "#999" }
        };

        setTransactions((current) => [transacaoFormatada, ...current]);
        refresh().catch(err => console.log("Sincronização silenciosa:", err));
      }
      return newTransaction;
    } catch (err) {
      console.error("Erro crítico ao salvar transação:", err);
      throw err;
    }
  };

  const removeTransaction = async (id) => {
    try {
      await api.deleteTransaction(id);
      setTransactions((current) => current.filter(t => t.id !== id));
    } catch (err) {
      console.error("Erro ao deletar transação:", err);
    }
  };

  const addCategory = async (categoryData) => {
    try {
      const newCategory = await api.createCategory(categoryData);
      if (newCategory) {
        await refresh();
      }
      return newCategory;
    } catch (err) {
      console.error("Erro ao salvar categoria:", err);
      throw err;
    }
  };

  const removeCategory = async (id) => {
    try {
      await api.deleteCategory(id);
      setCategories((current) => current.filter(c => c.id !== id));
    } catch (err) {
      console.error("Erro ao deletar categoria:", err);
    }
  };

  return (
    <MoneyContext.Provider 
      value={{ 
        transactions, 
        categories, 
        loading, 
        error,
        addTransaction, 
        removeTransaction,
        addCategory,
        removeCategory,
        refresh, 
        usuarioLogado,
        setUsuarioLogado
      }}
    >
      {children}
    </MoneyContext.Provider>
  );
}