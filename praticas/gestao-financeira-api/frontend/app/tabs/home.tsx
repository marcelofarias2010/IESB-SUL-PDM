import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Surface, Button, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { transactionService } from '../../services/transaction.service';
import { Transaction } from '../../types';
import { formatCurrency, getCurrentMonth, getCurrentYear } from '../../utils/format';
import { router } from 'expo-router';

export default function HomeScreen() {
  const { user, signOut } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const currentMonth = getCurrentMonth();
  const currentYear = getCurrentYear();

  const loadTransactions = useCallback(async () => {
    try {
      const data = await transactionService.getAll({ month: currentMonth, year: currentYear });
      setTransactions(data);
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentMonth, currentYear]);

useEffect(() => {
  loadTransactions();
}, [loadTransactions]);

  const totalIncome = transactions
    .filter((t) => t.category?.isIncome)
    .reduce((acc, t) => acc + t.value, 0);

  const totalExpenses = transactions
    .filter((t) => !t.category?.isIncome)
    .reduce((acc, t) => acc + t.value, 0);

  const balance = totalIncome - totalExpenses;

  const recentTransactions = transactions.slice(0, 5);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Bem-vindo,</Text>
          <Text style={styles.userName}>{user?.name || 'Usuário'} 👋</Text>
        </View>
        <Button
          mode="text"
          onPress={signOut}
          textColor="#B7C9BF"
          icon="logout"
          compact
        >
          Sair
        </Button>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadTransactions(); }} tintColor="#52B788" />}
      >
        {/* Balance Card */}
        <Surface style={styles.balanceCard} elevation={3}>
          <Text style={styles.balanceLabel}>Saldo do mês</Text>
          <Text style={[styles.balanceValue, { color: balance >= 0 ? '#52B788' : '#E63946' }]}>
            {formatCurrency(balance)}
          </Text>

          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <View style={[styles.iconBg, { backgroundColor: '#D8F3DC' }]}>
                <MaterialCommunityIcons name="arrow-down-circle" size={20} color="#2D6A4F" />
              </View>
              <Text style={styles.summaryLabel}>Receitas</Text>
              <Text style={styles.incomeValue}>{formatCurrency(totalIncome)}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.summaryItem}>
              <View style={[styles.iconBg, { backgroundColor: '#FFE8E8' }]}>
                <MaterialCommunityIcons name="arrow-up-circle" size={20} color="#E63946" />
              </View>
              <Text style={styles.summaryLabel}>Despesas</Text>
              <Text style={styles.expenseValue}>{formatCurrency(totalExpenses)}</Text>
            </View>
          </View>
        </Surface>

        {/* Quick Actions */}
        <View style={styles.actionsRow}>
          <Button
            mode="contained"
            onPress={() => router.push('/tabs/transactions')}
            style={styles.actionBtn}
            buttonColor="#2D6A4F"
            icon="plus"
          >
            Nova Transação
          </Button>
          <Button
            mode="outlined"
            onPress={() => router.push('/tabs/summary')}
            style={styles.actionBtn}
            textColor="#2D6A4F"
            icon="chart-bar"
          >
            Ver Resumo
          </Button>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Transações recentes</Text>
            <Button mode="text" onPress={() => router.push('/tabs/transactions')} textColor="#52B788" compact>
              Ver todas
            </Button>
          </View>

          {loading ? (
            <ActivityIndicator color="#52B788" style={{ marginTop: 20 }} />
          ) : recentTransactions.length === 0 ? (
            <Surface style={styles.emptyCard} elevation={1}>
              <MaterialCommunityIcons name="inbox-outline" size={48} color="#B7C9BF" />
              <Text style={styles.emptyText}>Nenhuma transação este mês</Text>
            </Surface>
          ) : (
            recentTransactions.map((transaction) => (
              <Surface key={transaction.id} style={styles.transactionItem} elevation={1}>
                <View style={[styles.categoryIcon, { backgroundColor: transaction.category?.background || '#ccc' }]}>
                  <MaterialCommunityIcons
                    name={(transaction.category?.icon as any) || 'cash'}
                    size={18}
                    color="#fff"
                  />
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionDesc} numberOfLines={1}>
                    {transaction.description}
                  </Text>
                  <Text style={styles.transactionCategory}>
                    {transaction.category?.displayName}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.transactionValue,
                    { color: transaction.category?.isIncome ? '#2D6A4F' : '#E63946' },
                  ]}
                >
                  {transaction.category?.isIncome ? '+' : '-'}
                  {formatCurrency(transaction.value)}
                </Text>
              </Surface>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAF9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
    backgroundColor: '#1a1f2e',
  },
  welcomeText: {
    color: '#B7C9BF',
    fontSize: 14,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  balanceCard: {
    margin: 16,
    borderRadius: 16,
    padding: 24,
    backgroundColor: '#1a1f2e',
  },
  balanceLabel: {
    color: '#B7C9BF',
    fontSize: 14,
    marginBottom: 8,
  },
  balanceValue: {
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  iconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  summaryLabel: {
    color: '#B7C9BF',
    fontSize: 12,
    marginBottom: 4,
  },
  incomeValue: {
    color: '#52B788',
    fontSize: 16,
    fontWeight: '700',
  },
  expenseValue: {
    color: '#E63946',
    fontSize: 16,
    fontWeight: '700',
  },
  divider: {
    width: 1,
    backgroundColor: '#2D3748',
  },
  actionsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 8,
  },
  actionBtn: {
    flex: 1,
    borderRadius: 8,
    borderColor: '#2D6A4F',
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1F2E',
  },
  emptyCard: {
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  emptyText: {
    color: '#B7C9BF',
    marginTop: 8,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDesc: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1F2E',
  },
  transactionCategory: {
    fontSize: 12,
    color: '#6B7A8D',
    marginTop: 2,
  },
  transactionValue: {
    fontSize: 15,
    fontWeight: '700',
  },
});
