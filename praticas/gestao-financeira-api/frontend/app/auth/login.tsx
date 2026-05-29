import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Text, TextInput, Button, Surface } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(data: LoginForm) {
    try {
      setLoading(true);
      await signIn(data.email, data.password);
      router.replace('/tabs/home');
    } catch (error: any) {
      const message =
        error?.response?.data?.error || 'Falha ao fazer login. Verifique suas credenciais.';
      Alert.alert('Erro', message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>💰</Text>
          </View>
          <Text style={styles.title}>Gestão Financeira</Text>
          <Text style={styles.subtitle}>Controle suas finanças com facilidade</Text>
        </View>

        <Surface style={styles.card} elevation={2}>
          <Text style={styles.cardTitle}>Entrar na conta</Text>

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Email"
                value={value}
                onChangeText={onChange}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                left={<TextInput.Icon icon="email-outline" />}
                error={!!errors.email}
                style={styles.input}
                outlineColor="#B7C9BF"
                activeOutlineColor="#2D6A4F"
              />
            )}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Senha"
                value={value}
                onChangeText={onChange}
                mode="outlined"
                secureTextEntry={!showPassword}
                left={<TextInput.Icon icon="lock-outline" />}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                error={!!errors.password}
                style={styles.input}
                outlineColor="#B7C9BF"
                activeOutlineColor="#2D6A4F"
              />
            )}
          />
          {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            disabled={loading}
            style={styles.button}
            contentStyle={styles.buttonContent}
            buttonColor="#2D6A4F"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </Surface>

        <Text style={styles.hint}>
          Use: admin@admin.com / 123456
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1f2e',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2D6A4F',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoIcon: {
    fontSize: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#B7C9BF',
    textAlign: 'center',
  },
  card: {
    borderRadius: 16,
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1F2E',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 4,
    backgroundColor: '#FFFFFF',
  },
  errorText: {
    color: '#E63946',
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 4,
  },
  button: {
    marginTop: 16,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 6,
  },
  hint: {
    color: '#6B7A8D',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 24,
  },
});
