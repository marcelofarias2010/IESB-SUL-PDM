// app/(tabs)/inicio.jsx
import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import { MoneyContext } from '../../contexts/GlobalState';
import TransactionItem from '../../components/TransactionItem';

export default function Inicio() {
  // CORREÇÃO: Mudamos 'user' para 'currentUser'
  const { transactions, currentUser } = useContext(MoneyContext);
  
  const [selectedMonth, setSelectedMonth] = useState('Mai');
  const [selectedYear, setSelectedYear] = useState('2026');

  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const years = ['2025', '2026', '2027'];

  const monthMap = {
    'Jan': '01', 'Fev': '02', 'Mar': '03', 'Abr': '04', 'Mai': '05', 'Jun': '06',
    'Jul': '07', 'Ago': '08', 'Set': '09', 'Out': '10', 'Nov': '11', 'Dez': '12'
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (!transaction.date) return false;
    const year = transaction.date.substring(0, 4);
    const month = transaction.date.substring(5, 7);
    return year === selectedYear && month === monthMap[selectedMonth];
  });

  return (
    <View style={[globalStyles.screenContainer, styles.container]}>
      <View style={styles.header}>
        <View>
          {/* CORREÇÃO: Puxando o nome do currentUser */}
          <Text style={styles.greeting}>Olá, {currentUser?.name || 'Visitante'}!</Text>
          <Text style={styles.subtitle}>Aqui estão suas transações.</Text>
        </View>
      </View>

      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollRow}>
          {months.map((month) => (
            <TouchableOpacity 
              key={month} 
              style={[styles.pill, selectedMonth === month && styles.pillActive]}
              onPress={() => setSelectedMonth(month)}
            >
              <Text style={[styles.pillText, selectedMonth === month && styles.pillTextActive]}>
                {month}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollRow}>
          {years.map((year) => (
            <TouchableOpacity 
              key={year} 
              style={[styles.pill, selectedYear === year && styles.pillActive]}
              onPress={() => setSelectedYear(year)}
            >
              <Text style={[styles.pillText, selectedYear === year && styles.pillTextActive]}>
                {year}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredTransactions}
        keyExtractor={(item, index) => item.id ? String(item.id) : String(index)}
        renderItem={({ item }) => <TransactionItem transaction={item} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhuma transação encontrada.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: 20, paddingHorizontal: 20, backgroundColor: '#FAFAFC' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  greeting: { fontFamily: 'Poppins-Bold', fontSize: 20, color: '#000' },
  subtitle: { fontFamily: 'Poppins-Regular', fontSize: 14, color: '#666' },
  filtersContainer: { marginBottom: 24 },
  scrollRow: { marginBottom: 12 },
  pill: { backgroundColor: '#E6E6E6', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, marginRight: 10 },
  pillActive: { backgroundColor: '#3B1578' },
  pillText: { fontFamily: 'Poppins-SemiBold', fontSize: 14, color: '#444' },
  pillTextActive: { color: '#FFF' },
  listContainer: { paddingBottom: 100 },
  emptyText: { textAlign: 'center', fontFamily: 'Poppins-Regular', color: '#888', marginTop: 40 }
});