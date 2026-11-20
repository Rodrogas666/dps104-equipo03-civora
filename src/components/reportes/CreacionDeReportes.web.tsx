import { SymbolView } from 'expo-symbols';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { BannerReportarProblema } from '@/components/reportes/BannerReportarProblema';
import { BarraNavegacionInferior } from '@/components/reportes/BarraNavegacionInferior';
import { FiltrosReportesResidencial } from '@/components/reportes/FiltrosReportesResidencial';
import { TarjetaResumenReporte } from '@/components/reportes/TarjetaResumenReporte';
import { ColoresCivora } from '@/constants/coloresCivora';
import { REPORTES_EJEMPLO_RESIDENCIAL } from '@/constants/reportesEjemplo';
import type {
  CategoriaReporte,
  FiltroEstadoReporte,
  PestanaInferiorCivora,
  ReporteVecinal,
} from '@/types/reportes';

export interface CreacionDeReportesProps {
  nombreResidencial?: string;
  inicialUsuario?: string;
  reportes?: ReporteVecinal[];
  alPresionarReportar?: () => void;
  alSeleccionarReporte?: (reporte: ReporteVecinal) => void;
  alPresionarPerfil?: () => void;
}

const PESTANAS_WEB: { valor: PestanaInferiorCivora; etiqueta: string }[] = [
  { valor: 'inicio', etiqueta: 'Inicio' },
  { valor: 'reportar', etiqueta: 'Reportar' },
  { valor: 'mis_reportes', etiqueta: 'Mis reportes' },
];

export function CreacionDeReportes({
  nombreResidencial = 'Residencial Las Palmas',
  inicialUsuario = 'V',
  reportes = REPORTES_EJEMPLO_RESIDENCIAL,
  alPresionarReportar,
  alSeleccionarReporte,
  alPresionarPerfil,
}: CreacionDeReportesProps) {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<CategoriaReporte | null>(
    null
  );
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<FiltroEstadoReporte>('todos');
  const [pestanaActiva, setPestanaActiva] = useState<PestanaInferiorCivora>('inicio');

  const reportesFiltrados = useMemo(() => {
    return reportes.filter((reporte) => {
      const coincideCategoria =
        !categoriaSeleccionada || reporte.categoria === categoriaSeleccionada;
      const coincideEstado =
        estadoSeleccionado === 'todos' || reporte.estado === estadoSeleccionado;
      return coincideCategoria && coincideEstado;
    });
  }, [reportes, categoriaSeleccionada, estadoSeleccionado]);

  const manejarCambioPestana = (pestana: PestanaInferiorCivora) => {
    setPestanaActiva(pestana);
    if (pestana === 'reportar') {
      alPresionarReportar?.();
    }
  };

  return (
    <View className="flex-1 bg-civora-bg">
      {/* Barra superior para escritorio */}
      <View className="border-b border-civora-border bg-civora-card px-5 py-3.5 md:px-8">
        <View className="mx-auto w-full max-w-5xl flex-row items-center justify-between">
          <View>
            <Text
              role="heading"
              aria-level={1}
              className="text-2xl font-bold tracking-tight text-civora-text">
              Civora
            </Text>
            <View className="mt-0.5 flex-row items-center gap-1">
              <SymbolView
                name={{ ios: 'mappin.and.ellipse', android: 'location_on', web: 'location_on' }}
                size={14}
                tintColor={ColoresCivora.primary}
              />
              <Text className="text-xs font-semibold text-civora-primary">
                {nombreResidencial}
              </Text>
            </View>
          </View>

          <View className="hidden flex-row items-center gap-2 md:flex">
            {PESTANAS_WEB.map((pestana) => {
              const estaActiva = pestanaActiva === pestana.valor;
              return (
                <Pressable
                  key={pestana.valor}
                  onPress={() => manejarCambioPestana(pestana.valor)}
                  className={`cursor-pointer rounded-xl px-4 py-2 ${
                    estaActiva ? 'bg-civora-surface' : 'bg-transparent hover:bg-civora-bg'
                  }`}>
                  <Text
                    className={`text-sm font-semibold ${
                      estaActiva ? 'text-civora-primary' : 'text-civora-muted'
                    }`}>
                    {pestana.etiqueta}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Pressable
            onPress={alPresionarPerfil}
            accessibilityRole="button"
            accessibilityLabel="Perfil de usuario"
            className="h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-civora-border bg-civora-bg hover:bg-civora-surface">
            <Text className="text-sm font-bold text-civora-text">{inicialUsuario}</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="mx-auto w-full max-w-5xl px-5 py-6 md:px-8 md:py-8"
        showsVerticalScrollIndicator={false}>
        <BannerReportarProblema alReportarProblema={alPresionarReportar} />

        <Text className="mb-3 mt-7 text-xl font-bold text-civora-text">
          En la residencial
        </Text>

        <FiltrosReportesResidencial
          categoriaSeleccionada={categoriaSeleccionada}
          estadoSeleccionado={estadoSeleccionado}
          alSeleccionarCategoria={setCategoriaSeleccionada}
          alSeleccionarEstado={setEstadoSeleccionado}
        />

        <View className="mt-5 flex-row flex-wrap gap-4">
          {reportesFiltrados.length > 0 ? (
            reportesFiltrados.map((reporte) => (
              <View key={reporte.id} className="w-full md:w-[48.5%]">
                <TarjetaResumenReporte
                  reporte={reporte}
                  alPresionar={alSeleccionarReporte}
                />
              </View>
            ))
          ) : (
            <View className="w-full items-center rounded-2xl border border-civora-border bg-civora-card px-6 py-10">
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

      {/* Navegación inferior en pantallas web estrechas */}
      <View className="md:hidden">
        <BarraNavegacionInferior
          pestanaActiva={pestanaActiva}
          alCambiarPestana={manejarCambioPestana}
        />
      </View>
    </View>
  );
}
