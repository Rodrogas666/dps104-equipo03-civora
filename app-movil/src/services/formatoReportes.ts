/** Utilidades compartidas por las implementaciones en memoria y en la nube. */
import { REPORTES_EJEMPLO_RESIDENCIAL } from '@/constants/reportesEjemplo';
import type { CategoriaReporte } from '@/types/reportes';

export const FOTO_POR_DEFECTO = REPORTES_EJEMPLO_RESIDENCIAL[0]?.imagenUrl ?? '';

export const ETIQUETA_CATEGORIA: Record<CategoriaReporte, string> = {
  bache: 'Bache',
  basura: 'Basura',
  alumbrado: 'Alumbrado',
  otro: 'Otro',
};

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

/** Date -> "24 nov 2026 · 10:15" (hora local del teléfono). */
export function formatearFechaHora(fecha: Date): string {
  const hh = String(fecha.getHours()).padStart(2, '0');
  const mm = String(fecha.getMinutes()).padStart(2, '0');
  return `${fecha.getDate()} ${MESES[fecha.getMonth()]} ${fecha.getFullYear()} · ${hh}:${mm}`;
}

/** "Pasaje 5, Polígono C" -> "Bache · Pasaje 5" */
export function tituloReporte(categoria: CategoriaReporte, ubicacion: string): string {
  const parteCorta = ubicacion.split(',')[0]?.trim() || 'Residencial';
  return `${ETIQUETA_CATEGORIA[categoria]} · ${parteCorta}`;
}
