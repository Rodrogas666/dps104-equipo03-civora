/**
 * Implementación en la nube (Supabase). Se usa cuando EXPO_PUBLIC_USAR_NUBE=true.
 */
import type { DatosNuevoReporte, EstadoReporte, ReporteVecinal } from '@/types/reportes';

const noImplementado = (): never => {
  throw new Error('Función de la nube aún no implementada.');
};

export async function listarReportes(): Promise<ReporteVecinal[]> {
  return noImplementado();
}

export async function obtenerReporte(_id: string): Promise<ReporteVecinal | null> {
  return noImplementado();
}

export async function crearReporte(_datos: DatosNuevoReporte): Promise<ReporteVecinal> {
  return noImplementado();
}

export async function actualizarEstado(
  _id: string,
  _estado: EstadoReporte,
  _nota?: string
): Promise<ReporteVecinal> {
  return noImplementado();
}
