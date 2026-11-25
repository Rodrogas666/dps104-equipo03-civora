import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { USAR_NUBE } from '@/lib/supabase';
import {
  cerrarSesionNube,
  escucharCierreSesionNube,
  iniciarSesionNube,
  type PerfilUsuario,
  registrarNube,
  restaurarSesionNube,
} from '@/services/autenticacionNube';
import type { RolUsuario } from '@/types/autenticacion';

export interface OpcionesInicioSesion {
  nombre?: string;
  pasajePoligono?: string;
  residencial?: string;
  /** Obligatoria con la nube; en modo en memoria se ignora. */
  contrasena?: string;
  /** true: crea la cuenta (registro) en lugar de iniciar sesión. */
  crearCuenta?: boolean;
}

interface SesionValor {
  rol: RolUsuario;
  correo: string | null;
  nombre: string;
  pasajePoligono: string;
  residencial: string;
  /** Id del usuario en la nube (null sin sesión o en modo en memoria). */
  idUsuario: string | null;
  /** true si al abrir la app se encontró una sesión guardada (solo con la nube). */
  sesionRestaurada: boolean;
  /** Lanza Error con un mensaje en español si no se pudo entrar. */
  iniciarSesion: (correo: string, opciones?: OpcionesInicioSesion) => Promise<void>;
  cerrarSesion: () => Promise<void>;
}

const SesionContext = createContext<SesionValor | null>(null);

const DATOS_POR_DEFECTO = {
  nombre: 'Ana Rivas',
  correo: 'ana.rivas@correo.com',
  pasajePoligono: 'Pasaje 5, Polígono C',
  residencial: 'Residencial Las Palmas',
} as const;

/**
 * Solo en modo en memoria: el rol se deduce del correo; los que empiezan con
 * "directiva" (p. ej. directiva@civora.com) entran como directiva.
 * Con la nube, el rol viene de la tabla `perfiles` y lo asigna la administración.
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
  const [nombre, setNombre] = useState<string>('');
  const [pasajePoligono, setPasajePoligono] = useState<string>('');
  const [residencial, setResidencial] = useState<string>(DATOS_POR_DEFECTO.residencial);
  const [idUsuario, setIdUsuario] = useState<string | null>(null);
  const [sesionRestaurada, setSesionRestaurada] = useState(false);

  const aplicarPerfil = useCallback((perfil: PerfilUsuario) => {
    setIdUsuario(perfil.id);
    setCorreo(perfil.correo);
    setRol(perfil.rol);
    setNombre(perfil.nombre);
    setPasajePoligono(perfil.pasajePoligono);
    setResidencial(perfil.residencial);
  }, []);

  const limpiarSesion = useCallback(() => {
    setIdUsuario(null);
    setSesionRestaurada(false);
    setCorreo(null);
    setRol('vecino');
    // Sin sesión no se vuelve a datos de ejemplo.
    setNombre('');
    setPasajePoligono('');
    setResidencial(DATOS_POR_DEFECTO.residencial);
  }, []);

  // Con la nube: restaura la sesión guardada al abrir la app y escucha cierres de sesión.
  useEffect(() => {
    if (!USAR_NUBE) return;
    let cancelado = false;
    restaurarSesionNube()
      .then((perfil) => {
        if (cancelado || !perfil) return;
        aplicarPerfil(perfil);
        setSesionRestaurada(true);
      })
      .catch(() => {
        // Sin red o sesión inválida: el usuario inicia sesión de nuevo.
      });
    const dejarDeEscuchar = escucharCierreSesionNube(limpiarSesion);
    return () => {
      cancelado = true;
      dejarDeEscuchar();
    };
  }, [aplicarPerfil, limpiarSesion]);

  const iniciarSesion = useCallback(
    async (nuevoCorreo: string, opciones?: OpcionesInicioSesion) => {
      if (USAR_NUBE) {
        const perfil = opciones?.crearCuenta
          ? await registrarNube(nuevoCorreo, opciones.contrasena, {
              nombre: opciones.nombre,
              residencial: opciones.residencial,
              pasajePoligono: opciones.pasajePoligono,
            })
          : await iniciarSesionNube(nuevoCorreo, opciones?.contrasena);
        aplicarPerfil(perfil);
        return;
      }

      const correoLimpio = nuevoCorreo.trim() || DATOS_POR_DEFECTO.correo;
      setCorreo(correoLimpio);
      setRol(rolDesdeCorreo(correoLimpio));
      setNombre(opciones?.nombre?.trim() || deducirNombreDesdeCorreo(correoLimpio));
      setPasajePoligono(
        opciones?.pasajePoligono?.trim() || DATOS_POR_DEFECTO.pasajePoligono
      );
      setResidencial(opciones?.residencial?.trim() || DATOS_POR_DEFECTO.residencial);
    },
    [aplicarPerfil]
  );

  const cerrarSesion = useCallback(async () => {
    // Se limpia primero para que la pantalla de acceso no vuelva a entrar sola.
    limpiarSesion();
    if (!USAR_NUBE) return;
    try {
      await cerrarSesionNube();
    } catch {
      // Sin red: la sesión local ya se borró; el token vencerá solo.
    }
  }, [limpiarSesion]);

  const valor = useMemo(
    () => ({
      rol,
      correo,
      nombre,
      pasajePoligono,
      residencial,
      idUsuario,
      sesionRestaurada,
      iniciarSesion,
      cerrarSesion,
    }),
    [
      rol,
      correo,
      nombre,
      pasajePoligono,
      residencial,
      idUsuario,
      sesionRestaurada,
      iniciarSesion,
      cerrarSesion,
    ]
  );

  return <SesionContext.Provider value={valor}>{children}</SesionContext.Provider>;
}

export function useSesion(): SesionValor {
  const contexto = useContext(SesionContext);
  if (!contexto) throw new Error('useSesion debe usarse dentro de <SesionProvider>.');
  return contexto;
}
