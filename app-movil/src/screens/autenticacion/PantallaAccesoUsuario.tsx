import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FormularioInicioSesion } from '@/components/autenticacion/FormularioInicioSesion';
import { FormularioRegistroUsuario } from '@/components/autenticacion/FormularioRegistroUsuario';
import type { OpcionPestana } from '@/components/ui/SelectorPestanas';
import { ColoresCivora } from '@/constants/coloresCivora';
import { useSesion } from '@/context/SesionContext';
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
  const { iniciarSesion } = useSesion();

  const manejarInicioSesion = (datos: DatosInicioSesion) => {
    // TODO: Conectar inicio de sesión con src/services/
    iniciarSesion(datos.correo);
    router.replace('/inicio');
  };

  const manejarRegistro = (datos: DatosRegistroUsuario) => {
    // TODO: Conectar registro de usuario con src/services/
    iniciarSesion(datos.correo, {
      nombre: datos.nombre,
      pasajePoligono: datos.direccionResidencial,
    });
    router.replace('/inicio');
  };

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
            alCambiarModo={setModoActual}
            alEnviar={manejarInicioSesion}
          />
        ) : (
          <FormularioRegistroUsuario
            opcionesModo={OPCIONES_ACCESO}
            alCambiarModo={setModoActual}
            alEnviar={manejarRegistro}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
