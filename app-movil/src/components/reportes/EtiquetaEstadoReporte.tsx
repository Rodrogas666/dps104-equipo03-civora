import { Text, View } from 'react-native';

import type { EstadoReporte } from '@/types/reportes';

interface EtiquetaEstadoReporteProps {
  estado: EstadoReporte;
}

const CONFIGURACION_ESTADOS: Record<
  EstadoReporte,
  { etiqueta: string; fondoClassName: string; textoClassName: string }
> = {
  pendiente: {
    etiqueta: 'Pendiente',
    fondoClassName: 'bg-civora-pendingBg',
    textoClassName: 'text-civora-pendingText',
  },
  en_proceso: {
    etiqueta: 'En proceso',
    fondoClassName: 'bg-civora-warningBg',
    textoClassName: 'text-civora-warningText',
  },
  resuelto: {
    etiqueta: 'Resuelto',
    fondoClassName: 'bg-civora-resolvedBg',
    textoClassName: 'text-civora-resolvedText',
  },
};

export function EtiquetaEstadoReporte({ estado }: EtiquetaEstadoReporteProps) {
  const { etiqueta, fondoClassName, textoClassName } = CONFIGURACION_ESTADOS[estado];

  return (
    <View className={`self-start rounded-lg px-2.5 py-1 ${fondoClassName}`}>
      <Text className={`text-xs font-semibold ${textoClassName}`}>{etiqueta}</Text>
    </View>
  );
}
