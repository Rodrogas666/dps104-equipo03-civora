/**
 * Capa de acceso a datos de reportes (fachada).
 *
 * Las pantallas solo importan este archivo. Según EXPO_PUBLIC_USAR_NUBE delega
 * en la implementación en memoria (reportesMemoria) o en Supabase (reportesNube).
 * Ninguna pantalla debe importar los datos de ejemplo directamente.
 */
import { USAR_NUBE } from '@/lib/supabase';
import * as memoria from '@/services/reportesMemoria';
import * as nube from '@/services/reportesNube';
import type {
  CategoriaReporte,
  DatosNuevoReporte,
  EstadoReporte,
  ReporteVecinal,
} from '@/types/reportes';

const implementacion = USAR_NUBE ? nube : memoria;

/** "Pasaje 5, Polígono C" -> "pasaje 5" (para comparar duplicados por pasaje). */
export function extraerPasaje(ubicacion: string): string {
  return (ubicacion.split(',')[0] ?? '').trim().toLowerCase();
}

/**
 * Posible duplicado: misma categoría, mismo pasaje y no resuelto.
 * Es una función pura para poder usarla con la lista que ya tiene la pantalla.
 */
export function buscarPosibleDuplicado(
  lista: ReporteVecinal[],
  categoria: CategoriaReporte,
  ubicacion: string
): ReporteVecinal | null {
  const pasaje = extraerPasaje(ubicacion);
  if (!pasaje) return null;
  return (
    lista.find(
      (r) =>
        r.estado !== 'resuelto' &&
        r.categoria === categoria &&
        extraerPasaje(r.ubicacion) === pasaje
    ) ?? null
  );
}

export function listarReportes(): Promise<ReporteVecinal[]> {
  return implementacion.listarReportes();
}

export function obtenerReporte(id: string): Promise<ReporteVecinal | null> {
  return implementacion.obtenerReporte(id);
}

export function crearReporte(datos: DatosNuevoReporte): Promise<ReporteVecinal> {
  return implementacion.crearReporte(datos);
}

/** Solo la directiva debería llamar a esta función (el rol se valida en la nube). */
export function actualizarEstado(
  id: string,
  estado: EstadoReporte,
  nota?: string
): Promise<ReporteVecinal> {
  return implementacion.actualizarEstado(id, estado, nota);
}
