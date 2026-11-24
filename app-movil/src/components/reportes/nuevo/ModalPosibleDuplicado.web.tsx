import { Modal, Pressable, Text, View } from 'react-native';

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
  if (!reporteSimilar) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={alCancelar}>
      <View className="flex-1 items-center justify-center bg-[#102820]/55 p-4">
        <Pressable className="absolute inset-0" onPress={alCancelar} />

        <View className="w-full max-w-md rounded-3xl border border-civora-border bg-civora-bg p-6 shadow-xl">
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
              className="w-full cursor-pointer items-center justify-center rounded-2xl border border-civora-border bg-civora-card py-4 hover:bg-civora-surface">
              <Text className="text-sm font-semibold text-civora-text">
                Es otro problema, enviar de todos modos
              </Text>
            </Pressable>

            <Pressable
              onPress={alCancelar}
              accessibilityRole="button"
              className="cursor-pointer items-center py-2 hover:opacity-75">
              <Text className="text-sm font-semibold text-civora-muted">Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
