import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';

import { EtiquetaEstadoReporte } from '@/components/reportes/EtiquetaEstadoReporte';
import type { ReporteVecinal } from '@/types/reportes';

interface TarjetaMiReporteProps {
  reporte: ReporteVecinal;
}

export function TarjetaMiReporte({ reporte }: TarjetaMiReporteProps) {
  return (
    <View className="overflow-hidden rounded-2xl border border-civora-border bg-civora-card">
      <View className="flex-row gap-3 p-3">
        <Image
          source={{ uri: reporte.imagenUrl }}
          contentFit="cover"
          transition={200}
          style={{ width: 100, height: 110, borderRadius: 12 }}
        />

        <View className="flex-1 justify-center gap-1">
          <EtiquetaEstadoReporte estado={reporte.estado} />

          <Text className="text-sm font-bold text-civora-text">
            {reporte.codigo}
          </Text>

          <Text
            className="text-base font-bold text-civora-text"
            numberOfLines={1}
          >
            {reporte.titulo}
          </Text>

          <Text
            className="text-xs text-civora-muted"
            numberOfLines={1}
          >
            {reporte.ubicacion}
          </Text>

          <Text className="text-xs text-civora-muted">
            {reporte.fechaHora}
          </Text>
        </View>
      </View>

      {reporte.descripcion ? (
        <View className="px-3 pb-3">
          <Text className="text-sm text-civora-muted" numberOfLines={2}>
            {reporte.descripcion}
          </Text>
        </View>
      ) : null}

      {reporte.nota ? (
        <View className="border-t border-civora-border bg-civora-surface px-3 py-2">
          <Text className="text-xs font-semibold text-civora-text">
            Nota de seguimiento
          </Text>
          <Text className="mt-1 text-xs text-civora-muted">
            {reporte.nota}
          </Text>
        </View>
      ) : null}
    </View>
  );
}