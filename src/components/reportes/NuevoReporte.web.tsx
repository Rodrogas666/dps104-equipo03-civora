import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

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
    // TODO: Integrar selector de archivos / cámara en fase de servicios
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
          <Text className="text-xl font-bold text-civora-text">Nuevo reporte</Text>
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
                className="min-h-[112px] w-full rounded-2xl border border-civora-border bg-civora-bg px-4 py-3.5 text-base text-civora-text outline-none focus:border-civora-primary focus:bg-civora-card"
              />
            </View>
          </View>

          <View className="mt-8">
            <BotonPrincipal texto="Enviar reporte" onPress={manejarEnvio} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
