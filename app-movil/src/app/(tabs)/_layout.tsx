import { router, Tabs } from 'expo-router';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import type { ColorValue } from 'react-native';

import { ColoresCivora } from '@/constants/coloresCivora';

function icono(nombre: SymbolViewProps['name']) {
  return function IconoPestana({ color, size }: { color: ColorValue; size: number }) {
    return <SymbolView name={nombre} size={size} tintColor={color} />;
  };
}

export default function PestanasLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ColoresCivora.primary,
        tabBarInactiveTintColor: ColoresCivora.muted,
        tabBarStyle: { backgroundColor: ColoresCivora.card, borderTopColor: ColoresCivora.border },
        tabBarLabelStyle: { fontWeight: '600' },
      }}>
      <Tabs.Screen
        name="inicio"
        options={{
          title: 'Inicio',
          tabBarIcon: icono({ ios: 'house', android: 'home', web: 'home' }),
        }}
      />
      <Tabs.Screen
        name="reportar"
        options={{
          title: 'Reportar',
          tabBarIcon: icono({ ios: 'plus', android: 'add', web: 'add' }),
        }}
        listeners={{
          // "Reportar" no es una pantalla de pestaña: abre el flujo en la pila.
          tabPress: (evento) => {
            evento.preventDefault();
            router.push('/nuevo-reporte');
          },
        }}
      />
      <Tabs.Screen
        name="mis-reportes"
        options={{
          title: 'Mis reportes',
          tabBarIcon: icono({ ios: 'doc.text', android: 'description', web: 'description' }),
        }}
      />
    </Tabs>
  );
}
