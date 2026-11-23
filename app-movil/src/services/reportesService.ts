/**
 * Capa de acceso a datos de reportes.
 *
 * Hoy trabaja con datos en memoria. El 8 de diciembre solo se reemplaza el
 * cuerpo de estas funciones por llamadas a la nube (Supabase u otra); ninguna
 * pantalla debe importar los datos de ejemplo directamente.
 */
import { REPORTES_EJEMPLO_RESIDENCIAL } from '@/constants/reportesEjemplo';
import type {
  CategoriaReporte,
  DatosNuevoReporte,
  EstadoReporte,
  ReporteVecinal,
} from '@/types/reportes';

const FOTO_POR_DEFECTO = REPORTES_EJEMPLO_RESIDENCIAL[0]?.imagenUrl ?? '';
const ETIQUETA_CATEGORIA: Record<CategoriaReporte, string> = {
  bache: 'Bache',
  basura: 'Basura',
  alumbrado: 'Alumbrado',
  otro: 'Otro',
};
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

let reportes: ReporteVecinal[] = REPORTES_EJEMPLO_RESIDENCIAL.map((r) => ({ ...r }));
let contador = 248;

const esperar = (ms = 250) => new Promise<void>((resolver) => setTimeout(resolver, ms));

function formatearFechaHora(fecha: Date): string {
  const hh = String(fecha.getHours()).padStart(2, '0');
  const mm = String(fecha.getMinutes()).padStart(2, '0');
  return `${fecha.getDate()} ${MESES[fecha.getMonth()]} ${fecha.getFullYear()} · ${hh}:${mm}`;
}

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
  const parteCorta = datos.ubicacion.split(',')[0]?.trim() || 'Residencial';
  const nuevo: ReporteVecinal = {
    id: `rep-${String(numero).padStart(3, '0')}`,
    codigo: `REPORTE #${String(numero).padStart(4, '0')}`,
    categoria: datos.categoria,
    estado: 'pendiente',
    titulo: `${ETIQUETA_CATEGORIA[datos.categoria]} · ${parteCorta}`,
    ubicacion: datos.ubicacion || 'Residencial Las Palmas',
    fechaHora: formatearFechaHora(new Date()),
    imagenUrl: datos.fotoUrl ?? FOTO_POR_DEFECTO,
    descripcion: datos.descripcion || undefined,
    esMio: true,
  };
  reportes = [nuevo, ...reportes];
  return { ...nuevo };
}

/** Solo la directiva debería llamar a esta función (el rol se valida en la nube). */
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
