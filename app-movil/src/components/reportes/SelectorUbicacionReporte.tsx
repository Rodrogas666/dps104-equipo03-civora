import { SymbolView } from 'expo-symbols';
import { Pressable, Text, View } from 'react-native';

import { ColoresCivora } from '@/constants/coloresCivora';

interface SelectorUbicacionReporteProps {
  ubicacion: string;
  alAbrirMapa: () => void;
}

export function SelectorUbicacionReporte({
  ubicacion,
  alAbrirMapa,
}: SelectorUbicacionReporteProps) {
  return (
    <View className="w-full">
      <Text className="mb-2.5 text-sm font-semibold text-civora-text">Ubicación *</Text>

      <Pressable
        onPress={alAbrirMapa}
        accessibilityRole="button"
        className="cursor-pointer flex-row items-center justify-between rounded-2xl bg-civora-surface px-4 py-4 hover:opacity-90 active:opacity-85">
        <View className="flex-1 flex-row items-center gap-3">
          <SymbolView
            name={{ ios: 'mappin.and.ellipse', android: 'location_on', web: 'location_on' }}
            size={20}
            tintColor={ColoresCivora.primary}
          />
          <View className="flex-1">
            <Text className="text-sm font-bold text-civora-text" numberOfLines={1}>
              {ubicacion || 'Seleccionar ubicación'}
            </Text>
            <Text className="mt-0.5 text-xs font-medium text-civora-primary">
              Ubicación detectada · Cambiar
            </Text>
          </View>
        </View>

        <SymbolView
          name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
          size={18}
          tintColor={ColoresCivora.primary}
        />
      </Pressable>
    </View>
  );
}
