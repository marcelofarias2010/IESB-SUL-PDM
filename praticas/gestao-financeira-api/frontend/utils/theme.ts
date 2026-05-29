import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2D6A4F',
    secondary: '#52B788',
    tertiary: '#1B4332',
    background: '#F8FAF9',
    surface: '#FFFFFF',
    surfaceVariant: '#EDF4F0',
    error: '#E63946',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onBackground: '#1A1F2E',
    onSurface: '#1A1F2E',
    outline: '#B7C9BF',
    income: '#2D6A4F',
    expense: '#E63946',
    incomeLight: '#D8F3DC',
    expenseLight: '#FFE8E8',
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#52B788',
    secondary: '#2D6A4F',
    background: '#0D1117',
    surface: '#161B22',
    surfaceVariant: '#1F2937',
    error: '#E63946',
  },
};

export type AppTheme = typeof lightTheme;
