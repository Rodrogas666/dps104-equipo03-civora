import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Pressable, Text, View } from 'react-native';

import { ColoresCivora } from '@/constants/coloresCivora';

export type ModoFlashCamara = 'auto' | 'encendido' | 'apagado';
export type ModoCapturaFoto = 'camara' | 'galeria';

interface ControlesCamaraReporteProps {
  modoFlash: ModoFlashCamara;
  modoCaptura: ModoCapturaFoto;
  camaraFrontal: boolean;
  alCambiarFlash: () => void;
  alCapturarFoto: () => void;
  alVoltearCamara: () => void;
  alCambiarModoCaptura: (modo: ModoCapturaFoto) => void;
}

const ICONOS_FLASH: Record<ModoFlashCamara, SymbolViewProps['name']> = {
  auto: { ios: 'bolt.badge.automatic', android: 'flash_auto', web: 'flash_auto' },
  encendido: { ios: 'bolt.fill', android: 'flash_on', web: 'flash_on' },
  apagado: { ios: 'bolt.slash', android: 'flash_off', web: 'flash_off' },
};

const ETIQUETAS_FLASH: Record<ModoFlashCamara, string> = {
  auto: 'Auto',
  encendido: 'Flash',
  apagado: 'Sin flash',
};

export function ControlesCamaraReporte({
  modoFlash,
  modoCaptura,
  camaraFrontal,
  alCambiarFlash,
  alCapturarFoto,
  alVoltearCamara,
  alCambiarModoCaptura,
}: ControlesCamaraReporteProps) {
  const flashActivo = modoFlash === 'encendido';

  return (
    <View className="w-full gap-5">
      {/* Fila principal: Flash - Disparador - Cambiar cámara */}
      <View className="flex-row items-center justify-around px-4">
        <Pressable
          onPress={alCambiarFlash}
          accessibilityRole="button"
          accessibilityLabel={`Flash: ${ETIQUETAS_FLASH[modoFlash]}`}
          className="cursor-pointer items-center gap-1.5 active:opacity-75">
          <View
            className={`h-12 w-12 items-center justify-center rounded-full border ${
              flashActivo
                ? 'border-civora-accent bg-civora-accent/20'
                : 'border-white/15 bg-white/10'
            }`}>
            <SymbolView
              name={ICONOS_FLASH[modoFlash]}
              size={20}
              tintColor={flashActivo ? ColoresCivora.accent : ColoresCivora.white}
            />
          </View>
          <Text className="text-[11px] font-medium text-white/75">
            {ETIQUETAS_FLASH[modoFlash]}
          </Text>
        </Pressable>

        {/* Botón disparador principal */}
        <Pressable
          onPress={alCapturarFoto}
          accessibilityRole="button"
          accessibilityLabel="Tomar fotografía"
          className="h-[78px] w-[78px] cursor-pointer items-center justify-center rounded-full border-[4px] border-white/95 p-1.5 active:scale-95">
          <View className="h-full w-full items-center justify-center rounded-full bg-white active:bg-civora-accent" />
        </Pressable>

        <Pressable
          onPress={alVoltearCamara}
          accessibilityRole="button"
          accessibilityLabel="Cambiar cámara"
          className="cursor-pointer items-center gap-1.5 active:opacity-75">
          <View
            className={`h-12 w-12 items-center justify-center rounded-full border ${
              camaraFrontal
                ? 'border-civora-accent bg-civora-accent/20'
                : 'border-white/15 bg-white/10'
            }`}>
            <SymbolView
              name={{
                ios: 'arrow.triangle.2.circlepath.camera',
                android: 'cameraswitch',
                web: 'cameraswitch',
              }}
              size={20}
              tintColor={camaraFrontal ? ColoresCivora.accent : ColoresCivora.white}
            />
          </View>
          <Text className="text-[11px] font-medium text-white/75">
            {camaraFrontal ? 'Frontal' : 'Trasera'}
          </Text>
        </Pressable>
      </View>

      {/* Selector inferior Cámara / Galería */}
      <View className="self-center rounded-full border border-white/10 bg-civora-cameraSurface p-1">
        <View className="flex-row items-center gap-1">
          <Pressable
            onPress={() => alCambiarModoCaptura('camara')}
            className={`cursor-pointer rounded-full px-5 py-2 ${
              modoCaptura === 'camara' ? 'bg-civora-accent' : 'bg-transparent'
            }`}>
            <Text
              className={`text-xs font-bold tracking-wider ${
                modoCaptura === 'camara' ? 'text-civora-text' : 'text-white/70'
              }`}>
              CÁMARA
            </Text>
          </Pressable>

          <Pressable
            onPress={() => alCambiarModoCaptura('galeria')}
            className={`cursor-pointer rounded-full px-5 py-2 ${
              modoCaptura === 'galeria' ? 'bg-civora-accent' : 'bg-transparent'
            }`}>
            <Text
              className={`text-xs font-bold tracking-wider ${
                modoCaptura === 'galeria' ? 'text-civora-text' : 'text-white/70'
              }`}>
              GALERÍA
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
