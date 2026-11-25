/**
 * Traduce errores de red, Supabase (base, auth y almacenamiento) a mensajes
 * claros en español para mostrarlos al usuario.
 */

export const MENSAJES_ERROR = {
  sinConexion: 'Sin conexión. Revisa tu Internet e inténtalo de nuevo.',
  sinPermiso: 'No tienes permiso para hacer esto.',
  noEncontrado: 'No encontramos ese reporte.',
  yaExiste: 'Ese dato ya existe.',
  servidor: 'El servidor tuvo un problema. Inténtalo en unos minutos.',
  generico: 'Ocurrió un problema inesperado. Inténtalo de nuevo.',
} as const;

interface ErrorConDatos {
  message?: unknown;
  name?: unknown;
  code?: unknown;
  status?: unknown;
  statusCode?: unknown;
}

function aNumero(valor: unknown): number | undefined {
  const numero = typeof valor === 'string' ? Number(valor) : valor;
  return typeof numero === 'number' && Number.isFinite(numero) ? numero : undefined;
}

/** true si el error parece una falla de red (sin Internet, DNS, tiempo agotado). */
export function esErrorDeConexion(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const { message, name, status } = error as ErrorConDatos;
  const texto = `${String(name ?? '')} ${String(message ?? '')}`;
  return (
    aNumero(status) === 0 ||
    /network request failed|failed to fetch|fetch failed|network ?error|timed? ?out|AuthRetryableFetchError|ENOTFOUND|ECONNREFUSED/i.test(
      texto
    )
  );
}

/**
 * @param error  error lanzado o devuelto por Supabase / fetch
 * @param status código HTTP de la respuesta, si se conoce
 */
export function mensajeDeError(error: unknown, status?: number): string {
  if (esErrorDeConexion(error)) return MENSAJES_ERROR.sinConexion;

  const datos = (error && typeof error === 'object' ? error : {}) as ErrorConDatos;
  const codigo = typeof datos.code === 'string' ? datos.code : '';
  const mensaje = typeof datos.message === 'string' ? datos.message : '';
  const http = status ?? aNumero(datos.status) ?? aNumero(datos.statusCode);

  if (
    http === 401 ||
    http === 403 ||
    codigo === '42501' ||
    codigo.startsWith('PGRST3') ||
    /row-level security|permission denied|not authorized|jwt/i.test(mensaje)
  ) {
    return MENSAJES_ERROR.sinPermiso;
  }
  if (http === 404 || codigo === 'PGRST116') return MENSAJES_ERROR.noEncontrado;
  if (http === 409 || codigo === '23505') return MENSAJES_ERROR.yaExiste;
  if (http !== undefined && http >= 500) return MENSAJES_ERROR.servidor;
  return MENSAJES_ERROR.generico;
}

/** Crea un Error con el mensaje en español (lo que los servicios lanzan). */
export function errorEnEspanol(error: unknown, status?: number): Error {
  return new Error(mensajeDeError(error, status));
}
