import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  ControlesCamaraReporte,
  type ModoCapturaFoto,
  type ModoFlashCamara,
} from '@/components/camara/ControlesCamaraReporte';
import { MarcoEncuadreCamara } from '@/components/camara/MarcoEncuadreCamara';
import { ColoresCivora } from '@/constants/coloresCivora';
import { REPORTES_EJEMPLO_RESIDENCIAL } from '@/constants/reportesEjemplo';
import { actualizarFotoReporte, obtenerFotoReporteActual } from '@/services/estadoFotoReporte';

export interface CamaraFotoReporteProps {
  alVolver?: () => void;
  alConfirmarFoto?: (fotoUrl: string) => void;
}

const FOTOS_GALERIA_EJEMPLO = REPORTES_EJEMPLO_RESIDENCIAL.map((item) => ({
  id: item.id,
  etiqueta: item.titulo,
  url: item.imagenUrl,
}));

const SIGUIENTE_FLASH: Record<ModoFlashCamara, ModoFlashCamara> = {
  auto: 'encendido',
  encendido: 'apagado',
  apagado: 'auto',
};

export function CamaraFotoReporte({ alVolver, alConfirmarFoto }: CamaraFotoReporteProps) {
  const insets = useSafeAreaInsets();
  const [modoFlash, setModoFlash] = useState<ModoFlashCamara>('auto');
  const [modoCaptura, setModoCaptura] = useState<ModoCapturaFoto>('camara');
  const [camaraFrontal, setCamaraFrontal] = useState(false);
  const [mostrarCuadricula, setMostrarCuadricula] = useState(true);
  const [indiceVistaPrevia, setIndiceVistaPrevia] = useState(0);
  const [fotoCapturada, setFotoCapturada] = useState<string | null>(null);

  const vistaEnVivo =
    FOTOS_GALERIA_EJEMPLO[indiceVistaPrevia]?.url ??
    obtenerFotoReporteActual() ??
    FOTOS_GALERIA_EJEMPLO[0].url;

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

  const manejarCaptura = () => {
    // TODO: Sustituir vista previa simulada por expo-camera takePictureAsync()
    setFotoCapturada(vistaEnVivo);
  };

  const manejarConfirmacion = () => {
    if (!fotoCapturada) return;
    actualizarFotoReporte(fotoCapturada);
    alConfirmarFoto?.(fotoCapturada);
    manejarVolver();
  };

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={{ flex: 1, backgroundColor: ColoresCivora.cameraBg }}>
      <StatusBar style="light" />

      <View className="flex-1">
        {/* Encabezado oscuro elegante */}
        <View className="flex-row items-center justify-between px-4 pb-3 pt-2">
          <View className="flex-row items-center gap-3">
            <Pressable
              onPress={manejarVolver}
              accessibilityRole="button"
              accessibilityLabel="Volver"
              className="h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 active:bg-white/20">
              <SymbolView
                name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
                size={20}
                tintColor={ColoresCivora.white}
              />
            </Pressable>
            <View>
              <Text className="text-lg font-bold text-white">Tomar fotografía</Text>
              <Text className="text-[11px] text-white/65">
                {fotoCapturada ? 'Vista previa lista' : 'Evidencia del reporte'}
              </Text>
            </View>
          </View>

          {!fotoCapturada && modoCaptura === 'camara' ? (
            <Pressable
              onPress={() => setMostrarCuadricula((prev) => !prev)}
              accessibilityRole="button"
              accessibilityLabel="Mostrar u ocultar cuadrícula"
              className={`flex-row items-center gap-1.5 rounded-full border px-3 py-1.5 ${
                mostrarCuadricula
                  ? 'border-civora-accent/60 bg-civora-accent/15'
                  : 'border-white/15 bg-white/10'
              }`}>
              <SymbolView
                name={{
                  ios: 'grid',
                  android: mostrarCuadricula ? 'grid_on' : 'grid_off',
                  web: mostrarCuadricula ? 'grid_on' : 'grid_off',
                }}
                size={15}
                tintColor={mostrarCuadricula ? ColoresCivora.accent : ColoresCivora.white}
              />
              <Text
                className={`text-xs font-semibold ${
                  mostrarCuadricula ? 'text-civora-accent' : 'text-white/80'
                }`}>
                Guía
              </Text>
            </Pressable>
          ) : null}
        </View>

        {/* Área principal: Visor de cámara o Galería */}
        {modoCaptura === 'galeria' && !fotoCapturada ? (
          <ScrollView
            className="flex-1 px-4 pt-2"
            contentContainerClassName="pb-6"
            showsVerticalScrollIndicator={false}>
            <Text className="mb-3 text-sm font-semibold text-white/90">
              Selecciona una foto de tu galería
            </Text>

            <View className="flex-row flex-wrap gap-3">
              {FOTOS_GALERIA_EJEMPLO.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => setFotoCapturada(item.url)}
                  className="w-[47.5%] overflow-hidden rounded-2xl border border-white/15 bg-civora-cameraSurface active:opacity-80">
                  <Image
                    source={{ uri: item.url }}
                    contentFit="cover"
                    style={{ width: '100%', height: 150 }}
                  />
                  <View className="px-3 py-2.5">
                    <Text className="text-xs font-semibold text-white" numberOfLines={1}>
                      {item.etiqueta}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        ) : (
          <View className="flex-1 px-4 pb-3">
            <View className="relative flex-1 overflow-hidden rounded-3xl border border-white/15 bg-black">
              <Image
                source={{ uri: fotoCapturada ?? vistaEnVivo }}
                contentFit="cover"
                transition={200}
                style={{ width: '100%', height: '100%' }}
              />

              <MarcoEncuadreCamara
                mostrarCuadricula={mostrarCuadricula}
                capturada={Boolean(fotoCapturada)}
              />

              {fotoCapturada ? (
                <View className="absolute left-4 top-4 flex-row items-center gap-1.5 rounded-full bg-civora-primary/95 px-3 py-1.5">
                  <SymbolView
                    name={{ ios: 'checkmark', android: 'check', web: 'check' }}
                    size={14}
                    tintColor={ColoresCivora.accent}
                  />
                  <Text className="text-xs font-semibold text-white">Foto capturada</Text>
                </View>
              ) : null}
            </View>
          </View>
        )}

        {/* Panel inferior: Confirmación o Controles de cámara */}
        <View
          className="px-5 pt-3"
          style={{ paddingBottom: Math.max(insets.bottom, 18) }}>
          {fotoCapturada ? (
            <View className="flex-row gap-3">
              <Pressable
                onPress={() => setFotoCapturada(null)}
                accessibilityRole="button"
                className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 py-4 active:bg-white/20">
                <SymbolView
                  name={{
                    ios: 'arrow.counterclockwise',
                    android: 'refresh',
                    web: 'refresh',
                  }}
                  size={18}
                  tintColor={ColoresCivora.white}
                />
                <Text className="text-base font-semibold text-white">Repetir</Text>
              </Pressable>

              <Pressable
                onPress={manejarConfirmacion}
                accessibilityRole="button"
                className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl bg-civora-accent py-4 active:bg-civora-accentDark">
                <SymbolView
                  name={{ ios: 'checkmark', android: 'check', web: 'check' }}
                  size={18}
                  tintColor={ColoresCivora.text}
                />
                <Text className="text-base font-semibold text-civora-text">
                  Usar esta foto
                </Text>
              </Pressable>
            </View>
          ) : (
            <ControlesCamaraReporte
              modoFlash={modoFlash}
              modoCaptura={modoCaptura}
              camaraFrontal={camaraFrontal}
              alCambiarFlash={() => setModoFlash((prev) => SIGUIENTE_FLASH[prev])}
              alCapturarFoto={manejarCaptura}
              alVoltearCamara={() => {
                setCamaraFrontal((prev) => !prev);
                setIndiceVistaPrevia((prev) => (prev + 1) % FOTOS_GALERIA_EJEMPLO.length);
              }}
              alCambiarModoCaptura={setModoCaptura}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
