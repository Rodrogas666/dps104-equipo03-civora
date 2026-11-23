import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

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
  const insets = useSafeAreaInsets();
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
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={{ flex: 1, backgroundColor: ColoresCivora.background }}>
      <View className="flex-1">
        {/* Encabezado */}
        <View className="flex-row items-center gap-2 px-4 pb-2 pt-3">
          <Pressable
            onPress={manejarVolver}
            accessibilityRole="button"
            accessibilityLabel="Volver"
            className="h-10 w-10 items-center justify-center rounded-full active:bg-civora-surface">
            <SymbolView
              name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
              size={22}
              tintColor={ColoresCivora.text}
            />
          </Pressable>
          <Text className="text-xl font-bold text-civora-text">Ubicación del problema</Text>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerClassName="flex-grow px-6 pb-8 pt-3"
          showsVerticalScrollIndicator={false}>
          <Text
            role="heading"
            aria-level={1}
            className="text-[26px] font-bold tracking-tight text-civora-text">
            ¿Dónde está el problema?
          </Text>
          <Text className="mt-1 text-sm text-civora-muted">
            Confirma la dirección del problema.
          </Text>

          <View className="mt-5">
            <MapaIlustrativoResidencial
              direccionActual={direccion}
              alSeleccionarDireccion={setDireccion}
            />
          </View>

          <Pressable
            onPress={manejarActualizarUbicacion}
            accessibilityRole="button"
            className="mt-4 flex-row items-center justify-center gap-2 rounded-2xl border border-civora-border bg-civora-card py-3.5 active:bg-civora-surface">
            <SymbolView
              name={{ ios: 'scope', android: 'my_location', web: 'my_location' }}
              size={18}
              tintColor={ColoresCivora.primary}
            />
            <Text className="text-sm font-semibold text-civora-primary">
              {actualizando ? 'Actualizando ubicación...' : 'Actualizar ubicación'}
            </Text>
          </Pressable>

          <View className="mt-4 flex-row items-center gap-3 rounded-2xl border border-civora-border bg-civora-card p-4">
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
        </ScrollView>

        <View
          className="border-t border-civora-border/60 bg-civora-card px-6 pt-4"
          style={{ paddingBottom: Math.max(insets.bottom, 20) }}>
          <BotonPrincipal texto="Confirmar ubicación" onPress={manejarConfirmar} />
        </View>
      </View>
    </SafeAreaView>
  );
}
