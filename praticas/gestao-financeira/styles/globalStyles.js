// styles/globalStyles.js
import { StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

export const globalStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#F8F7FA', // Um fundo leve para os cards brancos destacarem
    padding: 16,
  },
  titleText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
    color: colors.textTitle,
    marginBottom: 4,
  },
  bodyText: {
    fontFamily: 'Poppins',
    fontSize: 14,
    color: colors.textBody,
  },
  subtitleText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: colors.textTitle,
  },
  transactionItem: {
    backgroundColor: colors.card,
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    // Sombra suave para o card
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 15,
    fontFamily: 'Poppins',
    fontSize: 15,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.textTitle
  }
});