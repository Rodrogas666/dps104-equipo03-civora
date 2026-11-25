/**
 * Autenticación con Supabase (solo se usa cuando EXPO_PUBLIC_USAR_NUBE=true).
 * El rol sale de la tabla `perfiles`, nunca del correo.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from '@supabase/supabase-js';

import { obtenerSupabase } from '@/lib/supabase';
import { esErrorDeConexion, MENSAJES_ERROR, mensajeDeError } from '@/services/errores';
import type { RolUsuario } from '@/types/autenticacion';

export interface PerfilUsuario {
  id: string;
  correo: string;
  nombre: string;
  rol: RolUsuario;
  residencial: string;
  pasajePoligono: string;
}

export interface DatosRegistroNube {
  nombre?: string;
  residencial?: string;
  pasajePoligono?: string;
}

interface FilaPerfil {
  id: string;
  correo: string;
  nombre: string;
  rol: RolUsuario;
  residencial: string;
  pasaje_poligono: string | null;
}

const SIN_ESPECIFICAR = 'Sin especificar';

/** Traduce los errores de Supabase Auth a mensajes claros en español. */
export function mensajeErrorAutenticacion(error: unknown): string {
  if (esErrorDeConexion(error)) return MENSAJES_ERROR.sinConexion;
  const datos = (error && typeof error === 'object' ? error : {}) as {
    code?: unknown;
    message?: unknown;
  };
  const codigo = typeof datos.code === 'string' ? datos.code : '';
  const mensaje = typeof datos.message === 'string' ? datos.message : '';

  if (codigo === 'invalid_credentials' || /invalid login credentials/i.test(mensaje)) {
    return 'Correo o contraseña incorrectos.';
  }
  if (
    codigo === 'user_already_exists' ||
    codigo === 'email_exists' ||
    /already registered|already exists/i.test(mensaje)
  ) {
    return 'Ese correo ya está registrado. Inicia sesión.';
  }
  if (codigo === 'weak_password' || /password should be at least/i.test(mensaje)) {
    return 'La contraseña debe tener al menos 6 caracteres.';
  }
  if (codigo === 'email_not_confirmed' || /email not confirmed/i.test(mensaje)) {
    return 'Confirma tu correo antes de iniciar sesión.';
  }
  if (codigo === 'email_address_invalid' || /invalid.*email|email.*invalid/i.test(mensaje)) {
    return 'Escribe un correo válido.';
  }
  if (codigo.startsWith('over_') || /rate limit/i.test(mensaje)) {
    return 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.';
  }
  return mensajeDeError(error);
}

function fallarAutenticacion(error: unknown): never {
  throw new Error(mensajeErrorAutenticacion(error));
}

/** Lee el perfil del usuario; si no existe aún, usa los datos del registro. */
export async function obtenerPerfil(usuario: User): Promise<PerfilUsuario> {
  const { data, error, status } = await obtenerSupabase()
    .from('perfiles')
    .select('id, correo, nombre, rol, residencial, pasaje_poligono')
    .eq('id', usuario.id)
    .returns<FilaPerfil[]>()
    .maybeSingle();
  if (error) throw new Error(mensajeDeError(error, status));

  const metadatos = (usuario.user_metadata ?? {}) as Record<string, unknown>;
  const texto = (valor: unknown) => (typeof valor === 'string' && valor.trim() ? valor : '');

  return {
    id: usuario.id,
    correo: data?.correo ?? usuario.email ?? '',
    nombre: data?.nombre || texto(metadatos.nombre) || (usuario.email ?? '').split('@')[0] || 'Vecino',
    rol: data?.rol === 'directiva' ? 'directiva' : 'vecino',
    residencial: data?.residencial || texto(metadatos.residencial) || 'Residencial Las Palmas',
    pasajePoligono:
      data?.pasaje_poligono || texto(metadatos.pasaje_poligono) || SIN_ESPECIFICAR,
  };
}

function validarCampos(correo: string, contrasena: string | undefined): string {
  if (!correo.trim() || !contrasena) {
    throw new Error('Escribe tu correo y tu contraseña.');
  }
  return correo.trim();
}

export async function iniciarSesionNube(
  correo: string,
  contrasena: string | undefined
): Promise<PerfilUsuario> {
  const correoLimpio = validarCampos(correo, contrasena);
  try {
    const { data, error } = await obtenerSupabase().auth.signInWithPassword({
      email: correoLimpio,
      password: contrasena ?? '',
    });
    if (error) fallarAutenticacion(error);
    return await obtenerPerfil(data.user);
  } catch (error) {
    if (error instanceof Error && !esErrorDeConexion(error)) throw error;
    fallarAutenticacion(error);
  }
}

export async function registrarNube(
  correo: string,
  contrasena: string | undefined,
  datos: DatosRegistroNube
): Promise<PerfilUsuario> {
  const correoLimpio = validarCampos(correo, contrasena);
  try {
    const { data, error } = await obtenerSupabase().auth.signUp({
      email: correoLimpio,
      password: contrasena ?? '',
      options: {
        // El disparador `al_crear_usuario` crea el perfil con estos datos.
        data: {
          nombre: datos.nombre?.trim() || undefined,
          residencial: datos.residencial?.trim() || undefined,
          pasaje_poligono: datos.pasajePoligono?.trim() || undefined,
        },
      },
    });
    if (error) fallarAutenticacion(error);
    if (!data.user) throw new Error(MENSAJES_ERROR.generico);
    if (!data.session) {
      // "Confirm email" está activado en Supabase: no hay sesión hasta confirmar.
      throw new Error('Te enviamos un correo para confirmar tu cuenta. Confírmala y luego inicia sesión.');
    }
    return await obtenerPerfil(data.user);
  } catch (error) {
    if (error instanceof Error && !esErrorDeConexion(error)) throw error;
    fallarAutenticacion(error);
  }
}

/** Perfil de la sesión guardada en el teléfono, o null si no hay sesión. */
export async function restaurarSesionNube(): Promise<PerfilUsuario | null> {
  const { data } = await obtenerSupabase().auth.getSession();
  const usuario = data.session?.user;
  return usuario ? obtenerPerfil(usuario) : null;
}

export async function cerrarSesionNube(): Promise<void> {
  const { error } = await obtenerSupabase().auth.signOut();
  if (error) {
    // Sin red, Supabase no borra la sesión guardada: se borra a mano para no reentrar al abrir la app.
    const claves = await AsyncStorage.getAllKeys();
    await AsyncStorage.multiRemove(
      claves.filter((clave) => clave.startsWith('sb-') && clave.endsWith('-auth-token'))
    );
  }
}

/** Avisa cuando Supabase cierra la sesión (p. ej. token vencido). Devuelve la función para dejar de escuchar. */
export function escucharCierreSesionNube(alCerrar: () => void): () => void {
  const { data } = obtenerSupabase().auth.onAuthStateChange((evento) => {
    if (evento === 'SIGNED_OUT') alCerrar();
  });
  return () => data.subscription.unsubscribe();
}
