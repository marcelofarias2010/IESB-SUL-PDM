import React, { useState, useCallback, useEffect} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  RefreshControl,
} from 'react-native';
import {
  Text,
  Surface,
  FAB,
  ActivityIndicator,
  Button,
  Portal,
  Dialog,
  TextInput,
  Menu,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { transactionService } from '../../services/transaction.service';
import { categoryService } from '../../services/category.service';
import { Transaction, Category } from '../../types';
import {
  formatCurrency,
  formatDate,
  getCurrentMonth,
  getCurrentYear,
  formatMonthYear,
} from '../../utils/format';

const transactionSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória'),
  value: z.string().min(1, 'Valor é obrigatório').refine((v) => !isNaN(Number(v.replace(',', '.'))) && Number(v.replace(',', '.')) > 0, 'Valor deve ser positivo'),
  date: z.string().min(1, 'Data é obrigatória'),
  categoryId: z.string().min(1, 'Categoria é obrigatória'),
});

type TransactionForm = z.infer<typeof transactionSchema>;

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

export default function TransactionsScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [selectedYear, setSelectedYear] = useState(getCurrentYear());
  const [showMonthMenu, setShowMonthMenu] = useState(false);
  const [showYearMenu, setShowYearMenu] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const currentYear = getCurrentYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TransactionForm>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: '',
      value: '',
      date: new Date().toISOString().split('T')[0],
      categoryId: '',
    },
  });

  const watchCategoryId = watch('categoryId');

  const loadData = useCallback(async () => {
    try {
      const [txData, catData] = await Promise.all([
        transactionService.getAll({ month: selectedMonth, year: selectedYear }),
        categoryService.getAll(),
      ]);
      setTransactions(txData);
      setCategories(catData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function openCreateForm() {
    setEditingTransaction(null);
    reset({ description: '', value: '', date: new Date().toISOString().split('T')[0], categoryId: '' });
    setShowForm(true);
  }

  function openEditForm(transaction: Transaction) {
    setEditingTransaction(transaction);
    reset({
      description: transaction.description,
      value: String(transaction.value),
      date: transaction.date.split('T')[0],
      categoryId: transaction.categoryId,
    });
    setShowActionModal(false);
    setShowForm(true);
  }

  async function onSubmit(data: TransactionForm) {
    try {
      setFormLoading(true);
      const payload = {
        description: data.description,
        value: Number(data.value.replace(',', '.')),
        date: new Date(data.date).toISOString(),
        categoryId: data.categoryId,
      };

      if (editingTransaction) {
        await transactionService.update(editingTransaction.id, payload);
      } else {
        await transactionService.create(payload);
      }

      setShowForm(false);
      loadData();
    } catch (error: any) {
      Alert.alert('Erro', error?.response?.data?.error || 'Erro ao salvar transação');
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(id: string) {
    Alert.alert('Confirmar', 'Deseja excluir esta transação?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await transactionService.delete(id);
            setShowActionModal(false);
            loadData();
          } catch {
            Alert.alert('Erro', 'Falha ao excluir transação');
          }
        },
      },
    ]);
  }

  const selectedCategory = categories.find((c) => c.id === watchCategoryId);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Transações</Text>

        {/* Month/Year filters */}
        <View style={styles.filtersRow}>
          <Menu
            visible={showMonthMenu}
            onDismiss={() => setShowMonthMenu(false)}
            anchor={
              <TouchableOpacity
                style={styles.filterBtn}
                onPress={() => setShowMonthMenu(true)}
              >
                <Text style={styles.filterText}>{MONTHS[selectedMonth - 1]}</Text>
                <MaterialCommunityIcons name="chevron-down" size={16} color="#52B788" />
              </TouchableOpacity>
            }
          >
            {MONTHS.map((m, i) => (
              <Menu.Item
                key={i}
                title={m}
                onPress={() => { setSelectedMonth(i + 1); setShowMonthMenu(false); }}
              />
            ))}
          </Menu>

          <Menu
            visible={showYearMenu}
            onDismiss={() => setShowYearMenu(false)}
            anchor={
              <TouchableOpacity
                style={styles.filterBtn}
                onPress={() => setShowYearMenu(true)}
              >
                <Text style={styles.filterText}>{selectedYear}</Text>
                <MaterialCommunityIcons name="chevron-down" size={16} color="#52B788" />
              </TouchableOpacity>
            }
          >
            {years.map((y) => (
              <Menu.Item
                key={y}
                title={String(y)}
                onPress={() => { setSelectedYear(y); setShowYearMenu(false); }}
              />
            ))}
          </Menu>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator color="#52B788" style={{ flex: 1, justifyContent: 'center' }} />
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => { setRefreshing(true); loadData(); }}
              tintColor="#52B788"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="inbox-outline" size={64} color="#B7C9BF" />
              <Text style={styles.emptyText}>Nenhuma transação encontrada</Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              onLongPress={() => {
                setSelectedTransaction(item);
                setShowActionModal(true);
              }}
              delayLongPress={400}
            >
              <Surface style={styles.transactionItem} elevation={1}>
                <View
                  style={[
                    styles.categoryIcon,
                    { backgroundColor: item.category?.background || '#ccc' },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={(item.category?.icon as any) || 'cash'}
                    size={20}
                    color="#fff"
                  />
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionDesc} numberOfLines={1}>
                    {item.description}
                  </Text>
                  <Text style={styles.transactionMeta}>
                    {item.category?.displayName} · {formatDate(item.date)}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.transactionValue,
                    { color: item.category?.isIncome ? '#2D6A4F' : '#E63946' },
                  ]}
                >
                  {item.category?.isIncome ? '+' : '-'}
                  {formatCurrency(item.value)}
                </Text>
              </Surface>
            </TouchableOpacity>
          )}
        />
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        color="#fff"
        onPress={openCreateForm}
      />

      {/* Long press actions modal */}
      <Portal>
        <Dialog
          visible={showActionModal}
          onDismiss={() => setShowActionModal(false)}
          style={styles.dialog}
        >
          <Dialog.Title>O que deseja fazer?</Dialog.Title>
          <Dialog.Content>
            <Text style={{ color: '#6B7A8D' }}>{selectedTransaction?.description}</Text>
          </Dialog.Content>
          <Dialog.Actions style={{ flexDirection: 'column', gap: 8, paddingHorizontal: 16 }}>
            <Button
              mode="contained"
              onPress={() => selectedTransaction && openEditForm(selectedTransaction)}
              icon="pencil"
              buttonColor="#2D6A4F"
              style={{ width: '100%' }}
            >
              Editar
            </Button>
            <Button
              mode="outlined"
              onPress={() => selectedTransaction && handleDelete(selectedTransaction.id)}
              icon="delete"
              textColor="#E63946"
              style={{ width: '100%', borderColor: '#E63946' }}
            >
              Excluir
            </Button>
            <Button mode="text" onPress={() => setShowActionModal(false)} style={{ width: '100%' }}>
              Cancelar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Transaction Form Modal */}
      <Modal visible={showForm} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.formContainer}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>
              {editingTransaction ? 'Editar Transação' : 'Nova Transação'}
            </Text>
            <TouchableOpacity onPress={() => setShowForm(false)}>
              <MaterialCommunityIcons name="close" size={24} color="#6B7A8D" />
            </TouchableOpacity>
          </View>

          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Descrição"
                value={value}
                onChangeText={onChange}
                mode="outlined"
                error={!!errors.description}
                style={styles.formInput}
                outlineColor="#B7C9BF"
                activeOutlineColor="#2D6A4F"
              />
            )}
          />
          {errors.description && <Text style={styles.errorText}>{errors.description.message}</Text>}

          <Controller
            control={control}
            name="value"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Valor (R$)"
                value={value}
                onChangeText={onChange}
                mode="outlined"
                keyboardType="decimal-pad"
                error={!!errors.value}
                style={styles.formInput}
                outlineColor="#B7C9BF"
                activeOutlineColor="#2D6A4F"
              />
            )}
          />
          {errors.value && <Text style={styles.errorText}>{errors.value.message}</Text>}

          <Controller
            control={control}
            name="date"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Data (AAAA-MM-DD)"
                value={value}
                onChangeText={onChange}
                mode="outlined"
                placeholder="2024-06-15"
                error={!!errors.date}
                style={styles.formInput}
                outlineColor="#B7C9BF"
                activeOutlineColor="#2D6A4F"
              />
            )}
          />
          {errors.date && <Text style={styles.errorText}>{errors.date.message}</Text>}

          <Text style={styles.pickerLabel}>Categoria</Text>
          <TouchableOpacity
            style={[styles.categoryPicker, errors.categoryId && styles.categoryPickerError]}
            onPress={() => setShowCategoryPicker(true)}
          >
            {selectedCategory ? (
              <View style={styles.selectedCategory}>
                <View style={[styles.miniIcon, { backgroundColor: selectedCategory.background }]}>
                  <MaterialCommunityIcons name={(selectedCategory.icon as any)} size={14} color="#fff" />
                </View>
                <Text style={styles.selectedCategoryText}>{selectedCategory.displayName}</Text>
              </View>
            ) : (
              <Text style={styles.placeholderText}>Selecione uma categoria...</Text>
            )}
            <MaterialCommunityIcons name="chevron-down" size={20} color="#6B7A8D" />
          </TouchableOpacity>
          {errors.categoryId && <Text style={styles.errorText}>{errors.categoryId.message}</Text>}

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={formLoading}
            disabled={formLoading}
            style={styles.submitBtn}
            buttonColor="#2D6A4F"
          >
            {editingTransaction ? 'Salvar alterações' : 'Criar transação'}
          </Button>
        </View>

        {/* Category picker modal */}
        <Modal visible={showCategoryPicker} animationType="slide" transparent>
          <View style={styles.categoryPickerOverlay}>
            <View style={styles.categoryPickerSheet}>
              <Text style={styles.pickerSheetTitle}>Selecionar categoria</Text>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={styles.catOption}
                  onPress={() => {
                    setValue('categoryId', cat.id);
                    setShowCategoryPicker(false);
                  }}
                >
                  <View style={[styles.catOptionIcon, { backgroundColor: cat.background }]}>
                    <MaterialCommunityIcons name={(cat.icon as any)} size={20} color="#fff" />
                  </View>
                  <Text style={styles.catOptionText}>{cat.displayName}</Text>
                  {watchCategoryId === cat.id && (
                    <MaterialCommunityIcons name="check" size={20} color="#2D6A4F" />
                  )}
                </TouchableOpacity>
              ))}
              <Button mode="text" onPress={() => setShowCategoryPicker(false)} style={{ marginTop: 8 }}>
                Fechar
              </Button>
            </View>
          </View>
        </Modal>
      </Modal>
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
  list: { padding: 16, paddingBottom: 100 },
  emptyContainer: { alignItems: 'center', marginTop: 80 },
  emptyText: { color: '#B7C9BF', marginTop: 12, fontSize: 16 },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: { flex: 1 },
  transactionDesc: { fontSize: 14, fontWeight: '600', color: '#1A1F2E' },
  transactionMeta: { fontSize: 12, color: '#6B7A8D', marginTop: 2 },
  transactionValue: { fontSize: 15, fontWeight: '700' },
  fab: { position: 'absolute', right: 20, bottom: 24, backgroundColor: '#2D6A4F' },
  dialog: { borderRadius: 16 },
  formContainer: { flex: 1, backgroundColor: '#FFFFFF', padding: 24 },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 16,
  },
  formTitle: { fontSize: 22, fontWeight: '700', color: '#1A1F2E' },
  formInput: { marginBottom: 4, backgroundColor: '#FFFFFF' },
  errorText: { color: '#E63946', fontSize: 12, marginBottom: 8, marginLeft: 4 },
  pickerLabel: { fontSize: 12, color: '#6B7A8D', marginBottom: 4, marginLeft: 4 },
  categoryPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#B7C9BF',
    borderRadius: 4,
    padding: 14,
    marginBottom: 4,
  },
  categoryPickerError: { borderColor: '#E63946' },
  selectedCategory: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  miniIcon: { width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  selectedCategoryText: { color: '#1A1F2E', fontSize: 16 },
  placeholderText: { color: '#9CA3AF', fontSize: 16 },
  submitBtn: { marginTop: 24, borderRadius: 8, paddingVertical: 4 },
  categoryPickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  categoryPickerSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  pickerSheetTitle: { fontSize: 18, fontWeight: '700', color: '#1A1F2E', marginBottom: 16 },
  catOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 12,
  },
  catOptionIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  catOptionText: { flex: 1, fontSize: 16, color: '#1A1F2E' },
});
