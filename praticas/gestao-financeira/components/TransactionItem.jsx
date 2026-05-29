import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Button as RNButton, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { MoneyContext } from '../contexts/GlobalState';

export default function TransactionItem({ transaction }) {
  const { removeTransaction } = useContext(MoneyContext);
  const [modalVisible, setModalVisible] = useState(false);

  // REGRA DE CORES E SINAIS:
  // Verifica se o tipo que vem do banco é 'saldo' (ou se a categoria é receita/saldo por segurança)
  const isPositive = transaction.type === 'saldo' || transaction.category?.name?.toLowerCase() === 'receita' || transaction.category?.name?.toLowerCase() === 'saldo';
  
  // Verde para o que entra (Saldo) e Vermelho para o que sai (Despesa)
  const valueColor = isPositive ? '#2E7D32' : '#D93025'; 
  const displaySign = isPositive ? '+ ' : '- ';
  
  let formattedDate = 'Data inválida';
  if (transaction.date) {
    const [year, month, day] = transaction.date.split('-');
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    if (year && month && day) {
       formattedDate = `${day} ${months[parseInt(month, 10) - 1]} ${year}`;
    }
  }

  const handleDeleteClick = () => {
    if (Platform.OS === 'web') {
      if (window.confirm("Deseja excluir esta transação?")) {
        confirmDelete();
      }
    } else {
      setModalVisible(true);
    }
  };

  const confirmDelete = async () => {
    try {
      if (!transaction.id) return;
      await removeTransaction(transaction.id);
      setModalVisible(false);
    } catch (e) {
      alert("Erro ao excluir. Verifique o console.");
    }
  };

  return (
    <>
      <View style={styles.card}>
        <View style={styles.leftInfo}>
          <Text style={styles.date}>{formattedDate}</Text>
          <Text style={styles.description}>{transaction.description}</Text>
          <Text style={styles.category}>{transaction.category?.name || 'Sem Categoria'}</Text>
        </View>
        
        <View style={styles.rightInfo}>
          {/* AQUI APLICAMOS A COR E O SINAL DEFINIDOS */}
          <Text style={[styles.value, { color: valueColor }]}>
            {displaySign}R$ {Number(transaction.value).toFixed(2)}
          </Text>
          <TouchableOpacity onPress={handleDeleteClick} style={styles.trashBtn}>
            <Ionicons name="trash-outline" size={20} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <Modal transparent={true} visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Excluir Transação</Text>
            <Text style={styles.modalBody}>Deseja excluir "{transaction.description}"?</Text>
            <View style={styles.modalActions}>
              <RNButton title="Cancelar" color="#888" onPress={() => setModalVisible(false)} />
              <RNButton title="Excluir" color="#D93025" onPress={confirmDelete} />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  leftInfo: { flex: 1, justifyContent: 'center' },
  rightInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  date: { fontFamily: 'Poppins-Regular', fontSize: 11, color: '#888', marginBottom: 2 },
  description: { fontFamily: 'Poppins-SemiBold', fontSize: 15, color: '#000' },
  category: { fontFamily: 'Poppins-Regular', fontSize: 12, color: '#888', marginTop: 2 },
  value: { fontFamily: 'Poppins-Bold', fontSize: 15 },
  trashBtn: { padding: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: 'white', padding: 24, borderRadius: 16, width: '80%' },
  modalTitle: { fontFamily: 'Poppins-Bold', fontSize: 18, marginBottom: 8 },
  modalBody: { fontFamily: 'Poppins-Regular', fontSize: 14, color: '#444', marginBottom: 24 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 16 }
});