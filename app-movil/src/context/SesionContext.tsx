import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from 'react';

import type { RolUsuario } from '@/types/autenticacion';

export interface OpcionesInicioSesion {
  nombre?: string;
  pasajePoligono?: string;
  residencial?: string;
}

interface SesionValor {
  rol: RolUsuario;
  correo: string | null;
  nombre: string;
  pasajePoligono: string;
  residencial: string;
  iniciarSesion: (correo: string, opciones?: OpcionesInicioSesion) => void;
  cerrarSesion: () => void;
}

const SesionContext = createContext<SesionValor | null>(null);

const DATOS_POR_DEFECTO = {
  nombre: 'Ana Rivas',
  correo: 'ana.rivas@correo.com',
  pasajePoligono: 'Pasaje 5, Polígono C',
  residencial: 'Residencial Las Palmas',
} as const;

/**
 * Mientras no haya nube, el rol se deduce del correo: los que empiezan con
 * "directiva" (p. ej. directiva@civora.com) entran como directiva.
 * Con la nube, el rol vendrá del perfil del usuario y lo asigna la administración.
 */
export function rolDesdeCorreo(correo: string): RolUsuario {
  return correo.trim().toLowerCase().startsWith('directiva') ? 'directiva' : 'vecino';
}

function deducirNombreDesdeCorreo(correo: string): string {
  const limpio = correo.trim();
  if (!limpio) return DATOS_POR_DEFECTO.nombre;
  const usuario = limpio.split('@')[0];
  if (!usuario) return DATOS_POR_DEFECTO.nombre;
  return usuario
    .split(/[._-]+/)
    .filter(Boolean)
    .map((parte) => parte.charAt(0).toUpperCase() + parte.slice(1).toLowerCase())
    .join(' ');
}

export function SesionProvider({ children }: { children: ReactNode }) {
  const [correo, setCorreo] = useState<string | null>(null);
  const [rol, setRol] = useState<RolUsuario>('vecino');
  const [nombre, setNombre] = useState<string>(DATOS_POR_DEFECTO.nombre);
  const [pasajePoligono, setPasajePoligono] = useState<string>(
    DATOS_POR_DEFECTO.pasajePoligono
  );
  const [residencial, setResidencial] = useState<string>(DATOS_POR_DEFECTO.residencial);

  const iniciarSesion = useCallback(
    (nuevoCorreo: string, opciones?: OpcionesInicioSesion) => {
      const correoLimpio = nuevoCorreo.trim() || DATOS_POR_DEFECTO.correo;
      setCorreo(correoLimpio);
      setRol(rolDesdeCorreo(correoLimpio));
      setNombre(opciones?.nombre?.trim() || deducirNombreDesdeCorreo(correoLimpio));
      setPasajePoligono(
        opciones?.pasajePoligono?.trim() || DATOS_POR_DEFECTO.pasajePoligono
      );
      setResidencial(opciones?.residencial?.trim() || DATOS_POR_DEFECTO.residencial);
    },
    []
  );

  const cerrarSesion = useCallback(() => {
    setCorreo(null);
    setRol('vecino');
    setNombre(DATOS_POR_DEFECTO.nombre);
    setPasajePoligono(DATOS_POR_DEFECTO.pasajePoligono);
    setResidencial(DATOS_POR_DEFECTO.residencial);
  }, []);

  const valor = useMemo(
    () => ({
      rol,
      correo,
      nombre,
      pasajePoligono,
      residencial,
      iniciarSesion,
      cerrarSesion,
    }),
    [rol, correo, nombre, pasajePoligono, residencial, iniciarSesion, cerrarSesion]
  );

  return <SesionContext.Provider value={valor}>{children}</SesionContext.Provider>;
}

export function useSesion(): SesionValor {
  const contexto = useContext(SesionContext);
  if (!contexto) throw new Error('useSesion debe usarse dentro de <SesionProvider>.');
  return contexto;
}
