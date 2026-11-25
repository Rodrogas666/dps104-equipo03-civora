import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { BotonPrincipal } from '@/components/ui/BotonPrincipal';
import { ColoresCivora } from '@/constants/coloresCivora';
import { REPORTES_EJEMPLO_RESIDENCIAL } from '@/constants/reportesEjemplo';

const COLOR_ERROR_BG = '#FDEBE7';
const COLOR_ERROR_TEXT = '#B43C2F';

export interface ErrorEnvioReporteProps {
  tituloReporte?: string;
  ubicacionReporte?: string;
  imagenUrl?: string;
  alVolver?: () => void;
  alVolverAEditar?: () => void;
  alReintentarEnvio?: () => void;
}

export function ErrorEnvioReporte({
  tituloReporte = 'Bache · Pasaje 5',
  ubicacionReporte = 'Pasaje 5, Polígono C',
  imagenUrl = REPORTES_EJEMPLO_RESIDENCIAL[0]?.imagenUrl ?? '',
  alVolver,
  alVolverAEditar,
  alReintentarEnvio,
}: ErrorEnvioReporteProps) {
  return (
    <View className="flex-1 bg-civora-bg">
      {/* Barra superior web */}
      <View className="border-b border-civora-border bg-civora-card px-5 py-3.5 md:px-8">
        <View className="mx-auto w-full max-w-xl flex-row items-center gap-2">
          <Pressable
            onPress={alVolver}
            accessibilityRole="button"
            accessibilityLabel="Volver"
            className="h-9 w-9 cursor-pointer items-center justify-center rounded-full hover:bg-civora-surface">
            <SymbolView
              name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
              size={22}
              tintColor={ColoresCivora.text}
            />
          </Pressable>
          <Text className="text-xl font-bold text-civora-text">Enviar reporte</Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="mx-auto w-full max-w-xl flex-grow justify-center px-5 py-8 md:px-8"
        showsVerticalScrollIndicator={false}>
        <View className="rounded-3xl border border-civora-border bg-civora-card p-6 shadow-sm md:p-8">
          {/* Ícono de error de conexión */}
          <View
            className="h-16 w-16 items-center justify-center rounded-2xl"
            style={{ backgroundColor: COLOR_ERROR_BG }}>
            <SymbolView
              name={{ ios: 'wifi.slash', android: 'wifi_off', web: 'wifi_off' }}
              size={28}
              tintColor={COLOR_ERROR_TEXT}
            />
          </View>

          {/* Título y descripción */}
          <Text
            role="heading"
            aria-level={1}
            className="mt-5 text-2xl font-bold leading-8 tracking-tight text-civora-text md:text-[28px] md:leading-9">
            No se pudo{'\n'}enviar tu reporte
          </Text>

          <Text className="mt-2.5 text-sm leading-5 text-civora-muted">
            Parece que hubo un problema de conexión. Revisa tu internet y vuelve a intentarlo.
          </Text>

          {/* Tarjeta resumen del reporte pendiente */}
          <View className="mt-6 rounded-2xl border border-civora-border bg-civora-bg p-4">
            <View className="flex-row items-center gap-3.5">
              <View className="overflow-hidden rounded-xl bg-civora-surface">
                <Image
                  source={{ uri: imagenUrl }}
                  contentFit="cover"
                  transition={200}
                  style={{ width: 72, height: 72 }}
                />
              </View>

              <View className="flex-1 justify-center">
                <Text className="text-xs font-semibold" style={{ color: COLOR_ERROR_TEXT }}>
                  Error de envío
                </Text>
                <Text className="mt-0.5 text-base font-bold text-civora-text" numberOfLines={1}>
                  {tituloReporte}
                </Text>
                <Text className="mt-0.5 text-xs text-civora-muted" numberOfLines={1}>
                  {ubicacionReporte}
                </Text>
              </View>
            </View>

            <View className="my-3.5 h-px bg-civora-border/80" />

            <Text className="text-xs leading-4 text-civora-muted">
              Tu foto y los datos siguen en este formulario. No cierres la app hasta enviarlo.
            </Text>
          </View>

          {/* Recomendación antes de reintentar */}
          <View className="mt-4 rounded-2xl bg-civora-surface p-4">
            <Text className="text-xs font-bold text-civora-text">Antes de reintentar</Text>
            <Text className="mt-1 text-xs leading-5 text-civora-muted">
              Conéctate a una red Wi-Fi o activa tus datos móviles. El reporte aún no se ha
              publicado.
            </Text>
          </View>

          {/* Acciones */}
          <View className="mt-7 gap-3 sm:flex-row">
            <Pressable
              onPress={alVolverAEditar}
              accessibilityRole="button"
              className="w-full cursor-pointer items-center justify-center rounded-2xl border border-civora-border bg-civora-card py-4 hover:bg-civora-bg active:bg-civora-surface sm:flex-1">
              <Text className="text-sm font-bold text-civora-text">Volver a editar</Text>
            </Pressable>

            <View className="w-full sm:flex-1">
              <BotonPrincipal texto="Reintentar envío" onPress={alReintentarEnvio} />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
