import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useSesion } from '@/context/SesionContext';
import { USAR_NUBE } from '@/lib/supabase';
import {
  actualizarEstado,
  crearReporte,
  listarReportes,
} from '@/services/reportesService';
import type { DatosNuevoReporte, EstadoReporte, ReporteVecinal } from '@/types/reportes';

const ERROR_CARGA = 'No pudimos cargar los reportes. Revisa tu conexión e inténtalo de nuevo.';

/** Usa el mensaje en español que lanza el servicio; si no hay, uno genérico. */
function mensajeCarga(error: unknown): string {
  return error instanceof Error && error.message ? error.message : ERROR_CARGA;
}

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
  const { idUsuario } = useSesion();
  // En memoria se carga una sola vez. Con la nube se carga al haber sesión y se
  // vuelve a cargar si cambia el usuario (null = sin sesión, no hay nada que leer).
  const claveCarga = USAR_NUBE ? idUsuario : 'memoria';

  const [reportes, setReportes] = useState<ReporteVecinal[]>([]);
  const [cargando, setCargando] = useState(claveCarga !== null);
  const [error, setError] = useState<string | null>(null);
  const [ultimoCreado, setUltimoCreado] = useState<ReporteVecinal | null>(null);
  const [claveAnterior, setClaveAnterior] = useState(claveCarga);

  // Cambió el usuario: se descartan los datos del anterior antes de pintar.
  if (claveAnterior !== claveCarga) {
    setClaveAnterior(claveCarga);
    setReportes([]);
    setError(null);
    setUltimoCreado(null);
    setCargando(claveCarga !== null);
  }

  const recargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      setReportes(await listarReportes());
    } catch (e) {
      setError(mensajeCarga(e));
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    if (claveCarga === null) return;
    let cancelado = false;
    void listarReportes()
      .then((lista) => {
        if (!cancelado) setReportes(lista);
      })
      .catch((e: unknown) => {
        if (!cancelado) setError(mensajeCarga(e));
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });
    return () => {
      cancelado = true;
    };
  }, [claveCarga]);

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
