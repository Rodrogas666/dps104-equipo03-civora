import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useEffect } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { EtiquetaEstadoReporte } from '@/components/reportes/EtiquetaEstadoReporte';
import { BotonPrincipal } from '@/components/ui/BotonPrincipal';
import { ColoresCivora } from '@/constants/coloresCivora';
import { useReportes } from '@/context/ReportesContext';
import type { ReporteVecinal } from '@/types/reportes';

export interface ConfirmacionReporteEnviadoProps {
  alVerMiReporte?: (reporte: ReporteVecinal) => void;
  alVolverAlInicio?: () => void;
}

export function ConfirmacionReporteEnviado({
  alVerMiReporte,
  alVolverAlInicio,
}: ConfirmacionReporteEnviadoProps) {
  const insets = useSafeAreaInsets();
  const { ultimoCreado: reporte } = useReportes();

  // Si se abre esta pantalla sin haber enviado un reporte, vuelve al inicio.
  useEffect(() => {
    if (!reporte) router.replace('/inicio');
  }, [reporte]);

  const manejarVolverAlInicio = () => {
    if (alVolverAlInicio) {
      alVolverAlInicio();
      return;
    }
    router.replace('/inicio');
  };

  const manejarVerReporte = () => {
    if (!reporte) return;
    if (alVerMiReporte) {
      alVerMiReporte(reporte);
      return;
    }
    router.replace('/inicio');
  };

  if (!reporte) return null;

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={{ flex: 1, backgroundColor: ColoresCivora.background }}>
      <View className="flex-1">
        {/* Barra superior */}
        <View className="flex-row items-center gap-2 px-4 pb-2 pt-3">
          <Pressable
            onPress={manejarVolverAlInicio}
            accessibilityRole="button"
            accessibilityLabel="Volver"
            className="h-10 w-10 items-center justify-center rounded-full active:bg-civora-surface">
            <SymbolView
              name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
              size={22}
              tintColor={ColoresCivora.text}
            />
          </Pressable>
          <Text className="text-xl font-bold text-civora-text">Confirmación</Text>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerClassName="flex-grow px-6 pb-8 pt-6"
          showsVerticalScrollIndicator={false}>
          <View className="items-center">
            <View className="h-20 w-20 items-center justify-center rounded-full bg-civora-accent">
              <SymbolView
                name={{ ios: 'checkmark', android: 'check', web: 'check' }}
                size={34}
                tintColor={ColoresCivora.primary}
              />
            </View>

            <Text
              role="heading"
              aria-level={1}
              className="mt-5 text-center text-[26px] font-bold tracking-tight text-civora-text">
              ¡Gracias por reportar!
            </Text>

            <Text className="mt-2 text-center text-sm leading-5 text-civora-muted">
              Tu reporte ya está registrado.{'\n'}Puedes consultar su avance en Mis reportes.
            </Text>
          </View>

          {/* Tarjeta resumen del reporte registrado */}
          <View className="mt-7 rounded-2xl border border-civora-border bg-civora-card p-5">
            <View className="flex-row items-center justify-between">
              <Text className="text-xs font-bold uppercase tracking-wider text-civora-text">
                {reporte.codigo}
              </Text>
              <EtiquetaEstadoReporte estado={reporte.estado} />
            </View>

            <Text className="mt-3 text-lg font-bold text-civora-text">{reporte.titulo}</Text>
            <Text className="mt-1 text-xs text-civora-muted">{reporte.ubicacion}</Text>
            <Text className="mt-1 text-xs text-civora-muted">{reporte.fechaHora}</Text>
          </View>

          {/* Tarjeta informativa ¿Qué sigue? */}
          <View className="mt-4 rounded-2xl bg-civora-surface p-5">
            <Text className="text-sm font-bold text-civora-text">¿Qué sigue?</Text>
            <Text className="mt-1 text-xs leading-5 text-civora-muted">
              La directiva revisará tu reporte y actualizará su estado.
            </Text>
          </View>

          <Pressable
            onPress={manejarVolverAlInicio}
            accessibilityRole="button"
            className="mt-6 items-center py-2.5 active:opacity-75">
            <Text className="text-sm font-semibold text-civora-primary">Volver al inicio</Text>
          </Pressable>
        </ScrollView>

        <View
          className="border-t border-civora-border/60 bg-civora-card px-6 pt-4"
          style={{ paddingBottom: Math.max(insets.bottom, 20) }}>
          <BotonPrincipal texto="Ver mi reporte" onPress={manejarVerReporte} />
        </View>
      </View>
    </SafeAreaView>
  );
}
