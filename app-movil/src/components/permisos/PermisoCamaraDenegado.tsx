import { SymbolView } from 'expo-symbols';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { BotonPrincipal } from '@/components/ui/BotonPrincipal';
import { ColoresCivora } from '@/constants/coloresCivora';

export interface PermisoCamaraDenegadoProps {
  alVolver?: () => void;
  alVolverAlReporte?: () => void;
  alAbrirAjustes?: () => void;
}

const PASOS_PERMISO_CAMARA = [
  '1. Abre los ajustes de civora.',
  '2. En Permisos, habilita la cámara.',
  '3. Vuelve a la app y toma la fotografía.',
];

export function PermisoCamaraDenegado({
  alVolver,
  alVolverAlReporte,
  alAbrirAjustes,
}: PermisoCamaraDenegadoProps) {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={{ flex: 1, backgroundColor: ColoresCivora.background }}>
      <View className="flex-1">
        {/* Encabezado */}
        <View className="flex-row items-center gap-2 px-4 pb-2 pt-3">
          <Pressable
            onPress={alVolver}
            accessibilityRole="button"
            accessibilityLabel="Volver"
            className="h-10 w-10 cursor-pointer items-center justify-center rounded-full active:bg-civora-surface">
            <SymbolView
              name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
              size={22}
              tintColor={ColoresCivora.text}
            />
          </Pressable>
          <Text className="text-base font-bold text-civora-text">Acceso a la cámara</Text>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerClassName="flex-grow px-5 pb-6 pt-5"
          showsVerticalScrollIndicator={false}>
          {/* Ícono principal */}
          <View className="h-16 w-16 items-center justify-center rounded-2xl bg-civora-accent">
            <SymbolView
              name={{ ios: 'camera', android: 'photo_camera', web: 'photo_camera' }}
              size={28}
              tintColor={ColoresCivora.primary}
            />
          </View>

          {/* Título y descripción */}
          <Text
            role="heading"
            aria-level={1}
            className="mt-5 text-[28px] font-bold leading-9 tracking-tight text-civora-text">
            Tu foto hace{'\n'}la diferencia.
          </Text>

          <Text className="mt-3 text-sm leading-5 text-civora-muted">
            El acceso a la cámara está desactivado. Actívalo para adjuntar evidencia del problema.
          </Text>

          {/* Tarjeta de pasos */}
          <View className="mt-6 rounded-2xl border border-civora-border bg-civora-card p-5">
            <Text className="text-sm font-bold text-civora-text">
              Activa el permiso en tu teléfono
            </Text>

            <View className="mt-3 gap-2.5">
              {PASOS_PERMISO_CAMARA.map((paso) => (
                <Text key={paso} className="text-xs leading-5 text-civora-muted">
                  {paso}
                </Text>
              ))}
            </View>
          </View>

          {/* Aviso de privacidad */}
          <View className="mt-4 flex-row items-center gap-3 rounded-2xl bg-civora-surface px-4 py-3.5">
            <SymbolView
              name={{ ios: 'checkmark.shield', android: 'verified_user', web: 'verified_user' }}
              size={20}
              tintColor={ColoresCivora.primary}
            />
            <Text className="flex-1 text-xs font-medium leading-4 text-civora-primary">
              La cámara solo se usa cuando decides tomar una foto.
            </Text>
          </View>

          {/* Nota secundaria */}
          <View className="mt-5 flex-row items-start gap-2.5 px-1">
            <View className="mt-0.5">
              <SymbolView
                name={{ ios: 'mappin.and.ellipse', android: 'location_on', web: 'location_on' }}
                size={18}
                tintColor={ColoresCivora.primary}
              />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-bold text-civora-text">
                ¿También denegaste la ubicación?
              </Text>
              <Text className="mt-0.5 text-xs leading-4 text-civora-muted">
                Puedes confirmar la dirección del problema.
              </Text>
            </View>
          </View>

          <View className="flex-1" />

          {/* Botón secundario */}
          <Pressable
            onPress={alVolverAlReporte}
            accessibilityRole="button"
            className="mt-8 w-full cursor-pointer items-center justify-center rounded-2xl border border-civora-border bg-civora-card py-4 hover:bg-civora-bg active:bg-civora-surface">
            <Text className="text-sm font-bold text-civora-text">Volver al reporte</Text>
          </Pressable>
        </ScrollView>

        {/* Barra inferior fija */}
        <View
          className="border-t border-civora-border/60 bg-civora-card px-5 pt-3.5"
          style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
          <BotonPrincipal texto="Abrir ajustes" onPress={alAbrirAjustes} />
        </View>
      </View>
    </SafeAreaView>
  );
}
