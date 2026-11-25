/**
 * Implementación en memoria (datos de ejemplo). Se usa cuando
 * EXPO_PUBLIC_USAR_NUBE no es true. Los datos se reinician al recargar la app.
 */
import { REPORTES_EJEMPLO_RESIDENCIAL } from '@/constants/reportesEjemplo';
import { FOTO_POR_DEFECTO, formatearFechaHora, tituloReporte } from '@/services/formatoReportes';
import type { DatosNuevoReporte, EstadoReporte, ReporteVecinal } from '@/types/reportes';

let reportes: ReporteVecinal[] = REPORTES_EJEMPLO_RESIDENCIAL.map((r) => ({ ...r }));
let contador = 248;

const esperar = (ms = 250) => new Promise<void>((resolver) => setTimeout(resolver, ms));

export async function listarReportes(): Promise<ReporteVecinal[]> {
  await esperar();
  return reportes.map((r) => ({ ...r }));
}

export async function obtenerReporte(id: string): Promise<ReporteVecinal | null> {
  await esperar(150);
  const encontrado = reportes.find((r) => r.id === id);
  return encontrado ? { ...encontrado } : null;
}

export async function crearReporte(datos: DatosNuevoReporte): Promise<ReporteVecinal> {
  await esperar(400);
  const numero = contador++;
  const nuevo: ReporteVecinal = {
    id: `rep-${String(numero).padStart(3, '0')}`,
    codigo: `REPORTE #${String(numero).padStart(4, '0')}`,
    categoria: datos.categoria,
    estado: 'pendiente',
    titulo: tituloReporte(datos.categoria, datos.ubicacion),
    ubicacion: datos.ubicacion || 'Residencial Las Palmas',
    fechaHora: formatearFechaHora(new Date()),
    imagenUrl: datos.fotoUrl ?? FOTO_POR_DEFECTO,
    descripcion: datos.descripcion || undefined,
    esMio: true,
  };
  reportes = [nuevo, ...reportes];
  return { ...nuevo };
}

export async function actualizarEstado(
  id: string,
  estado: EstadoReporte,
  nota?: string
): Promise<ReporteVecinal> {
  await esperar(300);
  const indice = reportes.findIndex((r) => r.id === id);
  if (indice === -1) throw new Error('El reporte ya no existe.');
  const actualizado: ReporteVecinal = {
    ...reportes[indice],
    estado,
    nota: nota?.trim() || undefined,
  };
  reportes = reportes.map((r, i) => (i === indice ? actualizado : r));
  return { ...actualizado };
}
