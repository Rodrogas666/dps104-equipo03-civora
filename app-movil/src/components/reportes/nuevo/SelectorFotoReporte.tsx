import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { Pressable, Text, View } from 'react-native';

import { ColoresCivora } from '@/constants/coloresCivora';

interface SelectorFotoReporteProps {
  fotoUrl: string | null;
  alCambiarFoto?: () => void;
}

export function SelectorFotoReporte({
  fotoUrl,
  alCambiarFoto,
}: SelectorFotoReporteProps) {
  return (
    <View className="flex-row items-center gap-4">
      <Pressable
        onPress={alCambiarFoto}
        accessibilityRole="button"
        accessibilityLabel="Vista previa de la foto del problema"
        className="h-[116px] w-[116px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-civora-border bg-civora-surface active:opacity-90">
        {fotoUrl ? (
          <Image
            source={{ uri: fotoUrl }}
            contentFit="cover"
            transition={200}
            style={{ width: 116, height: 116 }}
          />
        ) : (
          <SymbolView
            name={{ ios: 'camera', android: 'photo_camera', web: 'photo_camera' }}
            size={28}
            tintColor={ColoresCivora.primary}
          />
        )}
      </Pressable>

      <View className="flex-1 justify-center gap-2">
        <Text className="text-sm font-bold text-civora-text">Foto del problema *</Text>

        <View className="self-start rounded-lg bg-civora-pendingBg px-2.5 py-1">
          <Text className="text-xs font-semibold text-civora-primary">
            {fotoUrl ? '1 foto adjunta' : 'Sin foto adjunta'}
          </Text>
        </View>

        <Pressable
          onPress={alCambiarFoto}
          accessibilityRole="button"
          className="mt-0.5 cursor-pointer flex-row items-center gap-1.5 self-start active:opacity-75">
          <SymbolView
            name={{ ios: 'camera', android: 'photo_camera', web: 'photo_camera' }}
            size={17}
            tintColor={ColoresCivora.primary}
          />
          <Text className="text-sm font-semibold text-civora-primary">
            {fotoUrl ? 'Cambiar foto' : 'Tomar o elegir foto'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
