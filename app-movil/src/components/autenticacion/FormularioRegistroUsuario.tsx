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
import type { DatosRegistroUsuario, ModoAutenticacion } from '@/types/autenticacion';

export interface FormularioRegistroUsuarioProps {
  opcionesModo: OpcionPestana<ModoAutenticacion>[];
  alCambiarModo: (modo: ModoAutenticacion) => void;
  alEnviar?: (datos: DatosRegistroUsuario) => void;
  /** true mientras se espera la respuesta: bloquea el botón. */
  enviando?: boolean;
  /** Mensaje de error visible para el usuario. */
  error?: string | null;
}

export function FormularioRegistroUsuario({
  opcionesModo,
  alCambiarModo,
  alEnviar,
  enviando = false,
  error = null,
}: FormularioRegistroUsuarioProps) {
  const insets = useSafeAreaInsets();
  const referenciaCorreo = useRef<ReferenciaCampoTexto>(null);
  const referenciaContrasena = useRef<ReferenciaCampoTexto>(null);
  const referenciaDireccion = useRef<ReferenciaCampoTexto>(null);

  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [direccionResidencial, setDireccionResidencial] = useState('');

  const manejarEnvio = () => {
    if (enviando) return;
    alEnviar?.({
      nombre: nombre.trim(),
      correo: correo.trim(),
      contrasena,
      direccionResidencial: direccionResidencial.trim(),
    });
  };

  return (
    <View className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow px-6 pb-8"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <EncabezadoAccesoCivora compacto />

        <SelectorPestanas
          opciones={opcionesModo}
          valorActual="registro"
          alCambiar={alCambiarModo}
          className="mb-6"
        />

        <View className="gap-4">
          <CampoTextoFormulario
            etiqueta="Nombre"
            placeholder="Tu nombre"
            value={nombre}
            onChangeText={setNombre}
            autoCapitalize="words"
            autoComplete="name"
            returnKeyType="next"
            onSubmitEditing={() => referenciaCorreo.current?.focus()}
          />

          <CampoTextoFormulario
            ref={referenciaCorreo}
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
            placeholder="Mínimo 6 caracteres"
            value={contrasena}
            onChangeText={setContrasena}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="new-password"
            returnKeyType="next"
            onSubmitEditing={() => referenciaDireccion.current?.focus()}
          />

          <CampoTextoFormulario
            ref={referenciaDireccion}
            etiqueta="Pasaje y polígono donde vives"
            placeholder="Ej. Pasaje 5, Polígono C"
            value={direccionResidencial}
            onChangeText={setDireccionResidencial}
            autoCapitalize="words"
            returnKeyType="done"
            onSubmitEditing={manejarEnvio}
          />

          <Text className="mt-1 text-xs leading-5 text-civora-muted">
            Tu cuenta es de vecino. La directiva recibe su acceso de la administración.
          </Text>
        </View>
      </ScrollView>

      <View
        className="border-t border-civora-border/60 bg-civora-card px-6 pt-4"
        style={{ paddingBottom: Math.max(insets.bottom, 20) }}>
        {error ? <Text className="mb-3 text-sm font-semibold text-red-700">{error}</Text> : null}
        <BotonPrincipal
          texto={enviando ? 'Creando cuenta…' : 'Crear cuenta'}
          disabled={enviando}
          onPress={manejarEnvio}
        />
      </View>
    </View>
  );
}
