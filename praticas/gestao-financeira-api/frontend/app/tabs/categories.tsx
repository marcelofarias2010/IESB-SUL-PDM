import React, { useState, useCallback, useEffect } from 'react';
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
  Switch,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { categoryService } from '../../services/category.service';
import { Category } from '../../types';

const categorySchema = z.object({
  name: z.string().min(1, 'Nome interno é obrigatório').regex(/^[a-z0-9_]+$/, 'Use apenas letras minúsculas, números e underscore'),
  displayName: z.string().min(1, 'Nome de exibição é obrigatório'),
  icon: z.string().min(1, 'Ícone é obrigatório'),
  background: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor deve ser hex válida ex: #FF5733'),
  isIncome: z.boolean(),
});

type CategoryForm = z.infer<typeof categorySchema>;

const ICON_OPTIONS = [
  'cash', 'food', 'car', 'home', 'gamepad-variant', 'heart', 'shopping',
  'school', 'airplane', 'dumbbell', 'music', 'laptop', 'gift', 'dog',
  'baby-carriage', 'briefcase', 'medical-bag', 'fuel', 'tools', 'phone',
];

const COLOR_OPTIONS = [
  '#4CAF50', '#FF5722', '#2196F3', '#9C27B0', '#FF9800',
  '#E91E63', '#00BCD4', '#795548', '#607D8B', '#F44336',
  '#3F51B5', '#009688', '#CDDC39', '#FFC107', '#FF5252',
];

export default function CategoriesScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      displayName: '',
      icon: 'cash',
      background: '#4CAF50',
      isIncome: false,
    },
  });

  const watchIcon = watch('icon');
  const watchBackground = watch('background');
  const watchIsIncome = watch('isIncome');

  const loadCategories = useCallback(async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  function openCreateForm() {
    setEditingCategory(null);
    reset({ name: '', displayName: '', icon: 'cash', background: '#4CAF50', isIncome: false });
    setShowForm(true);
  }

  function openEditForm(category: Category) {
    setEditingCategory(category);
    reset({
      name: category.name,
      displayName: category.displayName,
      icon: category.icon,
      background: category.background,
      isIncome: category.isIncome,
    });
    setShowActionModal(false);
    setShowForm(true);
  }

  async function onSubmit(data: CategoryForm) {
    try {
      setFormLoading(true);
      if (editingCategory) {
        await categoryService.update(editingCategory.id, data);
      } else {
        await categoryService.create(data);
      }
      setShowForm(false);
      loadCategories();
    } catch (error: any) {
      Alert.alert('Erro', error?.response?.data?.error || 'Erro ao salvar categoria');
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(category: Category) {
    if (category.isDefault) {
      Alert.alert('Atenção', 'Categorias padrão não podem ser excluídas');
      return;
    }
    Alert.alert('Confirmar', `Deseja excluir "${category.displayName}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await categoryService.delete(category.id);
            setShowActionModal(false);
            loadCategories();
          } catch (error: any) {
            Alert.alert('Erro', error?.response?.data?.error || 'Falha ao excluir categoria');
          }
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Categorias</Text>
        <Text style={styles.headerSub}>{categories.length} categorias</Text>
      </View>

      {loading ? (
        <ActivityIndicator color="#52B788" style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => { setRefreshing(true); loadCategories(); }}
              tintColor="#52B788"
            />
          }
          renderItem={({ item }) => (
            <Surface style={styles.categoryItem} elevation={1}>
              <View style={[styles.categoryIcon, { backgroundColor: item.background }]}>
                <MaterialCommunityIcons name={(item.icon as any)} size={22} color="#fff" />
              </View>
              <View style={styles.categoryInfo}>
                <View style={styles.categoryNameRow}>
                  <Text style={styles.categoryName}>{item.displayName}</Text>
                  {item.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultBadgeText}>Padrão</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.categoryType}>
                  {item.isIncome ? '📈 Receita' : '📉 Despesa'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setSelectedCategory(item);
                  setShowActionModal(true);
                }}
                style={styles.moreBtn}
              >
                <MaterialCommunityIcons name="dots-vertical" size={20} color="#6B7A8D" />
              </TouchableOpacity>
            </Surface>
          )}
        />
      )}

      <FAB icon="plus" style={styles.fab} color="#fff" onPress={openCreateForm} />

      {/* Action modal */}
      <Portal>
        <Dialog visible={showActionModal} onDismiss={() => setShowActionModal(false)} style={styles.dialog}>
          <Dialog.Title>{selectedCategory?.displayName}</Dialog.Title>
          <Dialog.Actions style={{ flexDirection: 'column', gap: 8, paddingHorizontal: 16 }}>
            <Button
              mode="contained"
              onPress={() => selectedCategory && openEditForm(selectedCategory)}
              icon="pencil"
              buttonColor="#2D6A4F"
              style={{ width: '100%' }}
            >
              Editar
            </Button>
            <Button
              mode="outlined"
              onPress={() => selectedCategory && handleDelete(selectedCategory)}
              icon="delete"
              textColor={selectedCategory?.isDefault ? '#9CA3AF' : '#E63946'}
              style={{ width: '100%', borderColor: selectedCategory?.isDefault ? '#9CA3AF' : '#E63946' }}
              disabled={selectedCategory?.isDefault}
            >
              {selectedCategory?.isDefault ? 'Padrão (não excluível)' : 'Excluir'}
            </Button>
            <Button mode="text" onPress={() => setShowActionModal(false)} style={{ width: '100%' }}>
              Cancelar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Category Form Modal */}
      <Modal visible={showForm} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.formContainer}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>
              {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
            </Text>
            <TouchableOpacity onPress={() => setShowForm(false)}>
              <MaterialCommunityIcons name="close" size={24} color="#6B7A8D" />
            </TouchableOpacity>
          </View>

          {/* Preview */}
          <View style={styles.preview}>
            <View style={[styles.previewIcon, { backgroundColor: watchBackground }]}>
              <MaterialCommunityIcons name={(watchIcon as any)} size={32} color="#fff" />
            </View>
            <Text style={styles.previewText}>Prévia</Text>
          </View>

          <Controller
            control={control}
            name="displayName"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Nome de exibição"
                value={value}
                onChangeText={onChange}
                mode="outlined"
                error={!!errors.displayName}
                style={styles.formInput}
                outlineColor="#B7C9BF"
                activeOutlineColor="#2D6A4F"
              />
            )}
          />
          {errors.displayName && <Text style={styles.errorText}>{errors.displayName.message}</Text>}

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Nome interno (sem espaços)"
                value={value}
                onChangeText={(t) => onChange(t.toLowerCase().replace(/\s/g, '_'))}
                mode="outlined"
                error={!!errors.name}
                style={styles.formInput}
                outlineColor="#B7C9BF"
                activeOutlineColor="#2D6A4F"
                disabled={!!editingCategory}
              />
            )}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

          {/* Icon picker */}
          <Text style={styles.pickerLabel}>Ícone</Text>
          <TouchableOpacity style={styles.pickerRow} onPress={() => setShowIconPicker(!showIconPicker)}>
            <MaterialCommunityIcons name={(watchIcon as any)} size={24} color="#1A1F2E" />
            <Text style={styles.pickerRowText}>{watchIcon}</Text>
            <MaterialCommunityIcons name={showIconPicker ? 'chevron-up' : 'chevron-down'} size={20} color="#6B7A8D" />
          </TouchableOpacity>
          {showIconPicker && (
            <View style={styles.iconGrid}>
              {ICON_OPTIONS.map((icon) => (
                <TouchableOpacity
                  key={icon}
                  style={[styles.iconOption, watchIcon === icon && styles.iconSelected]}
                  onPress={() => { setValue('icon', icon); setShowIconPicker(false); }}
                >
                  <MaterialCommunityIcons name={(icon as any)} size={24} color={watchIcon === icon ? '#2D6A4F' : '#1A1F2E'} />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Color picker */}
          <Text style={styles.pickerLabel}>Cor de fundo</Text>
          <TouchableOpacity style={styles.pickerRow} onPress={() => setShowColorPicker(!showColorPicker)}>
            <View style={[styles.colorSwatch, { backgroundColor: watchBackground }]} />
            <Text style={styles.pickerRowText}>{watchBackground}</Text>
            <MaterialCommunityIcons name={showColorPicker ? 'chevron-up' : 'chevron-down'} size={20} color="#6B7A8D" />
          </TouchableOpacity>
          {showColorPicker && (
            <View style={styles.colorGrid}>
              {COLOR_OPTIONS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[styles.colorOption, { backgroundColor: color }, watchBackground === color && styles.colorSelected]}
                  onPress={() => { setValue('background', color); setShowColorPicker(false); }}
                />
              ))}
            </View>
          )}

          {/* Is Income toggle */}
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>É uma receita?</Text>
            <Controller
              control={control}
              name="isIncome"
              render={({ field: { onChange, value } }) => (
                <Switch value={value} onValueChange={onChange} color="#2D6A4F" />
              )}
            />
          </View>

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={formLoading}
            disabled={formLoading}
            style={styles.submitBtn}
            buttonColor="#2D6A4F"
          >
            {editingCategory ? 'Salvar alterações' : 'Criar categoria'}
          </Button>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAF9' },
  header: {
    backgroundColor: '#1a1f2e',
    paddingTop: 56,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: { color: '#FFFFFF', fontSize: 24, fontWeight: '700' },
  headerSub: { color: '#6B7A8D', fontSize: 13, marginTop: 4 },
  list: { padding: 16, paddingBottom: 100 },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  categoryInfo: { flex: 1 },
  categoryNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  categoryName: { fontSize: 16, fontWeight: '600', color: '#1A1F2E' },
  defaultBadge: {
    backgroundColor: '#EDF4F0',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  defaultBadgeText: { color: '#2D6A4F', fontSize: 10, fontWeight: '600' },
  categoryType: { fontSize: 12, color: '#6B7A8D', marginTop: 3 },
  moreBtn: { padding: 4 },
  fab: { position: 'absolute', right: 20, bottom: 24, backgroundColor: '#2D6A4F' },
  dialog: { borderRadius: 16 },
  formContainer: { flex: 1, backgroundColor: '#FFFFFF', padding: 24 },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 16,
  },
  formTitle: { fontSize: 22, fontWeight: '700', color: '#1A1F2E' },
  preview: { alignItems: 'center', marginBottom: 20 },
  previewIcon: { width: 72, height: 72, borderRadius: 36, justifyContent: 'center', alignItems: 'center' },
  previewText: { color: '#6B7A8D', marginTop: 8, fontSize: 12 },
  formInput: { marginBottom: 4, backgroundColor: '#FFFFFF' },
  errorText: { color: '#E63946', fontSize: 12, marginBottom: 8, marginLeft: 4 },
  pickerLabel: { fontSize: 12, color: '#6B7A8D', marginTop: 12, marginBottom: 4 },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#B7C9BF',
    borderRadius: 4,
    padding: 12,
    gap: 10,
  },
  pickerRowText: { flex: 1, fontSize: 14, color: '#1A1F2E' },
  iconGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  iconOption: {
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  iconSelected: { borderColor: '#2D6A4F', backgroundColor: '#EDF4F0' },
  colorSwatch: { width: 24, height: 24, borderRadius: 12 },
  colorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8 },
  colorOption: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: 'transparent' },
  colorSelected: { borderColor: '#1A1F2E', transform: [{ scale: 1.2 }] },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 8,
  },
  toggleLabel: { fontSize: 16, color: '#1A1F2E' },
  submitBtn: { marginTop: 24, borderRadius: 8, paddingVertical: 4 },
});
