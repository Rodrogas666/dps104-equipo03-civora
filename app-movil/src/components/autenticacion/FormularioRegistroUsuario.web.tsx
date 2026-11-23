import { useRef, useState } from 'react';
import { Text, View } from 'react-native';

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
}

export function FormularioRegistroUsuario({
  opcionesModo,
  alCambiarModo,
  alEnviar,
}: FormularioRegistroUsuarioProps) {
  const referenciaCorreo = useRef<ReferenciaCampoTexto>(null);
  const referenciaContrasena = useRef<ReferenciaCampoTexto>(null);
  const referenciaDireccion = useRef<ReferenciaCampoTexto>(null);

  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [direccionResidencial, setDireccionResidencial] = useState('');

  const manejarEnvio = () => {
    alEnviar?.({
      nombre: nombre.trim(),
      correo: correo.trim(),
      contrasena,
      direccionResidencial: direccionResidencial.trim(),
    });
  };

  return (
    <View className="w-full">
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

      <View className="mt-7">
        <BotonPrincipal texto="Crear cuenta" onPress={manejarEnvio} />
      </View>
    </View>
  );
}
