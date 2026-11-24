import { Text, View } from 'react-native';

import { TarjetaMiReporte } from '@/components/reportes/lista/TarjetaMiReporte';
import type { ReporteVecinal } from '@/types/reportes';

interface ListaMisReportesProps {
  reportes: ReporteVecinal[];
}

export function ListaMisReportes({ reportes }: ListaMisReportesProps) {
  if (reportes.length === 0) {
    return (
      <View className="mt-6 items-center rounded-2xl border border-civora-border bg-civora-card p-6">
        <Text className="text-base font-bold text-civora-text">
          No hay reportes para mostrar
        </Text>

        <Text className="mt-2 text-center text-sm text-civora-muted">
          Cuando tengas incidencias en esta categoría, aparecerán aquí.
        </Text>
      </View>
    );
  }

  return (
    <View className="mt-4 gap-3.5">
      {reportes.map((reporte) => (
        <TarjetaMiReporte key={reporte.id} reporte={reporte} />
      ))}
    </View>
  );
}
