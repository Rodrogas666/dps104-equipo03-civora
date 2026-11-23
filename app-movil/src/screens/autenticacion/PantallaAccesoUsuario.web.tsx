import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { EncabezadoAccesoCivora } from '@/components/autenticacion/EncabezadoAccesoCivora';
import { FormularioInicioSesion } from '@/components/autenticacion/FormularioInicioSesion';
import { FormularioRegistroUsuario } from '@/components/autenticacion/FormularioRegistroUsuario';
import type { OpcionPestana } from '@/components/ui/SelectorPestanas';
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

  const manejarInicioSesion = (_datos: DatosInicioSesion) => {
    // TODO: Conectar inicio de sesión con src/services/
    router.replace('/inicio');
  };

  const manejarRegistro = (_datos: DatosRegistroUsuario) => {
    // TODO: Conectar registro de usuario con src/services/
    router.replace('/inicio');
  };

  return (
    <ScrollView
      className="flex-1 bg-civora-bg"
      contentContainerClassName="min-h-screen flex-grow items-center justify-center p-4 md:p-8">
      <View className="w-full max-w-4xl overflow-hidden rounded-3xl border border-civora-border bg-civora-card shadow-sm lg:flex-row">
        <View className="hidden justify-between bg-civora-primary p-10 lg:flex lg:w-5/12">
          <View>
            <Text className="text-4xl font-bold tracking-tight text-white">civora</Text>
            <Text className="mt-2 text-base text-civora-surface/90">
              Reporta. Sigue. Mejora.
            </Text>
          </View>

          <View className="gap-4">
            <View className="rounded-2xl bg-white/10 p-4">
              <Text className="text-sm font-semibold text-white">Reportes con evidencia</Text>
              <Text className="mt-1 text-xs leading-5 text-civora-surface/90">
                Informa baches, basura y alumbrado dañado con foto y ubicación exacta.
              </Text>
            </View>
            <View className="rounded-2xl bg-white/10 p-4">
              <Text className="text-sm font-semibold text-white">Seguimiento transparente</Text>
              <Text className="mt-1 text-xs leading-5 text-civora-surface/90">
                Consulta el estado en tiempo real: Pendiente, En proceso o Resuelto.
              </Text>
            </View>
          </View>

          <Text className="text-xs text-civora-surface/75">
            Civora · Gestión vecinal y mejora comunitaria
          </Text>
        </View>

        <View className="w-full bg-civora-bg p-6 sm:p-10 lg:w-7/12">
          <View className="lg:hidden">
            <EncabezadoAccesoCivora compacto={modoActual === 'registro'} />
          </View>

          <View className="mb-6 hidden lg:flex">
            <Text className="text-2xl font-bold text-civora-text">
              {modoActual === 'inicioSesion'
                ? 'Bienvenido de vuelta'
                : 'Crea tu cuenta de vecino'}
            </Text>
            <Text className="mt-1 text-sm text-civora-muted">
              {modoActual === 'inicioSesion'
                ? 'Ingresa con tu correo y contraseña para continuar.'
                : 'Completa tus datos para reportar incidencias en tu residencial.'}
            </Text>
          </View>

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
        </View>
      </View>
    </ScrollView>
  );
}
