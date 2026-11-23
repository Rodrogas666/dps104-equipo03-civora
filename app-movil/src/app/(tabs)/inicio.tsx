import { router } from 'expo-router';

import { CreacionDeReportes } from '@/components/reportes/CreacionDeReportes';
import { useReportes } from '@/context/ReportesContext';

export default function InicioScreen() {
  const { reportes, cargando, error, recargar } = useReportes();

  return (
    <CreacionDeReportes
      reportes={reportes}
      cargando={cargando}
      error={error}
      alReintentar={() => void recargar()}
      alPresionarReportar={() => router.push('/nuevo-reporte')}
    />
  );
}
