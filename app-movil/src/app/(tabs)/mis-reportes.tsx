
import { useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FiltrosReportes, type FiltroMisReportes } from '@/components/reportes/lista/FiltrosReportes';
import { ListaMisReportes } from '@/components/reportes/lista/ListaMisReportes';
import { ResumenReportes } from '@/components/reportes/lista/ResumenReportes';
import { BotonPrincipal } from '@/components/ui/BotonPrincipal';
import { ColoresCivora } from '@/constants/coloresCivora';
import { useReportes } from '@/context/ReportesContext';

export default function MisReportesScreen() {
  const { reportes, cargando, error, recargar } = useReportes();

  const [filtroActual, setFiltroActual] = useState<FiltroMisReportes>('todos');

  const mios = useMemo(
    () => reportes.filter((reporte) => reporte.esMio === true),
    [reportes]
  );

  const activos = useMemo(
    () => mios.filter(
      (reporte) =>
        reporte.estado === 'pendiente' ||
        reporte.estado === 'en_proceso'
    ),
    [mios]
  );

  const resueltos = useMemo(
    () => mios.filter((reporte) => reporte.estado === 'resuelto'),
    [mios]
  );

  const reportesFiltrados = useMemo(() => {
    switch (filtroActual) {
      case 'activos':
        return activos;
      case 'resueltos':
        return resueltos;
      default:
        return mios;
    }
  }, [filtroActual, mios, activos, resueltos]);

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={{ flex: 1, backgroundColor: ColoresCivora.background }}
    >
      <ScrollView
        contentContainerClassName="px-5 pb-8 pt-3"
        showsVerticalScrollIndicator={false}
      >
        <Text
          role="heading"
          aria-level={1}
          className="text-[28px] font-bold text-civora-text"
        >
          Mis reportes
        </Text>

        <Text className="mt-1 text-sm text-civora-muted">
          Tu voz genera cambios
        </Text>

        {cargando ? (
          <View className="items-center py-10">
            <ActivityIndicator color={ColoresCivora.primary} size="large" />
            <Text className="mt-3 text-sm text-civora-muted">
              Cargando tus reportes...
            </Text>
          </View>
        ) : error ? (
          <View className="mt-6 gap-3 rounded-2xl border border-civora-border bg-civora-card p-5">
            <Text className="text-sm text-civora-text">{error}</Text>
            <BotonPrincipal
              texto="Reintentar"
              onPress={() => void recargar()}
            />
          </View>
        ) : (
          <>
            <ResumenReportes
              reportados={mios.length}
              activos={activos.length}
              resueltos={resueltos.length}
            />

            <FiltrosReportes
              filtroActual={filtroActual}
              alCambiarFiltro={setFiltroActual}
              cantidades={{
                todos: mios.length,
                activos: activos.length,
                resueltos: resueltos.length,
              }}
            />

            <ListaMisReportes reportes={reportesFiltrados} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
