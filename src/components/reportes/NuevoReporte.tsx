import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { SelectorCategoriaNuevoReporte } from '@/components/reportes/SelectorCategoriaNuevoReporte';
import { SelectorFotoReporte } from '@/components/reportes/SelectorFotoReporte';
import { SelectorUbicacionReporte } from '@/components/reportes/SelectorUbicacionReporte';
import { BotonPrincipal } from '@/components/ui/BotonPrincipal';
import { ColoresCivora } from '@/constants/coloresCivora';
import { REPORTES_EJEMPLO_RESIDENCIAL } from '@/constants/reportesEjemplo';
import type { CategoriaReporte, DatosNuevoReporte } from '@/types/reportes';

export interface NuevoReporteProps {
  alVolver?: () => void;
  alEnviarReporte?: (datos: DatosNuevoReporte) => void;
}

const FOTO_INICIAL = REPORTES_EJEMPLO_RESIDENCIAL[0]?.imagenUrl ?? null;

export function NuevoReporte({ alVolver, alEnviarReporte }: NuevoReporteProps) {
  const insets = useSafeAreaInsets();
  const [fotoUrl] = useState<string | null>(FOTO_INICIAL);
  const [categoria, setCategoria] = useState<CategoriaReporte>('bache');
  const [ubicacion, setUbicacion] = useState('Pasaje 5, Polígono C');
  const [descripcion, setDescripcion] = useState('');

  const manejarVolver = () => {
    if (alVolver) {
      alVolver();
      return;
    }
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/inicio');
    }
  };

  const manejarCambiarFoto = () => {
    // TODO: Integrar expo-image-picker / cámara en fase de servicios
  };

  const manejarEnvio = () => {
    alEnviarReporte?.({
      fotoUrl,
      categoria,
      ubicacion: ubicacion.trim(),
      descripcion: descripcion.trim(),
    });
    manejarVolver();
  };

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={{ flex: 1, backgroundColor: ColoresCivora.background }}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View className="flex-1">
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
            <Text className="text-xl font-bold text-civora-text">Nuevo reporte</Text>
          </View>

          <ScrollView
            className="flex-1"
            contentContainerClassName="flex-grow px-6 pb-8 pt-3"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <Text
              role="heading"
              aria-level={1}
              className="text-[26px] font-bold tracking-tight text-civora-text">
              Cuéntanos qué sucede
            </Text>
            <Text className="mt-1 text-sm text-civora-muted">
              Toma menos de dos minutos.
            </Text>

            <View className="mt-6 gap-6">
              <SelectorFotoReporte
                fotoUrl={fotoUrl}
                alCambiarFoto={manejarCambiarFoto}
              />

              <SelectorCategoriaNuevoReporte
                categoriaSeleccionada={categoria}
                alSeleccionarCategoria={setCategoria}
              />

              <SelectorUbicacionReporte
                ubicacion={ubicacion}
                alCambiarUbicacion={setUbicacion}
              />

              <View className="w-full">
                <Text className="mb-2 text-sm font-semibold text-civora-text">
                  Descripción (opcional)
                </Text>
                <TextInput
                  value={descripcion}
                  onChangeText={setDescripcion}
                  placeholder="Cuéntanos más (opcional)"
                  placeholderTextColor={ColoresCivora.placeholder}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  className="min-h-[104px] w-full rounded-2xl border border-civora-border bg-civora-card px-4 py-3.5 text-base text-civora-text outline-none focus:border-civora-primary"
                />
              </View>
            </View>
          </ScrollView>

          <View
            className="border-t border-civora-border/60 bg-civora-card px-6 pt-4"
            style={{ paddingBottom: Math.max(insets.bottom, 20) }}>
            <BotonPrincipal texto="Enviar reporte" onPress={manejarEnvio} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
