import { Image } from 'expo-image';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { type ChangeEvent, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

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
  const inputArchivoRef = useRef<HTMLInputElement | null>(null);
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

  const manejarSeleccionArchivo = (evento: ChangeEvent<HTMLInputElement>) => {
    const archivo = evento.target.files?.[0];
    if (!archivo) return;
    const urlTemporal = URL.createObjectURL(archivo);
    setFotoCapturada(urlTemporal);
  };

  const manejarConfirmacion = () => {
    if (!fotoCapturada) return;
    actualizarFotoReporte(fotoCapturada);
    alConfirmarFoto?.(fotoCapturada);
    manejarVolver();
  };

  return (
    <View className="flex-1 bg-civora-cameraBg">
      {/* Input nativo oculto para cargar foto real desde el navegador */}
      <input
        ref={inputArchivoRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={manejarSeleccionArchivo}
        style={{ display: 'none' }}
      />

      {/* Encabezado superior */}
      <View className="border-b border-white/10 px-5 py-3.5 md:px-8">
        <View className="mx-auto w-full max-w-3xl flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <Pressable
              onPress={manejarVolver}
              accessibilityRole="button"
              accessibilityLabel="Volver"
              className="h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/10 hover:bg-white/20">
              <SymbolView
                name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
                size={20}
                tintColor={ColoresCivora.white}
              />
            </Pressable>
            <View>
              <Text className="text-lg font-bold text-white">Tomar fotografía</Text>
              <Text className="text-xs text-white/65">
                Captura o sube una imagen clara del problema
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-2">
            {!fotoCapturada && modoCaptura === 'camara' ? (
              <Pressable
                onPress={() => setMostrarCuadricula((prev) => !prev)}
                className={`cursor-pointer flex-row items-center gap-1.5 rounded-full border px-3.5 py-2 ${
                  mostrarCuadricula
                    ? 'border-civora-accent/60 bg-civora-accent/15'
                    : 'border-white/15 bg-white/10 hover:bg-white/15'
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
                  Guía 3×3
                </Text>
              </Pressable>
            ) : null}

            <Pressable
              onPress={() => inputArchivoRef.current?.click()}
              className="cursor-pointer flex-row items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 hover:bg-white/20">
              <SymbolView
                name={{ ios: 'square.and.arrow.up', android: 'upload', web: 'upload' }}
                size={15}
                tintColor={ColoresCivora.white}
              />
              <Text className="text-xs font-semibold text-white">Subir archivo</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="mx-auto w-full max-w-3xl flex-grow px-5 py-6 md:px-8"
        showsVerticalScrollIndicator={false}>
        {modoCaptura === 'galeria' && !fotoCapturada ? (
          <View className="gap-5">
            <Pressable
              onPress={() => inputArchivoRef.current?.click()}
              className="cursor-pointer items-center justify-center rounded-3xl border-2 border-dashed border-civora-accent/50 bg-civora-cameraSurface px-6 py-10 hover:bg-white/10">
              <View className="h-14 w-14 items-center justify-center rounded-2xl bg-civora-accent/20">
                <SymbolView
                  name={{ ios: 'photo.on.rectangle', android: 'photo_library', web: 'photo_library' }}
                  size={28}
                  tintColor={ColoresCivora.accent}
                />
              </View>
              <Text className="mt-3 text-base font-bold text-white">
                Elegir imagen desde tu dispositivo
              </Text>
              <Text className="mt-1 text-xs text-white/65">
                Formatos recomendados: JPG, PNG o WEBP
              </Text>
            </Pressable>

            <View>
              <Text className="mb-3 text-sm font-semibold text-white/85">
                O prueba con una foto de ejemplo
              </Text>
              <View className="flex-row flex-wrap gap-4">
                {FOTOS_GALERIA_EJEMPLO.map((item) => (
                  <Pressable
                    key={item.id}
                    onPress={() => setFotoCapturada(item.url)}
                    className="w-full cursor-pointer overflow-hidden rounded-2xl border border-white/15 bg-civora-cameraSurface hover:border-civora-accent sm:w-[31%]">
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
            </View>
          </View>
        ) : (
          <View className="relative h-[430px] w-full overflow-hidden rounded-3xl border border-white/15 bg-black shadow-lg md:h-[480px]">
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
              <View className="absolute left-4 top-4 flex-row items-center gap-1.5 rounded-full bg-civora-primary/95 px-3.5 py-1.5">
                <SymbolView
                  name={{ ios: 'checkmark', android: 'check', web: 'check' }}
                  size={14}
                  tintColor={ColoresCivora.accent}
                />
                <Text className="text-xs font-semibold text-white">Foto lista para adjuntar</Text>
              </View>
            ) : null}
          </View>
        )}

        {/* Controles o confirmación */}
        <View className="mt-6">
          {fotoCapturada ? (
            <View className="flex-row gap-3">
              <Pressable
                onPress={() => setFotoCapturada(null)}
                className="flex-1 cursor-pointer flex-row items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 py-4 hover:bg-white/15">
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
                className="flex-1 cursor-pointer flex-row items-center justify-center gap-2 rounded-2xl bg-civora-accent py-4 hover:bg-civora-accentDark">
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
              alCapturarFoto={() => setFotoCapturada(vistaEnVivo)}
              alVoltearCamara={() => {
                setCamaraFrontal((prev) => !prev);
                setIndiceVistaPrevia((prev) => (prev + 1) % FOTOS_GALERIA_EJEMPLO.length);
              }}
              alCambiarModoCaptura={setModoCaptura}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}
