import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ReportesProvider } from '@/context/ReportesContext';

import '../../global.css';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ReportesProvider>
        <StatusBar style="dark" />
        {/* Pila raíz: acceso -> pestañas -> pantallas de flujo (reportar, cámara, etc.) */}
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </ReportesProvider>
    </SafeAreaProvider>
  );
}
