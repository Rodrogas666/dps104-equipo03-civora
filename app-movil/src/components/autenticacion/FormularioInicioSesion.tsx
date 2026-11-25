import { useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EncabezadoAccesoCivora } from '@/components/autenticacion/EncabezadoAccesoCivora';
import { BotonPrincipal } from '@/components/ui/BotonPrincipal';
import {
  CampoTextoFormulario,
  type ReferenciaCampoTexto,
} from '@/components/ui/CampoTextoFormulario';
import { type OpcionPestana, SelectorPestanas } from '@/components/ui/SelectorPestanas';
import type { DatosInicioSesion, ModoAutenticacion } from '@/types/autenticacion';

export interface FormularioInicioSesionProps {
  opcionesModo: OpcionPestana<ModoAutenticacion>[];
  alCambiarModo: (modo: ModoAutenticacion) => void;
  alEnviar?: (datos: DatosInicioSesion) => void;
  /** true mientras se espera la respuesta: bloquea el botón. */
  enviando?: boolean;
  /** Mensaje de error visible para el usuario. */
  error?: string | null;
}

export function FormularioInicioSesion({
  opcionesModo,
  alCambiarModo,
  alEnviar,
  enviando = false,
  error = null,
}: FormularioInicioSesionProps) {
  const insets = useSafeAreaInsets();
  const referenciaContrasena = useRef<ReferenciaCampoTexto>(null);
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');

  const manejarEnvio = () => {
    if (enviando) return;
    alEnviar?.({ correo: correo.trim(), contrasena });
  };

  return (
    <View className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow px-6 pb-8"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <EncabezadoAccesoCivora />

        <SelectorPestanas
          opciones={opcionesModo}
          valorActual="inicioSesion"
          alCambiar={alCambiarModo}
          className="mb-7"
        />

        <View className="gap-5">
          <CampoTextoFormulario
            etiqueta="Correo"
            placeholder="tucorreo@ejemplo.com"
            value={correo}
            onChangeText={setCorreo}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            returnKeyType="next"
            onSubmitEditing={() => referenciaContrasena.current?.focus()}
          />

          <CampoTextoFormulario
            ref={referenciaContrasena}
            etiqueta="Contraseña"
            placeholder="••••••••"
            value={contrasena}
            onChangeText={setContrasena}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="current-password"
            returnKeyType="done"
            onSubmitEditing={manejarEnvio}
          />
        </View>
      </ScrollView>

      <View
        className="border-t border-civora-border/60 bg-civora-card px-6 pt-4"
        style={{ paddingBottom: Math.max(insets.bottom, 20) }}>
        {error ? <Text className="mb-3 text-sm font-semibold text-red-700">{error}</Text> : null}
        <BotonPrincipal
          texto={enviando ? 'Entrando…' : 'Entrar'}
          disabled={enviando}
          onPress={manejarEnvio}
        />
      </View>
    </View>
  );
}
