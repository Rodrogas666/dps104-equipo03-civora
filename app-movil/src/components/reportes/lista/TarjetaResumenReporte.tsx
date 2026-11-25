import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { Pressable, Text, View } from 'react-native';

import { EtiquetaEstadoReporte } from '@/components/reportes/EtiquetaEstadoReporte';
import { ColoresCivora } from '@/constants/coloresCivora';
import type { ReporteVecinal } from '@/types/reportes';

interface TarjetaResumenReporteProps {
  reporte: ReporteVecinal;
  alPresionar?: (reporte: ReporteVecinal) => void;
}

export function TarjetaResumenReporte({ reporte, alPresionar }: TarjetaResumenReporteProps) {
  return (
    <Pressable
      onPress={() => alPresionar?.(reporte)}
      className="flex-row items-center gap-3.5 rounded-2xl border border-civora-border bg-civora-card p-3.5 active:opacity-90">
      <View className="overflow-hidden rounded-xl bg-civora-surface">
        {reporte.imagenUrl ? (
          <Image
            source={{ uri: reporte.imagenUrl }}
            contentFit="cover"
            transition={200}
            style={{ width: 84, height: 84 }}
          />
        ) : (
          <View className="items-center justify-center" style={{ width: 84, height: 84 }}>
            <SymbolView
              name={{ ios: 'camera', android: 'photo_camera', web: 'photo_camera' }}
              size={28}
              tintColor={ColoresCivora.primary}
            />
          </View>
        )}
      </View>

      <View className="flex-1 justify-center">
        <EtiquetaEstadoReporte estado={reporte.estado} />

        <Text className="mt-1.5 text-base font-bold text-civora-text" numberOfLines={1}>
          {reporte.titulo}
        </Text>

        <Text className="mt-0.5 text-xs text-civora-muted" numberOfLines={1}>
          {reporte.ubicacion}
        </Text>

        <Text className="mt-0.5 text-xs text-civora-muted" numberOfLines={1}>
          {reporte.fechaHora}
        </Text>
      </View>
    </Pressable>
  );
}
