import { router } from 'expo-router';

import { CreacionDeReportes } from '@/components/reportes/lista/CreacionDeReportes';
import { useReportes } from '@/context/ReportesContext';
import { useSesion } from '@/context/SesionContext';

export default function InicioScreen() {
  const { reportes, cargando, error, recargar } = useReportes();
  const { nombre, residencial } = useSesion();
  const inicialUsuario = nombre.trim().charAt(0).toUpperCase() || 'A';

  return (
    <CreacionDeReportes
      nombreResidencial={residencial}
      inicialUsuario={inicialUsuario}
      reportes={reportes}
      cargando={cargando}
      error={error}
      alReintentar={() => void recargar()}
      alPresionarReportar={() => router.push('/nuevo-reporte')}
      alPresionarPerfil={() => router.push('/perfil')}
      alSeleccionarReporte={(reporte) =>
        router.push({ pathname: '/reporte/[id]', params: { id: reporte.id } })
      }
    />
  );
}
