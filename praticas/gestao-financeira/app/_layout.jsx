import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { colors } from "../constants/colors";
import MoneyProvider from "../contexts/GlobalState"; // Importa o default com o novo nome semântico

export default function RootLayout() {
  return (
    <MoneyProvider>
      <StatusBar backgroundColor={colors.primary} style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        {/* Login como primeira tela */}
        <Stack.Screen name="login/login" options={{ headerShown: false }} />
        
        {/* Demais telas do app */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ headerShown: true, title: "Não Encontrado" }} />
      </Stack>
    </MoneyProvider>
  );
}
