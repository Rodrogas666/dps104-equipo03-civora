import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  actualizarEstado,
  crearReporte,
  listarReportes,
} from '@/services/reportesService';
import type { DatosNuevoReporte, EstadoReporte, ReporteVecinal } from '@/types/reportes';

interface ReportesContextValor {
  reportes: ReporteVecinal[];
  cargando: boolean;
  /** Mensaje de error visible para el usuario (null si todo va bien). */
  error: string | null;
  /** Último reporte creado en la sesión (para la pantalla de confirmación). */
  ultimoCreado: ReporteVecinal | null;
  recargar: () => Promise<void>;
  crear: (datos: DatosNuevoReporte) => Promise<ReporteVecinal>;
  cambiarEstado: (id: string, estado: EstadoReporte, nota?: string) => Promise<void>;
}

const ReportesContext = createContext<ReportesContextValor | null>(null);

export function ReportesProvider({ children }: { children: ReactNode }) {
  const [reportes, setReportes] = useState<ReporteVecinal[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ultimoCreado, setUltimoCreado] = useState<ReporteVecinal | null>(null);

  const recargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      setReportes(await listarReportes());
    } catch {
      setError('No pudimos cargar los reportes. Revisa tu conexión e inténtalo de nuevo.');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void recargar();
  }, [recargar]);

  const crear = useCallback(async (datos: DatosNuevoReporte) => {
    const nuevo = await crearReporte(datos);
    setReportes((actuales) => [nuevo, ...actuales]);
    setUltimoCreado(nuevo);
    return nuevo;
  }, []);

  const cambiarEstado = useCallback(
    async (id: string, estado: EstadoReporte, nota?: string) => {
      const actualizado = await actualizarEstado(id, estado, nota);
      setReportes((actuales) => actuales.map((r) => (r.id === id ? actualizado : r)));
    },
    []
  );

  const valor = useMemo(
    () => ({ reportes, cargando, error, ultimoCreado, recargar, crear, cambiarEstado }),
    [reportes, cargando, error, ultimoCreado, recargar, crear, cambiarEstado]
  );

  return <ReportesContext.Provider value={valor}>{children}</ReportesContext.Provider>;
}

export function useReportes(): ReportesContextValor {
  const contexto = useContext(ReportesContext);
  if (!contexto) throw new Error('useReportes debe usarse dentro de <ReportesProvider>.');
  return contexto;
}
