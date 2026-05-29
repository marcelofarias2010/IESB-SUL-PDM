import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Text, Surface, ActivityIndicator, Menu } from 'react-native-paper';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { transactionService } from '../../services/transaction.service';
import { Transaction } from '../../types';
import { formatCurrency, getCurrentMonth, getCurrentYear } from '../../utils/format';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 32;

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

export default function SummaryScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [selectedYear, setSelectedYear] = useState(getCurrentYear());
  const [showMonthMenu, setShowMonthMenu] = useState(false);
  const [showYearMenu, setShowYearMenu] = useState(false);

  const currentYear = getCurrentYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

  const loadData = useCallback(async () => {
    try {
      const data = await transactionService.getAll({ month: selectedMonth, year: selectedYear });
      setTransactions(data);
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const totalIncome = transactions
    .filter((t) => t.category?.isIncome)
    .reduce((acc, t) => acc + t.value, 0);

  const totalExpenses = transactions
    .filter((t) => !t.category?.isIncome)
    .reduce((acc, t) => acc + t.value, 0);

  const balance = totalIncome - totalExpenses;

  // Group expenses by category for pie chart
  const expensesByCategory = transactions
    .filter((t) => !t.category?.isIncome)
    .reduce((acc, t) => {
      const key = t.category?.displayName || 'Outros';
      if (!acc[key]) {
        acc[key] = { total: 0, color: t.category?.background || '#ccc' };
      }
      acc[key].total += t.value;
      return acc;
    }, {} as Record<string, { total: number; color: string }>);

  const pieData = Object.entries(expensesByCategory).map(([name, data], index) => ({
    name,
    population: data.total,
    color: data.color,
    legendFontColor: '#1A1F2E',
    legendFontSize: 12,
  }));

  const barData = {
    labels: ['Receitas', 'Despesas'],
    datasets: [
      {
        data: [totalIncome, totalExpenses],
        colors: [() => '#2D6A4F', () => '#E63946'],
      },
    ],
  };

  const chartConfig = {
    backgroundColor: '#FFFFFF',
    backgroundGradientFrom: '#FFFFFF',
    backgroundGradientTo: '#FFFFFF',
    color: (opacity = 1) => `rgba(45, 106, 79, ${opacity})`,
    labelColor: () => '#6B7A8D',
    strokeWidth: 2,
    barPercentage: 0.6,
    useShadowColorFromDataset: true,
    propsForBackgroundLines: {
      stroke: '#F3F4F6',
    },
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Resumo Financeiro</Text>
        <View style={styles.filtersRow}>
          <Menu
            visible={showMonthMenu}
            onDismiss={() => setShowMonthMenu(false)}
            anchor={
              <TouchableOpacity style={styles.filterBtn} onPress={() => setShowMonthMenu(true)}>
                <Text style={styles.filterText}>{MONTHS[selectedMonth - 1]}</Text>
                <MaterialCommunityIcons name="chevron-down" size={16} color="#52B788" />
              </TouchableOpacity>
            }
          >
            {MONTHS.map((m, i) => (
              <Menu.Item key={i} title={m} onPress={() => { setSelectedMonth(i + 1); setShowMonthMenu(false); }} />
            ))}
          </Menu>

          <Menu
            visible={showYearMenu}
            onDismiss={() => setShowYearMenu(false)}
            anchor={
              <TouchableOpacity style={styles.filterBtn} onPress={() => setShowYearMenu(true)}>
                <Text style={styles.filterText}>{selectedYear}</Text>
                <MaterialCommunityIcons name="chevron-down" size={16} color="#52B788" />
              </TouchableOpacity>
            }
          >
            {years.map((y) => (
              <Menu.Item key={y} title={String(y)} onPress={() => { setSelectedYear(y); setShowYearMenu(false); }} />
            ))}
          </Menu>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator color="#52B788" style={{ flex: 1 }} />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => { setRefreshing(true); loadData(); }}
              tintColor="#52B788"
            />
          }
          contentContainerStyle={styles.scrollContent}
        >
          {/* Summary Cards */}
          <View style={styles.cardsRow}>
            <Surface style={styles.card} elevation={2}>
              <MaterialCommunityIcons name="arrow-down-circle" size={24} color="#2D6A4F" />
              <Text style={styles.cardLabel}>Receitas</Text>
              <Text style={styles.incomeValue}>{formatCurrency(totalIncome)}</Text>
            </Surface>
            <Surface style={styles.card} elevation={2}>
              <MaterialCommunityIcons name="arrow-up-circle" size={24} color="#E63946" />
              <Text style={styles.cardLabel}>Despesas</Text>
              <Text style={styles.expenseValue}>{formatCurrency(totalExpenses)}</Text>
            </Surface>
          </View>

          <Surface style={styles.balanceCard} elevation={2}>
            <Text style={styles.cardLabel}>Saldo do período</Text>
            <Text style={[styles.balanceValue, { color: balance >= 0 ? '#2D6A4F' : '#E63946' }]}>
              {formatCurrency(balance)}
            </Text>
          </Surface>

          {/* Bar Chart */}
          <Surface style={styles.chartCard} elevation={2}>
            <Text style={styles.chartTitle}>Receitas vs Despesas</Text>
            <BarChart
              data={barData}
              width={CHART_WIDTH - 48}
              height={200}
              chartConfig={chartConfig}
              style={styles.chart}
              fromZero
              showValuesOnTopOfBars
              withCustomBarColorFromData
              flatColor
              yAxisLabel="R$"
              yAxisSuffix=""
            />
          </Surface>

          {/* Pie Chart */}
          {pieData.length > 0 ? (
            <Surface style={styles.chartCard} elevation={2}>
              <Text style={styles.chartTitle}>Despesas por categoria</Text>
              <PieChart
                data={pieData}
                width={CHART_WIDTH - 48}
                height={200}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="0"
                style={styles.chart}
                hasLegend
              />
            </Surface>
          ) : (
            <Surface style={styles.emptyChart} elevation={2}>
              <MaterialCommunityIcons name="chart-pie" size={48} color="#B7C9BF" />
              <Text style={styles.emptyChartText}>
                Sem dados de despesas para exibir o gráfico
              </Text>
            </Surface>
          )}

          {/* Category breakdown */}
          {Object.entries(expensesByCategory).length > 0 && (
            <Surface style={styles.breakdownCard} elevation={2}>
              <Text style={styles.chartTitle}>Detalhamento por categoria</Text>
              {Object.entries(expensesByCategory)
                .sort((a, b) => b[1].total - a[1].total)
                .map(([name, data]) => {
                  const percentage = totalExpenses > 0 ? (data.total / totalExpenses) * 100 : 0;
                  return (
                    <View key={name} style={styles.breakdownItem}>
                      <View style={styles.breakdownLeft}>
                        <View style={[styles.dot, { backgroundColor: data.color }]} />
                        <Text style={styles.breakdownName}>{name}</Text>
                      </View>
                      <View style={styles.breakdownRight}>
                        <Text style={styles.breakdownValue}>{formatCurrency(data.total)}</Text>
                        <Text style={styles.breakdownPct}>{percentage.toFixed(1)}%</Text>
                      </View>
                    </View>
                  );
                })}
            </Surface>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAF9' },
  header: {
    backgroundColor: '#1a1f2e',
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  headerTitle: { color: '#FFFFFF', fontSize: 24, fontWeight: '700', marginBottom: 12 },
  filtersRow: { flexDirection: 'row', gap: 12 },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D3748',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
  },
  filterText: { color: '#52B788', fontWeight: '600' },
  scrollContent: { padding: 16, paddingBottom: 32 },
  cardsRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  card: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  cardLabel: { color: '#6B7A8D', fontSize: 12, marginTop: 4 },
  incomeValue: { color: '#2D6A4F', fontSize: 18, fontWeight: '700', marginTop: 4 },
  expenseValue: { color: '#E63946', fontSize: 18, fontWeight: '700', marginTop: 4 },
  balanceCard: {
    borderRadius: 12,
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
    alignItems: 'center',
  },
  balanceValue: { fontSize: 28, fontWeight: '800', marginTop: 4 },
  chartCard: {
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
    alignItems: 'center',
  },
  chartTitle: { fontSize: 16, fontWeight: '700', color: '#1A1F2E', marginBottom: 12, alignSelf: 'flex-start' },
  chart: { borderRadius: 8 },
  emptyChart: {
    borderRadius: 12,
    padding: 32,
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
    alignItems: 'center',
  },
  emptyChartText: { color: '#B7C9BF', marginTop: 8, textAlign: 'center' },
  breakdownCard: {
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  breakdownLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 12, height: 12, borderRadius: 6 },
  breakdownName: { fontSize: 14, color: '#1A1F2E' },
  breakdownRight: { alignItems: 'flex-end' },
  breakdownValue: { fontSize: 14, fontWeight: '700', color: '#1A1F2E' },
  breakdownPct: { fontSize: 12, color: '#6B7A8D' },
});
