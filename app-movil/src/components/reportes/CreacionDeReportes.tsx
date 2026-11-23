import { SymbolView } from 'expo-symbols';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BannerReportarProblema } from '@/components/reportes/BannerReportarProblema';
import { FiltrosReportesResidencial } from '@/components/reportes/FiltrosReportesResidencial';
import { TarjetaResumenReporte } from '@/components/reportes/TarjetaResumenReporte';
import { BotonPrincipal } from '@/components/ui/BotonPrincipal';
import { ColoresCivora } from '@/constants/coloresCivora';
import type {
  CategoriaReporte,
  FiltroEstadoReporte,
  ReporteVecinal,
} from '@/types/reportes';

export interface CreacionDeReportesProps {
  nombreResidencial?: string;
  inicialUsuario?: string;
  reportes?: ReporteVecinal[];
  cargando?: boolean;
  error?: string | null;
  alReintentar?: () => void;
  alPresionarReportar?: () => void;
  alSeleccionarReporte?: (reporte: ReporteVecinal) => void;
  alPresionarPerfil?: () => void;
}

export function CreacionDeReportes({
  nombreResidencial = 'Residencial Las Palmas',
  inicialUsuario = 'V',
  reportes = [],
  cargando = false,
  error = null,
  alReintentar,
  alPresionarReportar,
  alSeleccionarReporte,
  alPresionarPerfil,
}: CreacionDeReportesProps) {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<CategoriaReporte | null>(
    null
  );
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<FiltroEstadoReporte>('todos');

  const reportesFiltrados = useMemo(() => {
    return reportes.filter((reporte) => {
      const coincideCategoria =
        !categoriaSeleccionada || reporte.categoria === categoriaSeleccionada;
      const coincideEstado =
        estadoSeleccionado === 'todos' || reporte.estado === estadoSeleccionado;
      return coincideCategoria && coincideEstado;
    });
  }, [reportes, categoriaSeleccionada, estadoSeleccionado]);

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={{ flex: 1, backgroundColor: ColoresCivora.background }}>
      <View className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-5 pb-6 pt-3"
          showsVerticalScrollIndicator={false}>
          <View className="flex-row items-center justify-between">
            <Text
              role="heading"
              aria-level={1}
              className="text-[28px] font-bold tracking-tight text-civora-text">
              Civora
            </Text>

            <Pressable
              onPress={alPresionarPerfil}
              accessibilityRole="button"
              accessibilityLabel="Perfil de usuario"
              className="h-11 w-11 items-center justify-center rounded-full border border-civora-border bg-civora-card active:opacity-80">
              <Text className="text-sm font-bold text-civora-text">{inicialUsuario}</Text>
            </Pressable>
          </View>

          <View className="mt-3 flex-row items-center gap-1.5">
            <SymbolView
              name={{ ios: 'mappin.and.ellipse', android: 'location_on', web: 'location_on' }}
              size={16}
              tintColor={ColoresCivora.primary}
            />
            <Text className="text-sm font-semibold text-civora-primary">
              {nombreResidencial}
            </Text>
          </View>

          <View className="mt-4">
            <BannerReportarProblema alReportarProblema={alPresionarReportar} />
          </View>

          <Text className="mb-3 mt-6 text-xl font-bold text-civora-text">
            En la residencial
          </Text>

          <FiltrosReportesResidencial
            categoriaSeleccionada={categoriaSeleccionada}
            estadoSeleccionado={estadoSeleccionado}
            alSeleccionarCategoria={setCategoriaSeleccionada}
            alSeleccionarEstado={setEstadoSeleccionado}
          />

          <View className="mt-4 gap-3.5">
            {cargando ? (
              <View className="items-center py-10">
                <ActivityIndicator color={ColoresCivora.primary} />
                <Text className="mt-3 text-xs text-civora-muted">Cargando reportes…</Text>
              </View>
            ) : error ? (
              <View className="gap-3 rounded-2xl border border-civora-border bg-civora-card px-6 py-6">
                <Text className="text-sm text-civora-text">{error}</Text>
                {alReintentar ? <BotonPrincipal texto="Reintentar" onPress={alReintentar} /> : null}
              </View>
            ) : reportesFiltrados.length > 0 ? (
              reportesFiltrados.map((reporte) => (
                <TarjetaResumenReporte
                  key={reporte.id}
                  reporte={reporte}
                  alPresionar={alSeleccionarReporte}
                />
              ))
            ) : (
              <View className="items-center rounded-2xl border border-civora-border bg-civora-card px-6 py-8">
                <Text className="text-sm font-semibold text-civora-text">
                  No hay reportes con estos filtros
                </Text>
                <Text className="mt-1 text-center text-xs text-civora-muted">
                  Prueba cambiando la categoría o el estado seleccionado.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
