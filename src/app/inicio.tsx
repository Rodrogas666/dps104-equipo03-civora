import { router } from 'expo-router';

import { CreacionDeReportes } from '@/components/reportes/CreacionDeReportes';

export default function InicioScreen() {
  return (
    <CreacionDeReportes
      alPresionarReportar={() => router.push('/nuevo-reporte')}
    />
  );
}
