import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { EtiquetaEstadoReporte } from '@/components/reportes/EtiquetaEstadoReporte';
import { BotonPrincipal } from '@/components/ui/BotonPrincipal';
import { ColoresCivora } from '@/constants/coloresCivora';
import {
  obtenerUltimoReporteEnviado,
  type ResumenReporteEnviado,
  suscribirUltimoReporteEnviado,
} from '@/services/estadoBorradorReporte';

export interface ConfirmacionReporteEnviadoProps {
  alVerMiReporte?: (reporte: ResumenReporteEnviado) => void;
  alVolverAlInicio?: () => void;
}

export function ConfirmacionReporteEnviado({
  alVerMiReporte,
  alVolverAlInicio,
}: ConfirmacionReporteEnviadoProps) {
  const [reporte, setReporte] = useState<ResumenReporteEnviado>(() =>
    obtenerUltimoReporteEnviado()
  );

  useEffect(() => suscribirUltimoReporteEnviado(setReporte), []);

  const manejarVolverAlInicio = () => {
    if (alVolverAlInicio) {
      alVolverAlInicio();
      return;
    }
    router.replace('/inicio');
  };

  const manejarVerReporte = () => {
    if (alVerMiReporte) {
      alVerMiReporte(reporte);
      return;
    }
    router.replace('/inicio');
  };

  return (
    <View className="flex-1 bg-civora-bg">
      <View className="border-b border-civora-border bg-civora-card px-5 py-3.5 md:px-8">
        <View className="mx-auto w-full max-w-xl flex-row items-center gap-2">
          <Pressable
            onPress={manejarVolverAlInicio}
            accessibilityRole="button"
            accessibilityLabel="Volver"
            className="h-9 w-9 cursor-pointer items-center justify-center rounded-full hover:bg-civora-surface">
            <SymbolView
              name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
              size={22}
              tintColor={ColoresCivora.text}
            />
          </Pressable>
          <Text className="text-xl font-bold text-civora-text">Confirmación</Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="mx-auto w-full max-w-xl flex-grow justify-center px-5 py-8 md:px-8"
        showsVerticalScrollIndicator={false}>
        <View className="rounded-3xl border border-civora-border bg-civora-card p-6 shadow-sm md:p-8">
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
              className="mt-5 text-center text-2xl font-bold tracking-tight text-civora-text md:text-[28px]">
              ¡Gracias por reportar!
            </Text>

            <Text className="mt-2 text-center text-sm leading-5 text-civora-muted">
              Tu reporte ya está registrado. Puedes consultar su avance en Mis reportes.
            </Text>
          </View>

          <View className="mt-7 rounded-2xl border border-civora-border bg-civora-bg p-5">
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

          <View className="mt-4 rounded-2xl bg-civora-surface p-5">
            <Text className="text-sm font-bold text-civora-text">¿Qué sigue?</Text>
            <Text className="mt-1 text-xs leading-5 text-civora-muted">
              La directiva revisará tu reporte y actualizará su estado.
            </Text>
          </View>

          <View className="mt-7 gap-3">
            <BotonPrincipal texto="Ver mi reporte" onPress={manejarVerReporte} />

            <Pressable
              onPress={manejarVolverAlInicio}
              accessibilityRole="button"
              className="cursor-pointer items-center py-2.5 hover:opacity-75">
              <Text className="text-sm font-semibold text-civora-primary">Volver al inicio</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
