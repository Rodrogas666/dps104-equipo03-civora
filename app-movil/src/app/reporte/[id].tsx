import { useLocalSearchParams } from 'expo-router';

import { DetalleReporte } from '@/components/reportes/DetalleReporte';

export default function DetalleReporteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <DetalleReporte id={String(id)} />;
}
