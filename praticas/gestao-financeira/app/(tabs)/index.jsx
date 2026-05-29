import React, { useContext } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';

// Importação do contexto
import * as GlobalStateModule from '../../contexts/GlobalState'; 

export default function Index() {
  const MoneyContext = GlobalStateModule.MoneyContext;

  if (!MoneyContext) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Erro de Importação:</Text>
        <Text style={{ textAlign: 'center', marginTop: 5 }}>
          O MoneyContext veio como undefined no arquivo index.jsx.
        </Text>
      </View>
    );
  }

  const context = useContext(MoneyContext);

  if (!context) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Erro de Provedor:</Text>
        <Text style={{ textAlign: 'center', marginTop: 5 }}>
          MoneyContext existe, mas o MoneyProvider não está envolvendo esta rota.
        </Text>
      </View>
    );
  }

  const { transactions, categories, loading, refresh, error } = context;

  // 🚀 FUNÇÃO REFORÇADA: Garante o mapeamento mesmo se o banco vier bagunçado
  const getCategoryDetails = (item) => {
    // 1. Tenta buscar do objeto category direto
    if (item?.category?.displayName) {
      return {
        name: item.category.displayName,
        color: item.category.background || '#999',
        isIncome: !!item.category.isIncome,
      };
    }

    // 2. Busca cruzada na lista de categorias global (essencial para transações novas)
    if (categories && categories.length > 0) {
      const idAlvo = item?.category_id || item?.categoryId;
      const encontrada = categories.find(c => c.id.toString() === idAlvo?.toString());
      
      if (encontrada) {
        return {
          name: encontrada.displayName,
          color: encontrada.background || '#999',
          isIncome: !!encontrada.isIncome, // Força a virar true/false booleano
        };
      }
    }

    // 3. Fallback de segurança
    return {
      name: "Outros",
      color: "#999999",
      isIncome: false,
    };
  };

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Erro de conexão com a API:</Text>
        <Text style={{ color: '#666', marginTop: 5 }}>{error}</Text>
      </View>
    );
  }

  if (loading && (!transactions || transactions.length === 0)) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2e7d32" />
        <Text style={{ marginTop: 10, color: '#666' }}>Sincronizando dados...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={transactions}
        // Chave única ultra segura
        keyExtractor={(item, index) => item?.id?.toString() ?? index.toString()} 
        renderItem={({ item }) => {
          if (!item) return null;

          // Resolve os detalhes da categoria de forma segura
          const catDetails = getCategoryDetails(item);

          // 🚀 TRATAMENTO DO VALOR FINANCEIRO: 
          // Se o banco retornar como String ("150.00"), converte para número puro
          let rawValue = item.value;
          if (typeof rawValue === 'string') {
            rawValue = parseFloat(rawValue.replace(',', '.'));
          }
          const safeValue = isNaN(rawValue) ? 0 : Number(rawValue);

          return (
            <View style={styles.itemContainer}>
              <View style={styles.leftBox}>
                {/* Círculo com a cor da categoria */}
                <View style={[styles.colorBadge, { backgroundColor: catDetails.color }]}>
                  <Text style={styles.badgeLetter}>
                    {catDetails.name ? catDetails.name[0].toUpperCase() : "O"}
                  </Text>
                </View>
                
                <View>
                  <Text style={styles.itemTitle}>{item.description || "Sem descrição"}</Text>
                  <Text style={styles.itemCategoryName}>{catDetails.name}</Text>
                </View>
              </View>

              {/* Cor baseada estritamente no mapeamento de categoria resolvido acima */}
              <Text style={[
                styles.itemValue, 
                { color: catDetails.isIncome ? '#2e7d32' : '#c62828' }
              ]}>
                {catDetails.isIncome ? "+ " : "- "}R$ {safeValue.toFixed(2)}
              </Text>
            </View>
          );
        }}
        refreshing={loading}
        onRefresh={refresh}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>Nenhuma transação registrada no banco.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff', 
    paddingTop: 10 
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
  },
  itemContainer: { 
    padding: 16, 
    borderBottomWidth: 1, 
    borderColor: '#f5f5f5', 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  leftBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  colorBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  badgeLetter: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 14,
  },
  itemTitle: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#222' 
  },
  itemCategoryName: {
    fontSize: 12,
    color: '#777',
    marginTop: 2
  },
  itemValue: { 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  errorText: { 
    color: 'red', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  emptyText: { 
    color: '#888', 
    textAlign: 'center',
    marginTop: 40
  }
});