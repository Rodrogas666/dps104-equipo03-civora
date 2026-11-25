import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FormularioInicioSesion } from '@/components/autenticacion/FormularioInicioSesion';
import { FormularioRegistroUsuario } from '@/components/autenticacion/FormularioRegistroUsuario';
import type { OpcionPestana } from '@/components/ui/SelectorPestanas';
import { ColoresCivora } from '@/constants/coloresCivora';
import { type OpcionesInicioSesion, useSesion } from '@/context/SesionContext';
import type {
  DatosInicioSesion,
  DatosRegistroUsuario,
  ModoAutenticacion,
} from '@/types/autenticacion';

const OPCIONES_ACCESO: OpcionPestana<ModoAutenticacion>[] = [
  { etiqueta: 'Iniciar sesión', valor: 'inicioSesion' },
  { etiqueta: 'Crear cuenta', valor: 'registro' },
];

export function PantallaAccesoUsuario() {
  const [modoActual, setModoActual] = useState<ModoAutenticacion>('inicioSesion');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { iniciarSesion, sesionRestaurada } = useSesion();

  // Con la nube: si al abrir la app había una sesión guardada, entra directo.
  useEffect(() => {
    if (sesionRestaurada) router.replace('/inicio');
  }, [sesionRestaurada]);

  const cambiarModo = (modo: ModoAutenticacion) => {
    setError(null);
    setModoActual(modo);
  };

  const entrar = async (correo: string, opciones: OpcionesInicioSesion) => {
    if (enviando) return;
    setEnviando(true);
    setError(null);
    try {
      await iniciarSesion(correo, opciones);
      router.replace('/inicio');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No pudimos entrar. Inténtalo de nuevo.');
    } finally {
      setEnviando(false);
    }
  };

  const manejarInicioSesion = (datos: DatosInicioSesion) =>
    void entrar(datos.correo, { contrasena: datos.contrasena });

  const manejarRegistro = (datos: DatosRegistroUsuario) =>
    void entrar(datos.correo, {
      crearCuenta: true,
      contrasena: datos.contrasena,
      nombre: datos.nombre,
      pasajePoligono: datos.direccionResidencial,
    });

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={{ flex: 1, backgroundColor: ColoresCivora.background }}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {modoActual === 'inicioSesion' ? (
          <FormularioInicioSesion
            opcionesModo={OPCIONES_ACCESO}
            alCambiarModo={cambiarModo}
            alEnviar={manejarInicioSesion}
            enviando={enviando}
            error={error}
          />
        ) : (
          <FormularioRegistroUsuario
            opcionesModo={OPCIONES_ACCESO}
            alCambiarModo={cambiarModo}
            alEnviar={manejarRegistro}
            enviando={enviando}
            error={error}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
