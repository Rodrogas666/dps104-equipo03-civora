import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ReportesProvider } from '@/context/ReportesContext';
import { SesionProvider } from '@/context/SesionContext';

import '../../global.css';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SesionProvider>
        <ReportesProvider>
          <StatusBar style="dark" />
          {/* Pila raíz: acceso -> pestañas -> pantallas de flujo (reportar, cámara, detalle, etc.) */}
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </ReportesProvider>
      </SesionProvider>
    </SafeAreaProvider>
  );
}
