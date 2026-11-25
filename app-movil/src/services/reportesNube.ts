/**
 * Implementación en la nube (Supabase). Se usa cuando EXPO_PUBLIC_USAR_NUBE=true.
 * Todas las funciones lanzan Error con un mensaje en español si algo falla.
 */
import { obtenerSupabase } from '@/lib/supabase';
import { errorEnEspanol } from '@/services/errores';
import { FOTO_POR_DEFECTO, formatearFechaHora } from '@/services/formatoReportes';
import type {
  CategoriaReporte,
  DatosNuevoReporte,
  EstadoReporte,
  ReporteVecinal,
} from '@/types/reportes';

const COLUMNAS_REPORTE =
  'id, numero, autor_id, categoria, estado, titulo, descripcion, ubicacion_texto, ' +
  'latitud, longitud, foto_url, nota, creado_en, historial_estados(estado, creado_en, nota)';

interface FilaHistorial {
  estado: EstadoReporte;
  creado_en: string;
  nota: string | null;
}

interface FilaReporte {
  id: string;
  numero: number;
  autor_id: string;
  categoria: CategoriaReporte;
  estado: EstadoReporte;
  titulo: string;
  descripcion: string | null;
  ubicacion_texto: string;
  latitud: number | null;
  longitud: number | null;
  foto_url: string | null;
  nota: string | null;
  creado_en: string;
  historial_estados?: FilaHistorial[] | null;
}

/** Id del usuario con sesión (lo lee del almacenamiento local, sin ir a la red). */
async function idUsuarioActual(): Promise<string | null> {
  const { data } = await obtenerSupabase().auth.getSession();
  return data.session?.user.id ?? null;
}

function aReporteVecinal(fila: FilaReporte, idUsuario: string | null): ReporteVecinal {
  const historial = (fila.historial_estados ?? [])
    .map((h) => ({ estado: h.estado, creadoEn: h.creado_en, nota: h.nota ?? undefined }))
    .sort((a, b) => a.creadoEn.localeCompare(b.creadoEn));

  return {
    id: fila.id,
    codigo: `REPORTE #${String(fila.numero).padStart(4, '0')}`,
    categoria: fila.categoria,
    estado: fila.estado,
    titulo: fila.titulo,
    ubicacion: fila.ubicacion_texto,
    fechaHora: formatearFechaHora(new Date(fila.creado_en)),
    imagenUrl: fila.foto_url || FOTO_POR_DEFECTO,
    descripcion: fila.descripcion || undefined,
    nota: fila.nota || undefined,
    esMio: idUsuario !== null && fila.autor_id === idUsuario,
    latitud: fila.latitud ?? undefined,
    longitud: fila.longitud ?? undefined,
    creadoEn: fila.creado_en,
    historial,
  };
}

/** Ejecuta la función y convierte cualquier excepción inesperada en un error en español. */
async function conErroresEnEspanol<T>(accion: () => Promise<T>): Promise<T> {
  try {
    return await accion();
  } catch (error) {
    if (error instanceof ErrorServicio) throw error;
    throw errorEnEspanol(error);
  }
}

/** Error ya traducido: se deja pasar tal cual. */
class ErrorServicio extends Error {}

function fallar(error: unknown, status?: number): never {
  throw new ErrorServicio(errorEnEspanol(error, status).message);
}

export function listarReportes(): Promise<ReporteVecinal[]> {
  return conErroresEnEspanol(async () => {
    const [idUsuario, respuesta] = await Promise.all([
      idUsuarioActual(),
      obtenerSupabase()
        .from('reportes')
        .select(COLUMNAS_REPORTE)
        .order('creado_en', { ascending: false })
        .returns<FilaReporte[]>(),
    ]);
    if (respuesta.error) fallar(respuesta.error, respuesta.status);
    return (respuesta.data ?? []).map((fila) => aReporteVecinal(fila, idUsuario));
  });
}

export function obtenerReporte(id: string): Promise<ReporteVecinal | null> {
  return conErroresEnEspanol(async () => {
    const [idUsuario, respuesta] = await Promise.all([
      idUsuarioActual(),
      obtenerSupabase()
        .from('reportes')
        .select(COLUMNAS_REPORTE)
        .eq('id', id)
        .returns<FilaReporte[]>()
        .maybeSingle(),
    ]);
    if (respuesta.error) fallar(respuesta.error, respuesta.status);
    return respuesta.data ? aReporteVecinal(respuesta.data, idUsuario) : null;
  });
}

export async function crearReporte(_datos: DatosNuevoReporte): Promise<ReporteVecinal> {
  throw new Error('Función de la nube aún no implementada.');
}

export async function actualizarEstado(
  _id: string,
  _estado: EstadoReporte,
  _nota?: string
): Promise<ReporteVecinal> {
  throw new Error('Función de la nube aún no implementada.');
}
