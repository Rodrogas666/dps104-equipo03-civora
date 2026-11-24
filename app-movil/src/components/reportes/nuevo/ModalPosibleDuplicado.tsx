import { Modal, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TarjetaResumenReporte } from '@/components/reportes/lista/TarjetaResumenReporte';
import { BotonPrincipal } from '@/components/ui/BotonPrincipal';
import type { CategoriaReporte, ReporteVecinal } from '@/types/reportes';

export interface ModalPosibleDuplicadoProps {
  visible: boolean;
  reporteSimilar: ReporteVecinal | null;
  alVerEseReporte: (reporte: ReporteVecinal) => void;
  alEnviarDeTodosModos: () => void;
  alCancelar: () => void;
}

const NOMBRE_CATEGORIA: Record<CategoriaReporte, string> = {
  bache: 'Bache',
  basura: 'Basura',
  alumbrado: 'Alumbrado',
  otro: 'Otro',
};

export function ModalPosibleDuplicado({
  visible,
  reporteSimilar,
  alVerEseReporte,
  alEnviarDeTodosModos,
  alCancelar,
}: ModalPosibleDuplicadoProps) {
  const insets = useSafeAreaInsets();

  if (!reporteSimilar) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={alCancelar}>
      <View className="flex-1 justify-end bg-[#102820]/55">
        <Pressable className="flex-1" onPress={alCancelar} />

        <View
          className="rounded-t-[28px] bg-civora-bg px-6 pt-3"
          style={{ paddingBottom: Math.max(insets.bottom, 20) }}>
          <View className="mb-4 h-1 w-10 self-center rounded-full bg-civora-border" />

          <Text className="text-xl font-bold text-civora-text">
            Ya hay un reporte parecido.
          </Text>
          <Text className="mt-1.5 text-sm leading-5 text-civora-muted">
            Encontramos 1 reporte activo de {NOMBRE_CATEGORIA[reporteSimilar.categoria]} cerca de
            tu ubicación.
          </Text>

          <View className="mt-4">
            <TarjetaResumenReporte
              reporte={reporteSimilar}
              alPresionar={alVerEseReporte}
            />
          </View>

          <View className="mt-5 gap-3">
            <BotonPrincipal
              texto="Ver ese reporte"
              onPress={() => alVerEseReporte(reporteSimilar)}
            />

            <Pressable
              onPress={alEnviarDeTodosModos}
              accessibilityRole="button"
              className="w-full items-center justify-center rounded-2xl border border-civora-border bg-civora-card py-4 active:bg-civora-surface">
              <Text className="text-sm font-semibold text-civora-text">
                Es otro problema, enviar de todos modos
              </Text>
            </Pressable>

            <Pressable
              onPress={alCancelar}
              accessibilityRole="button"
              className="items-center py-2.5 active:opacity-70">
              <Text className="text-sm font-semibold text-civora-muted">Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
