import React, { useContext, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions
} from "react-native";
import { useRouter } from "expo-router";
import { MoneyContext } from "../../contexts/GlobalState";
import { PieChart } from "react-native-chart-kit";

export default function Summary() {
  const router = useRouter();
  const { transactions, categories, loading } = useContext(MoneyContext);
  const screenWidth = Dimensions.get("window").width;

  const { income, expense, balance } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    transactions.forEach((tx) => {
      const category = categories.find((c) => c.id === tx.categoryId);
      const isIncome = category ? category.isIncome : false;
      const val = parseFloat(tx.value) || 0;
      if (isIncome) inc += val;
      else exp += val;
    });
    return { income: inc, expense: exp, balance: inc - exp };
  }, [transactions, categories]);

  // Configuração dos dados com o Cifrão obrigatório nas legendas
  const chartData = useMemo(() => {
    return categories
      .filter(cat => !cat.isIncome)
      .map((cat) => {
        const totalCat = transactions
          .filter(t => t.categoryId === cat.id)
          .reduce((acc, curr) => acc + (parseFloat(curr.value) || 0), 0);

        let categoryColor = cat.background || '#ccc';
        const nameLower = cat.name?.toLowerCase() || '';
        const displayLower = cat.displayName?.toLowerCase() || '';
        
        if (nameLower === 'food' || displayLower === 'alimentação') categoryColor = '#4CAF50';
        else if (nameLower === 'house' || displayLower === 'casa') categoryColor = '#E6E088';
        else if (nameLower === 'education' || displayLower === 'educação') categoryColor = '#9E9E9E';
        else if (nameLower === 'health' || displayLower === 'saúde' || displayLower === 'saude') categoryColor = '#F44336';
        else if (nameLower === 'travel' || displayLower === 'viagens') categoryColor = '#2196F3';

        return {
          // Injeta obrigatoriamente o texto do Cifrão ao lado do nome na legenda
          name: `${cat.displayName} (R$)`,
          population: totalCat,
          color: categoryColor,
          legendFontColor: "#333",
          legendFontSize: 12
        };
      })
      .filter(item => item.population > 0);
  }, [transactions, categories]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2e7d32" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Saldo Atual</Text>
        <Text style={[styles.balanceValue, balance >= 0 ? styles.positive : styles.negative]}>
          R$ {balance.toFixed(2)}
        </Text>
        <View style={styles.rowSummary}>
          <View>
            <Text style={styles.subLabel}>Receitas</Text>
            <Text style={styles.incomeText}>+ R$ {income.toFixed(2)}</Text>
          </View>
          <View>
            <Text style={styles.subLabel}>Despesas</Text>
            <Text style={styles.expenseText}>- R$ {expense.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity style={[styles.actionButton, styles.btnTx]} onPress={() => router.push("/add-transactions")}>
          <Text style={styles.actionButtonText}>+ Transação</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.btnCat]} onPress={() => router.push("/add-categories")}>
          <Text style={styles.actionButtonText}>+ Categoria</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Distribuição de Despesas</Text>
        {chartData.length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma despesa registrada para exibir no gráfico.</Text>
        ) : (
          <PieChart
            data={chartData}
            width={screenWidth - 64}
            height={200}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
            absolute
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  balanceCard: { backgroundColor: "#1e1e1e", padding: 20, borderRadius: 16, marginBottom: 20 },
  balanceLabel: { color: "#aaa", fontSize: 14 },
  balanceValue: { fontSize: 32, fontWeight: "bold", marginVertical: 8 },
  positive: { color: "#4CAF50" },
  negative: { color: "#F44336" },
  rowSummary: { flexDirection: "row", justifyContent: "space-between", marginTop: 15, borderTopWidth: 0.5, borderColor: "#444", paddingTop: 15 },
  subLabel: { color: "#888", fontSize: 12 },
  incomeText: { color: "#4CAF50", fontWeight: "600" },
  expenseText: { color: "#F44336", fontWeight: "600" },
  actionContainer: { flexDirection: "row", gap: 12, marginBottom: 20 },
  actionButton: { flex: 1, padding: 14, borderRadius: 12, alignItems: "center" },
  btnTx: { backgroundColor: "#2e7d32" },
  btnCat: { backgroundColor: "#0288d1" },
  actionButtonText: { color: "#fff", fontWeight: "bold" },
  chartContainer: { backgroundColor: "#fff", padding: 16, borderRadius: 16, marginBottom: 40 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10, color: "#333" },
  emptyText: { color: "#999", textAlign: "center", marginVertical: 20, fontSize: 14 }
});