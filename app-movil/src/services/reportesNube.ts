/**
 * Implementación en la nube (Supabase). Se usa cuando EXPO_PUBLIC_USAR_NUBE=true.
 * Todas las funciones lanzan Error con un mensaje en español si algo falla.
 */
import { obtenerSupabase } from '@/lib/supabase';
import { errorEnEspanol } from '@/services/errores';
import { FOTO_POR_DEFECTO, formatearFechaHora, tituloReporte } from '@/services/formatoReportes';
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

const BUCKET_FOTOS = 'fotos-reportes';

/**
 * Sube la foto al bucket `fotos-reportes/<idUsuario>/<fecha>.jpg` y devuelve su URL pública.
 * - Sin foto: devuelve la foto por defecto (como en memoria).
 * - URL http(s) (p. ej. las fotos de ejemplo): ya es pública, se usa tal cual.
 * Si la subida falla lanza Error y el reporte NO se crea.
 */
export async function subirFoto(uri: string | null): Promise<string> {
  if (!uri) return FOTO_POR_DEFECTO;
  if (/^https?:\/\//i.test(uri)) return uri;

  const cliente = obtenerSupabase();
  const idUsuario = await idUsuarioActual();
  if (!idUsuario) fallar({ status: 401 });

  try {
    const contenido = await (await fetch(uri)).arrayBuffer();
    const ruta = `${idUsuario}/${Date.now()}.jpg`;
    const { error } = await cliente.storage
      .from(BUCKET_FOTOS)
      .upload(ruta, contenido, { contentType: 'image/jpeg', upsert: false });
    if (error) throw error;
    return cliente.storage.from(BUCKET_FOTOS).getPublicUrl(ruta).data.publicUrl;
  } catch (error) {
    throw new ErrorServicio(`No pudimos subir la foto. ${errorEnEspanol(error).message}`);
  }
}

export function crearReporte(datos: DatosNuevoReporte): Promise<ReporteVecinal> {
  return conErroresEnEspanol(async () => {
    const idUsuario = await idUsuarioActual();
    if (!idUsuario) fallar({ status: 401 });

    // Primero la foto: si falla, no se crea el reporte.
    const fotoUrl = await subirFoto(datos.fotoUrl);
    const ubicacion = datos.ubicacion || 'Residencial Las Palmas';

    const respuesta = await obtenerSupabase()
      .from('reportes')
      .insert({
        autor_id: idUsuario,
        categoria: datos.categoria,
        titulo: tituloReporte(datos.categoria, datos.ubicacion),
        descripcion: datos.descripcion || null,
        ubicacion_texto: ubicacion,
        latitud: datos.latitud ?? null,
        longitud: datos.longitud ?? null,
        foto_url: fotoUrl || null,
      })
      .select(COLUMNAS_REPORTE)
      .returns<FilaReporte[]>()
      .single();
    if (respuesta.error) fallar(respuesta.error, respuesta.status);
    return releerConHistorial(respuesta.data, idUsuario);
  });
}

/**
 * Vuelve a leer el reporte recién escrito para traer el historial que agregan los
 * disparadores (la respuesta de insert/update no alcanza a verlo). Si esa lectura
 * falla, devuelve la fila de la escritura: el cambio ya se guardó y no debe reintentarse.
 */
async function releerConHistorial(
  fila: FilaReporte,
  idUsuario: string | null
): Promise<ReporteVecinal> {
  try {
    const completo = await obtenerReporte(fila.id);
    if (completo) return completo;
  } catch {
    // Se usa la fila de la escritura.
  }
  return aReporteVecinal(fila, idUsuario);
}

/** La base solo deja actualizar a la directiva (RLS + rol en `perfiles`). */
export function actualizarEstado(
  id: string,
  estado: EstadoReporte,
  nota?: string
): Promise<ReporteVecinal> {
  return conErroresEnEspanol(async () => {
    const cliente = obtenerSupabase();
    const [idUsuario, respuesta] = await Promise.all([
      idUsuarioActual(),
      cliente
        .from('reportes')
        .update({ estado, nota: nota?.trim() || null })
        .eq('id', id)
        .select(COLUMNAS_REPORTE)
        .returns<FilaReporte[]>()
        .maybeSingle(),
    ]);
    if (respuesta.error) fallar(respuesta.error, respuesta.status);
    if (!respuesta.data) {
      // Sin filas actualizadas: o no existe, o RLS lo bloqueó por no ser directiva.
      const existe = await obtenerReporte(id);
      fallar({ status: existe ? 403 : 404 });
    }
    return releerConHistorial(respuesta.data, idUsuario);
  });
}
