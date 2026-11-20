import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { ColoresCivora } from '@/constants/coloresCivora';

interface SelectorUbicacionReporteProps {
  ubicacion: string;
  alCambiarUbicacion: (ubicacion: string) => void;
}

export function SelectorUbicacionReporte({
  ubicacion,
  alCambiarUbicacion,
}: SelectorUbicacionReporteProps) {
  const [editando, setEditando] = useState(false);

  return (
    <View className="w-full">
      <Text className="mb-2.5 text-sm font-semibold text-civora-text">Ubicación *</Text>

      {editando ? (
        <View className="rounded-2xl border border-civora-primary bg-civora-card p-3.5">
          <TextInput
            value={ubicacion}
            onChangeText={alCambiarUbicacion}
            placeholder="Ej. Pasaje 5, Polígono C"
            placeholderTextColor={ColoresCivora.placeholder}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={() => setEditando(false)}
            className="text-sm font-medium text-civora-text outline-none"
          />
          <View className="mt-2.5 flex-row justify-end">
            <Pressable
              onPress={() => setEditando(false)}
              className="cursor-pointer rounded-xl bg-civora-primary px-3.5 py-1.5 active:bg-civora-primaryDark">
              <Text className="text-xs font-semibold text-white">Listo</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Pressable
          onPress={() => setEditando(true)}
          accessibilityRole="button"
          className="cursor-pointer flex-row items-center justify-between rounded-2xl bg-civora-surface px-4 py-4 active:opacity-85">
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
      )}
    </View>
  );
}
