import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { MapaIlustrativoResidencial } from '@/components/reportes/MapaIlustrativoResidencial';
import { BotonPrincipal } from '@/components/ui/BotonPrincipal';
import { ColoresCivora } from '@/constants/coloresCivora';
import {
  actualizarUbicacionBorrador,
  obtenerUbicacionBorrador,
} from '@/services/estadoBorradorReporte';

export interface UbicacionDelProblemaProps {
  nombreResidencial?: string;
  alVolver?: () => void;
  alConfirmarUbicacion?: (ubicacion: string) => void;
}

export function UbicacionDelProblema({
  nombreResidencial = 'Residencial Las Palmas',
  alVolver,
  alConfirmarUbicacion,
}: UbicacionDelProblemaProps) {
  const [direccion, setDireccion] = useState(() => obtenerUbicacionBorrador());
  const [actualizando, setActualizando] = useState(false);

  const manejarVolver = () => {
    if (alVolver) {
      alVolver();
      return;
    }
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/nuevo-reporte');
    }
  };

  const manejarActualizarUbicacion = () => {
    setActualizando(true);
    setDireccion('Pasaje 5, Polígono C');
    setTimeout(() => setActualizando(false), 450);
  };

  const manejarConfirmar = () => {
    actualizarUbicacionBorrador(direccion);
    alConfirmarUbicacion?.(direccion);
    manejarVolver();
  };

  return (
    <View className="flex-1 bg-civora-bg">
      <View className="border-b border-civora-border bg-civora-card px-5 py-3.5 md:px-8">
        <View className="mx-auto w-full max-w-2xl flex-row items-center gap-2">
          <Pressable
            onPress={manejarVolver}
            accessibilityRole="button"
            accessibilityLabel="Volver"
            className="h-9 w-9 cursor-pointer items-center justify-center rounded-full hover:bg-civora-surface">
            <SymbolView
              name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
              size={22}
              tintColor={ColoresCivora.text}
            />
          </Pressable>
          <Text className="text-xl font-bold text-civora-text">Ubicación del problema</Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="mx-auto w-full max-w-2xl px-5 py-6 md:px-8 md:py-10"
        showsVerticalScrollIndicator={false}>
        <View className="rounded-3xl border border-civora-border bg-civora-card p-6 shadow-sm md:p-8">
          <Text
            role="heading"
            aria-level={1}
            className="text-2xl font-bold tracking-tight text-civora-text md:text-[28px]">
            ¿Dónde está el problema?
          </Text>
          <Text className="mt-1 text-sm text-civora-muted">
            Confirma la dirección del problema haciendo clic en la zona correspondiente.
          </Text>

          <View className="mt-5">
            <MapaIlustrativoResidencial
              direccionActual={direccion}
              alSeleccionarDireccion={setDireccion}
              altura={290}
            />
          </View>

          <Pressable
            onPress={manejarActualizarUbicacion}
            accessibilityRole="button"
            className="mt-4 cursor-pointer flex-row items-center justify-center gap-2 rounded-2xl border border-civora-border bg-civora-bg py-3.5 hover:bg-civora-surface">
            <SymbolView
              name={{ ios: 'scope', android: 'my_location', web: 'my_location' }}
              size={18}
              tintColor={ColoresCivora.primary}
            />
            <Text className="text-sm font-semibold text-civora-primary">
              {actualizando ? 'Actualizando ubicación...' : 'Actualizar ubicación'}
            </Text>
          </Pressable>

          <View className="mt-4 flex-row items-center gap-3 rounded-2xl border border-civora-border bg-civora-bg p-4">
            <SymbolView
              name={{ ios: 'mappin.and.ellipse', android: 'location_on', web: 'location_on' }}
              size={20}
              tintColor={ColoresCivora.primary}
            />
            <View className="flex-1">
              <Text className="text-sm font-bold text-civora-text">{direccion}</Text>
              <Text className="mt-0.5 text-xs text-civora-muted">{nombreResidencial}</Text>
            </View>
          </View>

          <Text className="mt-3 text-xs text-civora-muted">
            Solo se comparte la ubicación del problema.
          </Text>

          <View className="mt-7">
            <BotonPrincipal texto="Confirmar ubicación" onPress={manejarConfirmar} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
