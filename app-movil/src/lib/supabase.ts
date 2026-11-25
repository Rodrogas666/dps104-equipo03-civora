/**
 * Cliente de Supabase.
 *
 * Interruptor: EXPO_PUBLIC_USAR_NUBE=true activa la nube. Si falta o es false,
 * la app usa los datos en memoria y el cliente es null (no se conecta a nada).
 */
import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export const USAR_NUBE = process.env.EXPO_PUBLIC_USAR_NUBE === 'true';

function crearCliente(): SupabaseClient | null {
  if (!USAR_NUBE) return null;

  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const claveAnonima = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !claveAnonima) {
    throw new Error(
      'EXPO_PUBLIC_USAR_NUBE=true, pero faltan EXPO_PUBLIC_SUPABASE_URL o ' +
        'EXPO_PUBLIC_SUPABASE_ANON_KEY en app-movil/.env. Revisa .env.example.'
    );
  }

  return createClient(url, claveAnonima, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
}

export const supabase = crearCliente();

/** Devuelve el cliente o lanza un error claro si se usa sin activar la nube. */
export function obtenerSupabase(): SupabaseClient {
  if (!supabase) {
    throw new Error('La nube está desactivada (EXPO_PUBLIC_USAR_NUBE no es true).');
  }
  return supabase;
}
