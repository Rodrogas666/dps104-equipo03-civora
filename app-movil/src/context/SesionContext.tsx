import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from 'react';

import type { RolUsuario } from '@/types/autenticacion';

interface SesionValor {
  rol: RolUsuario;
  correo: string | null;
  iniciarSesion: (correo: string) => void;
  cerrarSesion: () => void;
}

const SesionContext = createContext<SesionValor | null>(null);

/**
 * Mientras no haya nube, el rol se deduce del correo: los que empiezan con
 * "directiva" (p. ej. directiva@civora.com) entran como directiva.
 * Con la nube, el rol vendrá del perfil del usuario y lo asigna la administración.
 */
export function rolDesdeCorreo(correo: string): RolUsuario {
  return correo.trim().toLowerCase().startsWith('directiva') ? 'directiva' : 'vecino';
}

export function SesionProvider({ children }: { children: ReactNode }) {
  const [correo, setCorreo] = useState<string | null>(null);
  const [rol, setRol] = useState<RolUsuario>('vecino');

  const iniciarSesion = useCallback((nuevoCorreo: string) => {
    setCorreo(nuevoCorreo);
    setRol(rolDesdeCorreo(nuevoCorreo));
  }, []);

  const cerrarSesion = useCallback(() => {
    setCorreo(null);
    setRol('vecino');
  }, []);

  const valor = useMemo(
    () => ({ rol, correo, iniciarSesion, cerrarSesion }),
    [rol, correo, iniciarSesion, cerrarSesion]
  );

  return <SesionContext.Provider value={valor}>{children}</SesionContext.Provider>;
}

export function useSesion(): SesionValor {
  const contexto = useContext(SesionContext);
  if (!contexto) throw new Error('useSesion debe usarse dentro de <SesionProvider>.');
  return contexto;
}
