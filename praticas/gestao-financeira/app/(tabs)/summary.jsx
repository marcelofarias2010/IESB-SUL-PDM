// app/(tabs)/summary.jsx
import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { MoneyContext } from '../../contexts/GlobalState';
import { globalStyles } from '../../styles/globalStyles';

const screenWidth = Dimensions.get('window').width;

export default function Summary() {
  const { transactions } = useContext(MoneyContext);

  const [selectedMonth, setSelectedMonth] = useState('Mai');
  const [selectedYear, setSelectedYear] = useState('2026');

  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const years = ['2025', '2026', '2027'];
  const monthMap = {
    'Jan': '01', 'Fev': '02', 'Mar': '03', 'Abr': '04', 'Mai': '05', 'Jun': '06',
    'Jul': '07', 'Ago': '08', 'Set': '09', 'Out': '10', 'Nov': '11', 'Dez': '12'
  };

  const filteredTransactions = transactions.filter(t => {
    if (!t.date) return false;
    const year = t.date.substring(0, 4);
    const month = t.date.substring(5, 7);
    return year === selectedYear && month === monthMap[selectedMonth];
  });

  // CORREÇÃO DA MATEMÁTICA: Separa corretamente receita e despesa
  let totalIncome = 0;
  let totalExpense = 0;

  filteredTransactions.forEach(t => {
    const isPositive = t.type === 'saldo' || t.category?.name?.toLowerCase() === 'receita' || t.category?.name?.toLowerCase() === 'saldo';
    if (isPositive) {
      totalIncome += Number(t.value);
    } else {
      totalExpense += Number(t.value);
    }
  });

  const balance = totalIncome - totalExpense;

  // CORREÇÃO DO GRÁFICO: Pega apenas o que for despesa
  const categoryData = filteredTransactions
    .filter(t => {
      const isPositive = t.type === 'saldo' || t.category?.name?.toLowerCase() === 'receita' || t.category?.name?.toLowerCase() === 'saldo';
      return !isPositive;
    })
    .reduce((acc, t) => {
      const name = t.category?.displayName || t.category?.name || 'Outros';
      acc[name] = (acc[name] || 0) + Number(t.value);
      return acc;
    }, {});

  const chartColors = ['#9171B8', '#D8627A', '#7FB3D5', '#F7DC6F', '#76D7C4'];
  const data = Object.keys(categoryData).map((key, index) => ({
    name: key,
    population: categoryData[key],
    color: chartColors[index % chartColors.length],
    legendFontColor: "#444",
    legendFontSize: 12
  }));

  return (
    <View style={[globalStyles.screenContainer, styles.container]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        <View style={styles.filtersSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollRow}>
            {months.map((m) => (
              <TouchableOpacity 
                key={m} 
                style={[styles.pill, selectedMonth === m && styles.pillActive]}
                onPress={() => setSelectedMonth(m)}
              >
                <Text style={[styles.pillText, selectedMonth === m && styles.pillTextActive]}>{m}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollRow}>
            {years.map((y) => (
              <TouchableOpacity 
                key={y} 
                style={[styles.pill, selectedYear === y && styles.pillActive]}
                onPress={() => setSelectedYear(y)}
              >
                <Text style={[styles.pillText, selectedYear === y && styles.pillTextActive]}>{y}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.cardsRow}>
          <View style={[styles.card, styles.cardIncome]}>
            <Text style={styles.cardLabel}>Receitas</Text>
            <Text style={styles.cardValue}>R$ {totalIncome.toFixed(2)}</Text>
          </View>
          <View style={[styles.card, styles.cardExpense]}>
            <Text style={styles.cardLabel}>Despesas</Text>
            <Text style={styles.cardValue}>R$ {totalExpense.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Saldo do período</Text>
          <Text style={[styles.balanceValue, { color: balance >= 0 ? '#2E7D32' : '#591218' }]}>
            R$ {balance.toFixed(2)}
          </Text>
        </View>

        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Despesas por categoria</Text>
          {data.length > 0 ? (
            <PieChart
              data={data}
              width={screenWidth - 40}
              height={220}
              chartConfig={{ color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})` }}
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft={"15"}
              center={[10, 0]}
              absolute
            />
          ) : (
            <Text style={styles.emptyText}>Sem despesas neste período.</Text>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => router.push('/add-transactions')}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#FAFAFC', paddingHorizontal: 20 },
  filtersSection: { marginTop: 20, marginBottom: 20 },
  scrollRow: { marginBottom: 10 },
  pill: { backgroundColor: '#E6E6E6', paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20, marginRight: 8 },
  pillActive: { backgroundColor: '#3B1578' },
  pillText: { fontFamily: 'Poppins-SemiBold', fontSize: 13, color: '#444' },
  pillTextActive: { color: '#FFF' },
  cardsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  card: { flex: 0.48, padding: 16, borderRadius: 16, backgroundColor: '#FFF', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  cardIncome: { borderLeftWidth: 5, borderLeftColor: '#3B1578' },
  cardExpense: { borderLeftWidth: 5, borderLeftColor: '#D8627A' },
  cardLabel: { fontFamily: 'Poppins-SemiBold', fontSize: 14, color: '#444' },
  cardValue: { fontFamily: 'Poppins-Bold', fontSize: 16, color: '#000', marginTop: 4 },
  balanceContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 8, marginBottom: 30 },
  balanceLabel: { fontFamily: 'Poppins-Bold', fontSize: 16, color: '#000' },
  balanceValue: { fontFamily: 'Poppins-Bold', fontSize: 16 },
  chartSection: { backgroundColor: '#FFF', padding: 20, borderRadius: 16, elevation: 2 },
  sectionTitle: { fontFamily: 'Poppins-Bold', fontSize: 15, color: '#000', marginBottom: 10 },
  emptyText: { textAlign: 'center', fontFamily: 'Poppins-Regular', color: '#888', marginTop: 20 },
  fab: { position: 'absolute', bottom: 30, right: 30, backgroundColor: '#3B1578', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5 }
});